import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Card, CardHeader, CardText } from 'material-ui/Card';
var data = require('../jsonData/gitlabActivity.json');

export default class GitlabActivity extends Component {

	constructor(){
		super();
		this.state = {
			gitlabActivity : []
		}
	}

	componentDidMount(){
		this.setState({
			gitlabActivity: data
		})
	}

	render(){

		const tableRow = this.state.gitlabActivity.map( ({id, Event, Date, Time}) => {
	        return (
	          <TableRow key={id}>
		        <TableRowColumn>{Event}</TableRowColumn>
		        <TableRowColumn>{Date}</TableRowColumn>
		        <TableRowColumn>{Time}</TableRowColumn>
		      </TableRow>
	        );
	    });

		return(
			<Card initiallyExpanded={true}  style={{margin:'10px'}}>
			    <CardHeader
			      title="Gitlab Activity (Dummy Data)"
			      actAsExpander={true}
			      showExpandableButton={true}
			    />
			    <CardText expandable={true}>
					<Table selectable={false}>
					    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					      <TableRow>
					        <TableHeaderColumn>Event</TableHeaderColumn>
					        <TableHeaderColumn>Date</TableHeaderColumn>
					        <TableHeaderColumn>Time</TableHeaderColumn>
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