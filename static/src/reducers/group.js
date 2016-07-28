import {
  GROUP_LIST_REQUEST,
  GROUP_LIST_SUCCESS,
  GROUP_LIST_FAILURE,
  RESET_GROUP_LIST,
  SET_GROUP_PAGE,
  SET_GROUP_KEYWORD } from '../constants';

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
    case GROUP_LIST_REQUEST:
      return {
        ...state, ...{
          fetching: true,
        },
      };
    case GROUP_LIST_SUCCESS:
    case GROUP_LIST_FAILURE:
      return {
        ...state, ...{
          fetching: false,
        },
      };
    case RESET_GROUP_LIST:
      const data = action.payload;
      return {
        ...state, ...{
          list: data.value,
          total: data.total,
          page: data.page,
        },
      };
    case SET_GROUP_PAGE:
      return {
        ...state, ...{
          page: action.payload.page,
        },
      };
    case SET_GROUP_KEYWORD:
      return {
        ...state, ...{
          keyword: action.payload.keyword,
        },
      };
    default:
      return state;
  }
};
