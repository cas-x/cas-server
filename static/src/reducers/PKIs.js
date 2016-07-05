/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-04-20T23:43:35+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-21T17:29:31+08:00
* @License: The MIT License (MIT)
*/


import {
  PKIS_LIST_REQUEST, PKIS_LIST_SUCCESS, PKIS_LIST_FAILURE, RESET_PKIS_LIST, SET_PKIS_KEYWORD, SET_PKIS_PAGE
} from '../constants';

const initialState = {
  list: [],
  total: 0,
  per_page: 20,
  page: 1,
  fetching: false,
  field: 'name',
  keyword: '',
  formErrors: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PKIS_LIST_REQUEST:
      return {
        ...state, ...{
          fetching: true,
        },
      };
    case PKIS_LIST_SUCCESS:
    case PKIS_LIST_FAILURE:
      return {
        ...state, ...{
          fetching: false,
        },
      };
    case RESET_PKIS_LIST:
      const data = action.payload;
      return {
        ...state, ...{
          list: data.value,
          total: data.total,
          page: data.page,
        },
      };
    case SET_PKIS_PAGE:
      return {
        ...state, ...{
          page: action.payload.page,
        },
      };
    case SET_PKIS_KEYWORD:
      return {
        ...state, ...{
          keyword: action.payload.keyword,
        },
      };
    default:
      return state;
  }
};
