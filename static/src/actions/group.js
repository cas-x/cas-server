import { GROUP_LIST_REQUEST, GROUP_LIST_SUCCESS,
         GROUP_LIST_FAILURE, RESET_GROUP_LIST,
         SET_GROUP_PAGE, SET_GROUP_KEYWORD } from '../constants';
import { CALL_API } from '../middleware/api';
import { fetch, pick } from '../utils';

const resetGroupList = (data) => ({
  type: RESET_GROUP_LIST,
  payload: data,
});

export const getGroup = (GroupId) =>
  () => {
    return fetch(`/admin/groups/${GroupId}`);
  };

export const fetchGroupList = () =>
  (dispatch, getState) => {
    return dispatch({
      [CALL_API]: {
        types: [GROUP_LIST_REQUEST, GROUP_LIST_SUCCESS, GROUP_LIST_FAILURE],
        endpoint: '/admin/groups',
        body: pick(getState().group, 'total', 'per_page', 'page', 'field', 'keyword'),
      },
    })
    .then(data => dispatch(resetGroupList(data)));
  };

export const setGroupKeyword = (keyword) => ({
  type: SET_GROUP_KEYWORD,
  payload: {
    keyword,
  },
});


export const setGroupPage = (page) => ({
  type: SET_GROUP_PAGE,
  payload: { page },
});

export const deleteGroup = (groupId) =>
  (dispatch, getState) => {
    return fetch(`/admin/groups/${groupId}`, { method: 'DELETE' });
  };

export const saveGroup = (values, dispatch) =>
  fetch('/admin/groups/' + (values.id ? values.id : ''), {
    method: values.id ? 'PUT' : 'POST',
    body: values,
  })
  .catch(error => {
    return Promise.reject(error);
  });

export const resetGroup = (groupId) =>
  (dispatch, getState) => {
    return fetch(`/admin/groups/${groupId}/staticpassword`, {
      method: 'PUT',
      body: {
        reset: true,
      },
    });
  };
