import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiCall from '../utils/apicall';

export const getTasks = createAsyncThunk('get-tasks/tasks', async (ThunkApi) => {
  try {
    const res = await ApiCall.get('/task');
    if (res.data.data.tasks) {
      return res.data.data.tasks.data;
    } else throw new Error('No User Found !');
  } catch (error) {
    console.log(error);
    return ThunkApi.rejectWithValue('Error logging in');
  }
});

export const getRejectionReasons = createAsyncThunk('rejection-reasons/rejections', async (ThunkApi) => {
  try {
    const res = await ApiCall.get('/rejected-reasons');
    if (res.data.data.reasons) {
      const allReasons = res.data.data.reasons;
      const reasons = [];
      allReasons.forEach((reason) => {
        reasons.push(...reason.children);
      });
      return reasons;
    } else throw new Error('No reason Found !');
  } catch (error) {
    console.log(error);
    return ThunkApi.rejectWithValue('Error logging in');
  }
});

export const getSingleTasks = createAsyncThunk('get-single-tasks/tasks', async (id, ThunkApi) => {
  try {
    const res = await ApiCall.get(`/task/${id}`);
    if (res.data.data.task) {
      return res.data.data.task;
    } else throw new Error('No User Found !');
  } catch (error) {
    console.log(error);
    return ThunkApi.rejectWithValue('Error logging in');
  }
});

export const createTask = createAsyncThunk('createTask/tasks', async (data, ThunkApi) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_URL}/task`, {
      method: 'POST',
      body: data,
    });
    const task = await res.json();

    if (task && task.success) {
      if (task.data && task.data.task) {
        return task.data.task;
      } else {
        console.log('Invalid response from server');
        throw new Error('Invalid response from server');
      }
    } else {
      console.log('Error creating task:', task.message);
      throw new Error(task.message || 'Error creating task');
    }
  } catch (error) {
    console.log('Error creating task:', error.message);
    throw new Error(error.message || 'Error creating task');
  }
});

export const updateTasks = createAsyncThunk('updateTasks/tasks', async (data, ThunkApi) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_URL}/task/${data.id}`, {
      method: 'PUT',
      body: data.formData,
    });
    let updatedTask = await res.json();

    if (updatedTask && updatedTask.success) {
      if (updatedTask.data && updatedTask.data.task) {
        return updatedTask.data.task;
      } else {
        throw new Error('Invalid response from server');
      }
    } else {
      throw new Error(updatedTask.message || 'Error creating task');
    }
  } catch (error) {
    console.log('Error creating task:', error.message);
    throw new Error(error.message || 'Error creating task');
  }
});

export const deleteTasks = createAsyncThunk('deleteTasks/tasks', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.delete(`/task/${data}`);
    if (res.data.success) {
      return data;
    }
    throw new Error('Not deleted');
  } catch (error) {
    console.log(error);
  }
});

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    isTaskLoading: false,
    isSuccess: false,
    rejectionReasons: [],
    currentTask: [],
    errorValue: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getTasks.pending, (state, action) => {
      state.isTaskLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.isTaskLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getTasks.rejected, (state, action) => {
      state.isTaskLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(getSingleTasks.pending, (state, action) => {
      state.isTaskLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getSingleTasks.fulfilled, (state, action) => {
      state.currentTask = action.payload;
      state.isTaskLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getSingleTasks.rejected, (state, action) => {
      state.isTaskLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteTasks.pending, (state, action) => {
      state.isTaskLoading = true;
    });
    builder.addCase(deleteTasks.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.isTaskLoading = false;
    });
    builder.addCase(deleteTasks.rejected, (state, action) => {
      state.isTaskLoading = false;
    });

    builder.addCase(createTask.pending, (state, action) => {
      state.isTaskLoading = true;
      state.error = null;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.unshift(action.payload);
      state.isTaskLoading = false;
      state.errorValue = null;
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.isTaskLoading = false;
      state.errorValue = action.error.message;
    });

    builder.addCase(updateTasks.pending, (state, action) => {
      state.isTaskLoading = true;
    });
    builder.addCase(updateTasks.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      state.tasks = state.tasks.map((task) => {
        if (task.id === updatedTask.id) {
          return updatedTask;
        }
        return task;
      });
      state.isTaskLoading = false;
    });
    builder.addCase(updateTasks.rejected, (state, action) => {
      state.isTaskLoading = false;
      state.errorValue = action.error.message;
    });
    builder.addCase(getRejectionReasons.pending, (state, action) => {
      state.isTaskLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getRejectionReasons.fulfilled, (state, action) => {
      state.rejectionReasons = action.payload;
      state.isTaskLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getRejectionReasons.rejected, (state, action) => {
      state.isTaskLoading = false;
      state.isSuccess = false;
    });
  },
});

export default tasksSlice.reducer;
