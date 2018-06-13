import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

export default class Nav extends Component {
  render() {
    return (
      <header>
        <AppBar
          title="Insights - Submissions"
        />
      </header>
    );
  }
}
