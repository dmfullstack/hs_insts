import React,{Component} from 'react';
import PropTypes from 'prop-types';
import StatusBadge from './StatusBadge';

export default class EvaluationStatusBadge extends Component{
  constructor(props) {
    super(props);

    this.colorCodes = {
      EvalCompleted: '#05da05',
      EvalPending: '#ffc107'
    }

    this.statusMap = {
      'EvalPending': 'pending',
      'EvalCompleted': 'completed'
    }
  }

  static propTypes = {
    status: PropTypes.string.isRequired
  }

  getStatusValue = () => {
    let statusText = this.statusMap[this.props.status];

    if(!statusText) {
      statusText = 'unknown';
    }

    let status = {text: statusText, value: this.props.status};

    return status;
  }

  render() {
    return(
        <StatusBadge colors={this.colorCodes} label={'evaluation'} status={this.getStatusValue()}/>
    )
  }
}
