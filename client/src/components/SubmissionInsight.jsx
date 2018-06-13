import React, { Component } from 'react';
import Moment from 'react-moment';

import request from 'superagent';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';
import Clock from 'material-ui/svg-icons/action/alarm';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import CircularProgress from 'material-ui/CircularProgress';
import ActionSpeakerNotes from 'material-ui/svg-icons/action/speaker-notes';

import {EvaluationStatusBadge} from './Badges';

export default class SubmissionInsight extends Component {

  constructor(props){
    super(props);
    this.state = {
      submissionInsights: null
    }

    this.styles = {
      scoreChip : {
        background: "#ffd968",
        fontWeight: "300",
        display: 'inline'
      }
    }
  }

  componentDidMount(){
    request
      .get('/api/submissionList?limit=10&page=1&users='+this.props.user+'&assignment='+this.props.assignmentUrl)
      .end((err, res) => {
        if(err){ console.log(err); return; }

        this.setState({
          submissionInsights: res.body.evaluations
        });
      });
    request
      .get('/api/hobbes')
      .end((err, res) => {
        if(err) { console.log(err); return; }
        console.log('HOBBESURL:', res.text);
        this.setState({hobbesUrl: res.text});
      });
  }

  handleOpen(submissionRepoUrl) {
    console.log('solutionRepoUrl', submissionRepoUrl, this.props.user);
    window.open(`${this.state.hobbesUrl}/#/feedbackreport/${encodeURIComponent(submissionRepoUrl)}/${this.props.user}`, '_blank');
  }

  render(){
    if(this.state.submissionInsights === null) {
      return (
        <CircularProgress size={80} thickness={5} />
      );
    }

    if(this.state.submissionInsights.length === 0){
      return(
        <Paper style={{margin:'10px'}}>
          <Subheader>For this Assignment their is no Submission Insight.</Subheader>
        </Paper>
      );
    }
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var tempDate;

    this.state.submissionInsights.sort(function(a,b){
      return new Date(b.submittedOn) - new Date(a.submittedOn);
    });

    const listItem = this.state.submissionInsights.map((item) => {
      console.log('Object.keys:', Object.keys(item));
      const {submittedOn, evalScores, payload, repoUrl} = item;
      var d = new Date(submittedOn),
            month = monthNames[(d.getMonth())],
            day = '' + d.getDate(),
            year = d.getFullYear();
          var hour = d.getHours(),
          min = d.getMinutes(),
          sec = d.getSeconds();
          var formattedDate = [day, month, year].join(' ');
          var formattedTime = [hour, min, sec].join(':');

          var pass, total;
      if(evalScores) {
        for(var i=0;i<evalScores.sections.length;i++){
          if(evalScores.sections[i].name === "commanderTests"){
            pass = evalScores.sections[i].passes;
            total = evalScores.sections[i].total;
            break;
          }
        }
      }

      var date;
      var detail = <div style={{margin: '10px'}}>
                <ListItem
                    primaryText={<div>{formattedTime}</div>}
                    leftIcon={<Clock />}
                />
                <ListItem
                    primaryText={<span> Score - { (!!evalScores)? <Chip style={{display: 'inline'}}>{pass}/{total}</Chip> : 'Pending' }</span>}
                    leftIcon={<DoneAll />}
                />
                <ListItem
                    primaryText={<span> Final Score - { (!!evalScores && evalScores.finalScore)?
                      <Chip style={this.styles.scoreChip}>{ Math.floor( evalScores.finalScore) + "%"}</Chip> :
                      <EvaluationStatusBadge status={ (status || 'unknown') }/> }</span>}
                    leftIcon={<CheckCircle />}
                />
                <ListItem
                    primaryText="Open Evaluation Feedback in Hobbes"
                    leftIcon={<ActionSpeakerNotes />}
                    onClick={this.handleOpen.bind(this, repoUrl)}
                />
                <hr/>
               </div>;

      if(tempDate !== formattedDate){
        tempDate = formattedDate;
        //date = <Subheader>{formattedDate}</Subheader>
        date = <Subheader><Moment fromNow>{submittedOn}</Moment></Subheader>
      }

      return(
        <div key={submittedOn}>
          {date}
          {detail}
        </div>
      )
      });

    return(
      <Paper style={{margin:'10px'}}>
            <List style={{margin:'10px'}}>
              {listItem}
            </List>
          </Paper>
    );
  }
}
