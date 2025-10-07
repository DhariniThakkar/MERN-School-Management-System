import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followupsList: [],
  loading: false,
  error: null,
  response: null,
  status: 'idle',
};

const followupSlice = createSlice({
  name: 'followup',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.followupsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    postRequest: (state) => {
      state.status = 'loading';
    },
    postSuccess: (state) => {
      state.status = 'added';
    },
    postFailed: (state, action) => {
      state.status = 'failed';
      state.response = action.payload;
    },
    postError: (state, action) => {
      state.status = 'error';
      state.error = action.payload;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.response = null;
      state.error = null;
    }
  }
});

export const { getRequest, getSuccess, getFailed, getError, postRequest, postSuccess, postFailed, postError, resetStatus } = followupSlice.actions;
export const followupReducer = followupSlice.reducer;
