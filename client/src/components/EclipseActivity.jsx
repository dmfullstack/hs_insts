import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import request from 'superagent';

const months = 'Jan Feb Mar Apr May June July Aug Sep Oct Nov Dec'.split(' ');

export default class EclipseActivity extends Component {

	constructor(){
		super();
		this.state = {
			sessions: null
		}
	}

	componentDidMount(){
		request
			.get('/api/sessions')
			.end((err, res) => {
				if(err) { console.error('ERR:', err); return; }

				this.setState({sessions: res.body});
			});
	}

	render(){
		if(!this.state.sessions) {
			return (
				<CircularProgress size={80} thickness={5} />
			);
		}

		console.log('this.state.sessions:', this.state.sessions);

		const tableRow = this.state.sessions.map( ({startTime, endTime}) => {
				const startDate = new Date(startTime);
				const endDate = endTime ? new Date(endTime) : null;
	        return (
	          <TableRow key={startTime}>
		        <TableRowColumn>{startDate.getDate()}-{months[startDate.getMonth()]}</TableRowColumn>
		        <TableRowColumn>{startDate.getHours()}:{startDate.getMinutes()}</TableRowColumn>
		        <TableRowColumn>{endDate ? endDate.getHours()+":"+endDate.getMinutes() : "In Progress"}</TableRowColumn>
		      </TableRow>
	        );
	    });

		return(
			<Card initiallyExpanded={true}  style={{margin:'10px'}}>
			    <CardHeader
			      title="Eclipse Activity"
			      actAsExpander={true}
			      showExpandableButton={true}
			    />
			    <CardText expandable={true}>
					<Table selectable={false}>
					    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					      <TableRow>
					        <TableHeaderColumn>Day</TableHeaderColumn>
					        <TableHeaderColumn>Session Start</TableHeaderColumn>
					        <TableHeaderColumn>Session End</TableHeaderColumn>
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
	
}
