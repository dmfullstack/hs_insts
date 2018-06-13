import React,{Component} from 'react';
import PropTypes from 'prop-types';

export default class StatusBadge extends Component{
  constructor(props){
    super(props);

    this.styles = {
      outerBadge: {
        "margin": "5px",
        "fontWeight": "500",
        "fontSize": "0.65em"
      },
      labelBadge: {
        "borderRadius": "3px 0px 0px 3px",
        "background": "gray",
        "padding": "6px",
        "color": "#fff"
      },
      statusBadge: {
        "borderRadius": "0px 3px 3px 0px",
        "background": "#a7a7a7",
        "padding": "6px",
        "color": "#fff"
      }
    };
  }

  static propTypes = {
    colors: PropTypes.object.isRequired,
    status: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired
  }

  getStatusStyle = () => {
    //This is to avoid Mutated style warning, PS: mutated styles are deprecated
    let styleObj = JSON.parse(JSON.stringify(this.styles.statusBadge));
    styleObj.background = this.props.colors[this.props.status.value] || "#ff9988";
    return styleObj
  }

  render() {
    // this.styles.statusBadge.background = this.props.colors[this.props.status.value] || "#ff9988";
    return(
        <span style={this.styles.outerBadge}>
          <span style={this.styles.labelBadge}>{this.props.label}</span>
          <span style={this.getStatusStyle()}>{this.props.status.text}</span>
        </span>
    )
  }
}
