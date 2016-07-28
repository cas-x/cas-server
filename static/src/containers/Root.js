/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-11T19:48:51+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-21T00:31:13+08:00
* @License: The MIT License (MIT)
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router';

import { App, Login, Personal, Dashboard, DevTools, OAuth, User, PKIs, Group } from '../containers';
import { Loading } from '../components';
import { checkAuth } from '../actions';


class Root extends Component {
  constructor(props) {
    super(props);

    const { history } = this.props;

    this.props.checkAuth();
    this.router = (
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRedirect to="dashboard" />
          <Route path="login" component={Login} />
          <Route path="dashboard" component={Dashboard}>
            <IndexRoute component={Personal} />
            <Route path="oauth" component={OAuth} />
            <Route path="PKIs" component={PKIs} />
            <Route path="group" component={Group} />
            <Route path="user" component={User} />
          </Route>
        </Route>
      </Router>
    );
  }

  render() {
    const { auth } = this.props;
    const router = auth.hasChecked ? this.router : <Loading />;

    return (
      <div>
        { router }
        <DevTools />
      </div>
    );
  }

}

export default connect(
  ({ auth }) => ({ auth }),
  { checkAuth }
)(Root);
