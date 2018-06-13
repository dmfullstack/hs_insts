import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Card, CardHeader } from 'material-ui/Card';
import SubmissionInsight from '../components/SubmissionInsight';
import EclipseActivity from '../components/EclipseActivity';
import QualityDelta from '../components/QualityDelta';
import EclipseCheIcon from '../components/EclipseCheIcon';
import DeltaIcon from '../components/DeltaIcon';
import HobbesIcon from '../components/HobbesIcon';
import GitlabIcon from '../components/GitlabIcon';
import GitlabActivity from '../components/GitlabActivity';

export default class Insights extends Component {

  render() {
    var assignmentName = decodeURIComponent(this.props.match.params.assignment);
    var slashIndex = assignmentName.lastIndexOf("/");
    assignmentName = assignmentName.substring(slashIndex+1);
    assignmentName = assignmentName.substring(0, assignmentName.length - 4);

    return (
      <div>
    	<Card>
          <CardHeader
	    title={this.props.match.params.user}
	    subtitle={assignmentName}
	    />
        </Card>
	<Tabs>
	  <Tab icon={<HobbesIcon />} label="Submission Insight">
	    <SubmissionInsight user={this.props.match.params.user} assignmentUrl={decodeURIComponent(this.props.match.params.assignment)}/>
	  </Tab>
	  {/*<Tab icon={<EclipseCheIcon />} label="Eclipse Activity">
	    <EclipseActivity />
	  </Tab>*/}
	  {/*<Tab icon={<GitlabIcon />} label="Gitlab Activity">
	    <GitlabActivity />
	  </Tab>*/}
	  <Tab icon={<DeltaIcon />} label="Quality Delta">
	    <QualityDelta assignmentUrl={decodeURIComponent(this.props.match.params.repoUrl)} />
	  </Tab>
	</Tabs>
      </div>
    );
  }
}
