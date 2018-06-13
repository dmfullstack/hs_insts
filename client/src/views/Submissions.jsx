import React, { Component } from 'react';
import SubmissionsList from '../components/SubmissionsList';
import PropTypes from 'prop-types';

export default class Submissions extends Component {
  
  constructor(){
    super();
    this.state = {
      currentSubmissionId: null
    };
    this.handleAssignmentSelected = this.handleAssignmentSelected.bind(this);
  }

  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired
    };
  }

  handleAssignmentSelected({username, assignmentUrl, repoUrl}) {
    this.context.router.history.push(`/insights/${username}/${encodeURIComponent(assignmentUrl)}/${encodeURIComponent(repoUrl)}`);
  }

  render() {    
    return(
      <SubmissionsList
        onSelect={this.handleAssignmentSelected}
        currentSubmissionId={this.state.currentSubmissionId}
      />
    );
  }
}
