import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Nav from './views/Nav.jsx';
import Submissions from './views/Submissions.jsx';
import Insights from './views/Insights';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(

  <MuiThemeProvider>
    <Router>
      <div>
        <Route path="/" component={Nav}/>
        <Route exact path="/" component={Submissions} />
        <Route exact path="/insights/:user/:assignment/:repoUrl" component={Insights} />
      </div>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
