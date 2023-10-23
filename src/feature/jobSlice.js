import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiCall from '../utils/apicall';

export const getJobs = createAsyncThunk('getJobs/jobs', async (ThunkApi) => {
  try {
    const res = await ApiCall.get('/job');
    console.log('checking');
    return res.data.data.jobs;
  } catch (error) {
    return ThunkApi.rejectWithValue(error.response.data.message);
  }
});

export const createJob = createAsyncThunk('createJob/jobs', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.post('/job', data);
    console.log(res);
    return res.data;
  } catch (error) {
    const { message } = error.response.data;
    throw new Error(message);
  }
});

export const updateJob = createAsyncThunk('updateJobs/jobs', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.put(`/job/${data.id}`, data);
    console.log(res);
    return res.data;
  } catch (error) {
    const { message } = error.response.data;
    throw new Error(message);
  }
});

export const deleteJob = createAsyncThunk('deleteJob/jobs', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.delete(`/job/${data}`);
    if (res.data.success) {
      return data;
    }
  } catch (error) {
    return ThunkApi.rejectWithValue('Error deleting in');
  }
});

export const importJob = createAsyncThunk('ImportJob/jobs', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.post('/job/import', data, {
      headers: {
        'Content-Type': 'application/json', // Set the content type to indicate JSON data
      },
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
}); 

export const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    isJobLoading: false,
    isSuccess: false,
  },
  extraReducers: (builder) => {
    builder.addCase(getJobs.pending, (state, action) => {
      state.isJobLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getJobs.fulfilled, (state, action) => {
      state.jobs = action.payload;
      state.isJobLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(getJobs.rejected, (state, action) => {
      state.isJobLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteJob.pending, (state, action) => {
      // console.log('in extra pending')
      state.isJobLoading = true;
    });
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      state.isJobLoading = false;
    });
    builder.addCase(deleteJob.rejected, (state, action) => {
      state.isJobLoading = false;
    });

    builder.addCase(createJob.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isJobLoading = true;
    });
    builder.addCase(createJob.fulfilled, (state, action) => {
      state.jobs = [...state.jobs, action.payload];
      state.isJobLoading = false;
    });
    builder.addCase(createJob.rejected, (state, action) => {
      state.isJobLoading = false;
      return action.payload;
    });

    builder.addCase(updateJob.pending, (state, action) => {
      // console.log('in extra update pending')
      state.isJobLoading = true;
    });
    builder.addCase(updateJob.fulfilled, (state, action) => {
      const updatedJob = action.payload;
      state.jobs = state.jobs.map((job) => {
        if (job.id === updatedJob.id) {
          return updatedJob;
        }
        return job;
      });
      state.isJobLoading = false;
    });
    builder.addCase(updateJob.rejected, (state, action) => {
      state.isJobLoading = false;
      return action.payload;
    });

    builder.addCase(importJob.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isJobLoading = true;
    });
    builder.addCase(importJob.fulfilled, (state, action) => {
      state.jobs = [...action.payload, ...state.jobs];
      state.isJobLoading = false;
    });
    builder.addCase(importJob.rejected, (state, action) => {
      state.isJobLoading = false;
    });
  },
});

export default jobSlice.reducer;
