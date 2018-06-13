import React,{Component} from 'react';
import PropTypes from 'prop-types';
import StatusBadge from './StatusBadge';

export default class ProjectRunStatusBadge extends Component{
  constructor(props) {
    super(props);

    this.colorCodes = {
      completed: '#05da05',
      failed:'#ffc107'
    }

    this.statusMap = {
      'completed': 'running',
      'failed': 'not running'
    }
  }

  static propTypes = {
    status: PropTypes.string.isRequired
  }

  getStatusValue = () => {
    let statusText = this.statusMap[this.props.status.toLowerCase()];

    if(!statusText) {
      statusText = 'unknown';
    }

    let status = {text: statusText, value: this.props.status.toLowerCase()};

    return status;
  }
  render() {
    return(
        <StatusBadge colors={this.colorCodes} label={'run'} status={this.getStatusValue()}/>
    )
  }
}
