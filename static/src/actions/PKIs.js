import {
  PKIS_LIST_REQUEST, PKIS_LIST_SUCCESS, PKIS_LIST_FAILURE, RESET_PKIS_LIST, SET_PKIS_KEYWORD, SET_PKIS_PAGE
} from '../constants';
import { CALL_API } from '../middleware/api';
import { fetch, pick } from '../utils';

export const fetchPKIsList = () =>
  (dispatch, getState) => {
    return dispatch({
      [CALL_API]: {
        types: [PKIS_LIST_REQUEST, PKIS_LIST_SUCCESS, PKIS_LIST_FAILURE],
        endpoint: '/admin/pkis/server',
        body: pick(getState().PKIs, 'total', 'per_page', 'page', 'field', 'keyword'),
      },
    })
    .then(data => dispatch(resetPKIsList(data)));
  };

const resetPKIsList = (data) => ({
  type: RESET_PKIS_LIST,
  payload: data,
});

export const setPKIsKeyword = (keyword) => ({
  type: SET_PKIS_KEYWORD,
  payload: {
    keyword,
  },
});

export const savePKIs = (values, dispatch) =>
  fetch('/admin/pkis/server/', {
    method: 'POST',
    body: values,
  })
  .catch(error => {
    return Promise.reject(error);
  });


export const setPKIsPage = (page) => ({
  type: SET_PKIS_PAGE,
  payload: { page },
});

export const deletePKIs = (id) =>
  (dispatch, getState) => {
    return fetch(`/admin/pkis/server/${id}`, { method: 'DELETE' });
  };
