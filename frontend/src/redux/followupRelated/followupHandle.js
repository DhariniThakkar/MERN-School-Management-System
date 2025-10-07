import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
} from './followupSlice';

export const getAllFollowups = (adminId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FollowUpList/${adminId}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const createFollowup = (fields) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/FollowUpCreate`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(postDone());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateFollowup = (id, fields) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/FollowUp/${id}`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const assignFollowup = (id, teacherId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/FollowUpAssign/${id}`, { teacherId }, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const requestFollowupUpdate = (id, adminId, message) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/FollowUpRequest/${id}`, { adminId, message }, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
