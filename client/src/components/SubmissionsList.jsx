import React, { Component } from 'react';
import Moment from 'react-moment';
import InfiniteScroll from 'react-infinite-scroller';
import {Row, Col} from 'react-flexbox-grid';

import request from 'superagent';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import Assignment from 'material-ui/svg-icons/action/assignment';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import AutoComplete from 'material-ui/AutoComplete';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import {EvaluationStatusBadge} from './Badges';


var promise, byFilter = false;
var globalFilteredArray;

export default class SubmissionsList extends Component {
  constructor() {
    super();

    this.state = {
      submissions: null,
      submissionList: [],
      hasMoreItems: true,
      assignmentList: [],
      assignmentInput: null,
      participantList: [],
      participantInput: null
    };

    this.styles = {
      scoreChip : {
        background: "#ffd968",
        fontWeight: "600",
      }
    }
    this.onlyUnique = this.onlyUnique.bind(this)
  }

  componentDidMount(){
    byFilter = false;
    let assignmentList = this.state.assignmentList;
    let participantList = this.state.participantList;
    request
    .get('/api/submissionList?limit=10&page=1')
    .end((err, res) => {
      if(err){
        console.log(err);
        return;
      }
      
      for(var i = 0;i<res.body.evaluations.length;i++){
        participantList.push(res.body.evaluations[i].username);
        var assignmentName = res.body.evaluations[i].repoUrl;
        var slashIndex = assignmentName.lastIndexOf("/");
        assignmentName = assignmentName.substring(slashIndex+1).substring(0, assignmentName.length - 4);
        assignmentList.push(assignmentName);
      }
      var self = this;

      participantList = participantList.filter(self.onlyUnique);
      assignmentList = assignmentList.filter(self.onlyUnique);
      self.setState({
        submissionList: res.body.evaluations,
        submissions: res.body.evaluations,
        assignmentList: assignmentList,
        participantList: participantList
      });
    });
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  handleItemSelected({username, repoUrl, assignmentUrl}) {
    this.props.onSelect({username, repoUrl, assignmentUrl});
  }

  onNewRequest(chosenRequest, index) {
    var filteredArray = this.state.submissionList.filter(function(item){
      return chosenRequest.indexOf(item.username)  > -1 || item.repoUrl.indexOf(chosenRequest) > -1;
    });
    
    byFilter = true;
    var starting10Element = globalFilteredArray = filteredArray;
    if(filteredArray.length > 10){
      starting10Element = filteredArray.slice(0, 10);
    }
    
    this.setState({
      submissions: starting10Element,
      hasMoreItems: (filteredArray.length > 10)
    })
  }

  handleUpdateInput(property, value){
    if(value === ""){
      byFilter = false;
      this.setState({
        submissions: this.state.submissionList
      })
    }
    const update = {};
    update[property] = value;
    this.setState(update);
  }

  loadItems(page) {
    if(byFilter){
      var appendingElement = globalFilteredArray.slice(this.state.submissions.length, globalFilteredArray.length);
      var filteredElement = this.state.submissions;
      var appendedFilteredElement = filteredElement.concat(appendingElement);
      if(appendingElement.length>10){
        var starting10FilterItem = appendingElement.slice(0,10);
        appendedFilteredElement = filteredElement.concat(starting10FilterItem);
      }
      
      this.setState({
        submissions: appendedFilteredElement,
        hasMoreItems: (this.state.submissions.length < globalFilteredArray.length)
      })
    }else{
      const assignmentList = this.state.assignmentList;
      const participantList = this.state.participantList;
      request
      .get('/api/submissionList?limit=10&page='+page)
      .end((err, res) => {
        if(err){
          console.log(err);
          return;
        }
        
        for(var i = 0;i<res.body.evaluations.length;i++){
          participantList.push(res.body.evaluations[i].username);
          var assignmentName = res.body.evaluations[i].repoUrl;
          var slashIndex = assignmentName.lastIndexOf("/");
          assignmentName = assignmentName.substring(slashIndex+1);
          assignmentName = assignmentName.substring(0, assignmentName.length - 4);
          assignmentList.push(assignmentName);
        }
        var self = this;
        participantList = participantList.filter(self.onlyUnique);
        assignmentList = assignmentList.filter(self.onlyUnique)
        var submissionList = this.state.submissionList;
        var allAssignments = submissionList.concat(res.body.evaluations);
        self.setState({
          submissionList: allAssignments,
          submissions: allAssignments,
          hasMoreItems: (allAssignments.length < res.body.total)
        });
      })
    }
  }

  render() {
    if(this.state.submissions === null) {
      return (
        <CircularProgress size={80} thickness={5} />
      );
    }
    

    var tempUsername;
    
    if(byFilter){
      // To arrange array by Name
      this.state.submissions.sort(function(a,b){
        if(a.username < b.username) return -1;
        if(a.username > b.username) return 1;
        return 0;
      });      
    }else{
      // To arrange array by Submission Date
      this.state.submissions.sort(function(a,b){
        return new Date(b.submittedOn) - new Date(a.submittedOn);
      });
    }

    const assignments = this.state.submissions.map(({ username, repoUrl, submittedOn, evalScores, payload}) => {
      let passes, total;
      //console.log('evalScores:', evalScores);
      if(evalScores) {
        for(var i=0;i<evalScores.sections.length;i++){
          if(evalScores.sections[i].name === "commanderTests"){
            passes = evalScores.sections[i].passes;
            total = evalScores.sections[i].total;
            break;
          }
        }
      }
      
      var assignmentName = repoUrl;
      var slashIndex = assignmentName.lastIndexOf("/");
      assignmentName = assignmentName.substring(slashIndex+1);
      assignmentName = assignmentName.substring(0, assignmentName.length - 4);

      var user;
      var detail = 
      <ListItem 
        key={repoUrl}
        primaryText={<div>{assignmentName}</div>}
        rightAvatar={
            <span style={{marginRight: 50, marginTop: 10}}>
              { (!!evalScores && evalScores.finalScore)? <Chip style={this.styles.scoreChip}>{Math.floor( evalScores.finalScore) + "%"}</Chip> : <EvaluationStatusBadge status={ (status || 'unknown') }/> }
            </span>}
        secondaryText={<div>{username} <br/> <Moment fromNow>{submittedOn}</Moment></div>}
        secondaryTextLines={2}
        rightIcon={<NavigationChevronRight style={{ paddingTop: 15, height: 30, width: 30}}/>}
        onTouchTap={this.handleItemSelected.bind(this, {username, repoUrl, assignmentUrl: payload.solutionRepoUrl})}
        leftIcon={<Assignment style={{ paddingTop: 15, height: 30, width: 30}}/>}  
        innerDivStyle={{paddingTop: 8, paddingBottom: 5}}           
      />
      
      if(tempUsername !== username && byFilter){             
        tempUsername = username;
        user = <h4 style={{margin: '5px'}}>{username}</h4>        
      }

      return(
        <List style={{ padding: '0px'}}>
          {user}          
          {detail}   
          <hr/>    
        </List>
      );        
    });

    const participantDataSource = this.state.participantList.filter(this.onlyUnique);
    participantDataSource.unshift(this.state.participantInput);

    const assignmentDataSource = this.state.assignmentList.filter(this.onlyUnique);
    assignmentDataSource.unshift(this.state.assignmentInput);

    return (
      <Paper style={{margin:'10px'}}>
          <Card>
            <CardHeader
              title="Filter by Participant/Assignment"
              actAsExpander={true}
              showExpandableButton={true}
              style={{paddingTop: '8px', paddingBottom: '8px'}}        
            />
            <CardText expandable={true} style={{paddingTop: '5px'}}>
              <Row xs={12} lg={12}>
                <Col xs={12} lg={6}>
                  <AutoComplete
                    hintText="Search by Participant"
                    ref={`participantAutoComplete`}
                    filter={AutoComplete.caseInsensitiveFilter}
                    dataSource={participantDataSource}
                    onNewRequest={ this.onNewRequest.bind(this) }
                    fullWidth={true}
                    onUpdateInput={this.handleUpdateInput.bind(this, "participantInput")}
                    openOnFocus={true}
                  />
                </Col>
                <Col xs={12} lg={6}>
                  <AutoComplete
                    hintText="Search by Assignment"
                    ref={`assignmentAutoComplete`}
                    filter={AutoComplete.caseInsensitiveFilter}
                    dataSource={assignmentDataSource}
                    dataSourceConfig={ {text: 'name', value: 'name'} }
                    onNewRequest={ this.onNewRequest.bind(this) }
                    fullWidth={true}
                    onUpdateInput={this.handleUpdateInput.bind(this, "assignmentInput")}
                    openOnFocus={true}
                  />
                </Col>
              </Row>
            </CardText>
          </Card>

          <InfiniteScroll
                pageStart={1}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={<CircularProgress size={30} thickness={3} style={{ marginLeft: '50%' }} />}>
            {assignments}
          </InfiniteScroll>
      </Paper>        
    );
  }
}
