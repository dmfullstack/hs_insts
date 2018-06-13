const express = require('express');
const router = express.Router();
const request = require('superagent');
const config = require('../config');
const retrieveCommitQualityFromRedis = require('../services/retrieveCommitQualityFromRedis');
const submitForEvaluation = require('../services/submitForEvaluation');
const updateCommitQualityInRedis = require('../services/updateCommitQualityInRedis');
const retrieveResultFromSonarQube = require('../services/retrieveResultFromSonarQube');
const getFormattedResponse = require('../services/getFormattedResponse');
const getAllSessions = require('../services/getAllSessions');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/submissionList', function(req, res){
	let url = `${config.hobbesUrl}/api/v1/facade/reports/evaluations/1493942400?q=after&limit=${req.query.limit}&page=${req.query.page}`;
	if(req.query.users !== undefined){
		url = `${config.hobbesUrl}/api/v1/facade/reports/evaluations/1493942400?q=after&limit=${req.query.limit}&page=${req.query.page}&users=${req.query.users}&assignment=${req.query.assignment}`;
	}

	request
    .get(url)
    .end(function(err, response){
      	if(err){
      		console.log(err)
			return err;
		}
      	res.status(200).json(response.body);
    });
});

router.get('/hobbes', (req, res) => {
  res.send(`${config.hobbesUrl}`);
});

router.get('/commits', (req, res) => {
  const assignment = req.query.assignment.split(':').slice(-1)[0].split('/').slice(-2).join('/').replace('.git', '');
  console.log('assignment:', assignment);
  const projectUrl = `${config.gitlabUrl}/api/v3/projects/${encodeURIComponent(assignment)}`;
  request.get(projectUrl)
    .set('PRIVATE-TOKEN', config.gitlabPrivateAccessToken)
    .end(function(err, response) {
      if(err) { res.status(500).json(err); return; }
      const projectId = response.body.id;
      const commitUrl = `${config.gitlabUrl}/api/v3/projects/${projectId}/repository/commits`;

      request.get(commitUrl)
        .set('PRIVATE-TOKEN', config.gitlabPrivateAccessToken)
        .end(function(err, response) {
          if(err) { res.status(500).json(err); return; }
          res.json(response.body);
        });

    });
});

router.get('/assignment/:assignmentId/commits/:commitId/quality', (req, res) => {
  const {assignmentId,commitId} = req.params;
  retrieveCommitQualityFromRedis(commitId, (err, commitQuality) => {
    if(err) { console.log('ERRR1'); handleError(err, res); return; }
    if(commitQuality && commitQuality === 'evaluation') { checkResultInSonarQube(commitId, res); return; }
    if(commitQuality) { res.status(200).send(commitQuality); return; }

    submitForEvaluation({assignmentId, commitId}, (err, response) => {
      console.log('PING');
      if(err) { console.log('ERRR2'); handleError(err, res); return; }
      updateCommitQualityInRedis(commitId, 'evaluation', (err) => {
        if(err) { console.log('ERRR3'); handleError(err, res); return; }
        res.status(202).send();
      });
    });
  });
});

router.get('/sessions', (req, res) => {
  getAllSessions((err, sessions) => {
    if(err) { handleError(err, res); return; }
    res.json(sessions);
  });
});

router.get('/waves', (req, res) => {
  request
    .get(`${config.gitlabUrl}/api/v3/groups`)
    .query({search: 'wave'})
    .set('PRIVATE-TOKEN', config.gitlabPrivateAccessToken)
    .end(function(err, response) {
      if(err) { handleError(err, res); return; }
      const waves = response.body.map((item) => item.path.replace('stack_',''));
      res.status(200).json(waves);
    });
});

router.get('/stacks', (req, res) => {
  const url = `${config.gitlabUrl}/api/v3/groups`;
  const privateToken = config.gitlabPrivateAccessToken;

  console.log('url:', url);
  console.log('private_token:', privateToken);

  request
    .get(url)
    .query({search: 'stack_'})
    .set('PRIVATE-TOKEN', privateToken)
    .end(function(err, response) {
      if(err) { handleError(err, res); return; }
      const waves = response.body.map((item) => item.path.replace('stack_','')).filter((item) => item.indexOf('_assignments') < 0).filter((item) => item.indexOf('_wave') < 0);
      res.status(200).json(waves);
    });
});

router.get('/stack/:stackId/assignments', (req, res) => {
  // const url = `${config.gitlabAssignmentsUrl}/api/v3/groups/stack_${req.params.stackId}_assignments/projects`;
  const privateToken = config.gitlabAssignmentsPrivateAccessToken;

  console.log('url:', url);
  console.log('privateToken:', privateToken);

  request
    .get(url)
    .query({search: 'wave'})
    .set('PRIVATE-TOKEN', privateToken)
    .end(function(err, response) {
      if(err) { handleError(err, res); return; }
      const assignments = response.body.map((item) => item.path.replace('stack_',''));
      res.status(200).json(assignments);
    });
});

function checkResultInSonarQube(commitId, res) {
  retrieveResultFromSonarQube(commitId, (err, result) => {
    if(err) { console.log('ERRR8'); handleError(err, res); return; }
    if(!result) { res.status(202); return; }
    updateCommitQualityInRedis(commitId, JSON.stringify(result), () => {
      res.status(200).json(getFormattedResponse(result));
    });
  });
}

function handleError(err, res) {
  // console.error('ERR:', err);
  res.status(500).send(err);
}

module.exports = router;
