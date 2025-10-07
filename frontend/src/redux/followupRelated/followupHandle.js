import axios from 'axios';
import { getRequest, getSuccess, getFailed, getError, postRequest, postSuccess, postFailed, postError } from './followupSlice';

export const getAllFollowups = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FollowUpList/${id}`);
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
  dispatch(postRequest());
  try {
    const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/FollowUpCreate`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(postFailed(result.data.message));
    } else {
      dispatch(postSuccess());
    }
  } catch (error) {
    dispatch(postError(error));
  }
};

export const assignFollowup = (followUpId, teacherId) => async (dispatch) => {
  dispatch(postRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/FollowUpAssign`, { followUpId, teacherId }, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(postFailed(result.data.message));
    } else {
      dispatch(postSuccess());
    }
  } catch (error) {
    dispatch(postError(error));
  }
};

export const requestUpdateFromTeacher = (followUpId) => async (dispatch) => {
  dispatch(postRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/FollowUpRequestUpdate`, { followUpId }, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(postFailed(result.data.message));
    } else {
      dispatch(postSuccess());
    }
  } catch (error) {
    dispatch(postError(error));
  }
};

export const addTeacherFollowupUpdate = (followUpId, note, teacherId) => async (dispatch) => {
  dispatch(postRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/FollowUpAddUpdate`, { followUpId, note, byRole: 'Teacher', byUser: teacherId }, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(postFailed(result.data.message));
    } else {
      dispatch(postSuccess());
    }
  } catch (error) {
    dispatch(postError(error));
  }
};

export const processDueFollowups = () => async (dispatch) => {
  dispatch(postRequest());
  try {
    const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/FollowUpProcessDue`);
    if (result.data.message) {
      dispatch(postFailed(result.data.message));
    } else {
      dispatch(postSuccess());
    }
  } catch (error) {
    dispatch(postError(error));
  }
};
