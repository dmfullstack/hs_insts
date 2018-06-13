const request = require('superagent');
const config = require('../config');

function submitForEvaluation({assignmentId, commitId}, done) {
  const url = `${config.dpUrl}/api/v1/jobs`;
  console.log('URL:::::', url);

  request
    .post(url)
    .send({
        "payload": {
          "repoUrl": assignmentId,
        "ref": commitId
        },
        "templateName": "sonarqube"
      })
    .end((err, res) => {
      if(err) { done(err); return; }
      console.log('11res.status:', res.status);
      if(res.status !== 200) { done(new Error('Server returned with status:', res.status)); return;}
      done();
    });
}

module.exports = submitForEvaluation;
