import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import {Card, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import async from 'async';
import request from 'superagent';

import config from '../config';

export default class QualityDelta extends Component {

	constructor(){
		super();
		this.state = {
			commits: null,
			fetchingCommitStatus: false,
			quality: {}
		}
		this.getCommitStatus = this.getCommitStatus.bind(this);
	}

	retrieveCommitQualityInfo(commitId, stop) {
		request
			.get(`/api/assignment/${encodeURIComponent(this.props.assignmentUrl)}/commits/${commitId}/quality`)
			.end((err, res) => {
				if(err) { console.error('ERR:', err); return; }
				if(res.status === 200) {
					stop();
					const quality = this.state.quality;
					quality[commitId] = res.body;
					this.setState({quality});
				}
			});
	}

	retrieveCommitStatus(done) {
		request
	    .get('/api/commits')
	    .query({assignment: this.props.assignmentUrl})
	    .end((err, res) => {
	    	if(err) { done(err); return; }
	    	done(null, res.body);
	  });
	}

	getCommitStatus() {
		this.setState({fetchingCommitStatus: true});

		this.retrieveCommitStatus((err, commits) => {
			if(err) { console.log('err:', err); return; }
			console.log('11commits:', commits);
			async.each(commits, ({id}) => {
				let count = 5;
				const interval = setInterval(() => {
					if(count-- > 0) {
						this.retrieveCommitQualityInfo(id, () => {clearInterval(interval)});
					} else {
						clearInterval(interval);
					}
				}, 5000);
			});
			this.setState({commits});
		});
	}

	render(){
		console.log('this.state:', this.state);
		if(this.state.commits) {
			console.log('this.state.commits:', this.state.commits);
			const tableRow = this.state.commits.map(({id, short_id, created_at}) => {
	      return (
	        <TableRow key={id}>
		        <TableRowColumn><a href={`${config.sonarqubeUrl}/component_measures?id=${id}`} target="_blank">{short_id}</a></TableRowColumn>
		        <TableRowColumn>{created_at}</TableRowColumn>
		        <TableRowColumn>{this.state.quality[id] ? this.state.quality[id].ncloc : <CircularProgress size={20} thickness={2} />}</TableRowColumn>
		        <TableRowColumn>{this.state.quality[id] ? this.state.quality[id].complexity : <CircularProgress size={20} thickness={2} />}</TableRowColumn>
		        <TableRowColumn>{this.state.quality[id] ? this.state.quality[id].file_complexity : <CircularProgress size={20} thickness={2} />}</TableRowColumn>
		        <TableRowColumn>{this.state.quality[id] ? this.state.quality[id].function_complexity : <CircularProgress size={20} thickness={2} />}</TableRowColumn>
	      	</TableRow>
	      );
	    });

			return(
				<Card initiallyExpanded={true}  style={{margin:'10px'}}>
				    <CardHeader
				      title="Quality Delta"
				      actAsExpander={true}
				      showExpandableButton={true}
				    />
				    <CardText expandable={true}>
						<Table selectable={false}>
						    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						      <TableRow>
						        <TableHeaderColumn>CommitId</TableHeaderColumn>
						        <TableHeaderColumn>Committed at</TableHeaderColumn>
						        <TableHeaderColumn>LoC</TableHeaderColumn>
						        <TableHeaderColumn>Complexity(C)</TableHeaderColumn>
						        <TableHeaderColumn>(C)/Function</TableHeaderColumn>
						        <TableHeaderColumn>(C)/File</TableHeaderColumn>
						      </TableRow>
						    </TableHeader>
						    <TableBody displayRowCheckbox={false}>
						    	{tableRow}
						    </TableBody>
						  </Table>
					  </CardText>
				</Card>
			);
		}


		if(this.state.fetchingCommitStatus)		 {
			return (
				<CircularProgress size={80} thickness={5} />
			);
		}


		return (
			<Paper>
				<FlatButton
					label="Click here to fetch Commit Qualities"
					primary={true}
					onTouchTap={this.getCommitStatus} />
			</Paper>
		);
	}

}
