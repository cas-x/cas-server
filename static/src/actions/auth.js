/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-04-20T23:43:35+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-21T00:49:56+08:00
* @License: The MIT License (MIT)
*/


import { CHECKAUTH_REQUEST, CHECKAUTH_SUCCESS, CHECKAUTH_FAILURE, LOGOUT } from '../constants';
import { push } from 'react-router-redux';

import { CALL_API } from '../middleware/api';
import { resetPersonal } from './personal';
import { fetch } from '../utils';


export const checkAuth = () =>
  (dispatch, getState) =>
    dispatch({
      [CALL_API]: {
        types: [CHECKAUTH_REQUEST, CHECKAUTH_SUCCESS, CHECKAUTH_FAILURE],
        endpoint: '/api/users/self',
      },
    })
    .then(data => dispatch(resetPersonal(data.value)))
    .catch(() => dispatch(push('/login')));

export const login = (values, dispatch) =>
  fetch('/public/users/login', {
    method: 'POST',
    body: values,
  })
  .then(() => {
    dispatch(checkAuth());
    dispatch(push('/dashboard'));
  });

export const logout = () =>
  (dispatch) =>
    fetch('/public/users/logout', {
      method: 'POST',
    })
    .then(() => {
      dispatch({
        type: LOGOUT,
      });
      dispatch(push('/login'));
    });
