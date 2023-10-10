import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiCall from '../utils/apicall';
import jwt_decode from 'jwt-decode';




export const loginUser = createAsyncThunk('login-user/auth', async (data, thunkAPI) => {
  try {
    const res = await ApiCall.post('/auth/login', data);
    const token = res.data.data;
    const decodedToken = jwt_decode(token.token);
    localStorage.setItem('accessToken', token.token);
    return { token: token.token, decodedToken: decodedToken };
  } catch (error) {
    const { message } = error.response.data;
    throw new Error(message);
  }
});

export const getUsers = createAsyncThunk('get-users/users', async (data, thunkAPI) => {
  // console.log('here');
  try {
    const res = await ApiCall.get('/user');
    if (res.data.data.users) {
      return res.data.data.users;
    } else throw new Error('No User Found !');
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue('Error logging in');
  }
});

export const createUser = createAsyncThunk('create-users/users', async (data, thunkAPI) => {
  try {
    const res = await ApiCall.post('/user/signup', data);
    if (res.success === false) {
      return thunkAPI.rejectWithValue(res.message);
    }
    return { ...res.data.data.user, roles: [{ id: data.roleId }] };
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const updateUser = createAsyncThunk('update-users/users', async (data, thunkAPI) => {
  try {
    const res = await ApiCall.put(`/user/${data.id}`, data);
    if (res.status === false) {
      return thunkAPI.rejectWithValue(res.message);
    }
    return { ...res.data.data.updatedUser, roles: [{ id: data.roleId }] };
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const deleteUser = createAsyncThunk('delete-users/users', async (data, thunkAPI) => {
  try {
    // console.log(data);
    const res = await ApiCall.delete(`/user/${data}`);
    if (res.data.success) {
      return data;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue('Error deleting in');
  }
});

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    token: '',
    loginUser: '',
    usersList: [],
    isLoading: false,
    isSuccess: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken');
      state.loginUser = '';
      state.usersList = [];
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // ---------------Login User------------------
    builder.addCase(loginUser.pending, (state, action) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loginUser = action.payload;
      state.token = action.payload.token;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
    });

    // -------------Getting User-------------
    builder.addCase(getUsers.pending, (state, action) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      if (action.payload === 'undefined') return alert('no user found');
      if (action.payload.length > 0) {
        state.usersList = action.payload;
        state.isSuccess = true;
        state.isLoading = false;
        return;
      }
      state.usersList = [];
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
    });

    // ---------------------Creating User---------------------
    builder.addCase(createUser.pending, (state, action) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      // console.log(action.payload)
      state.usersList.unshift(action.payload);
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
    });

    // ----------------------Update User----------------------
    builder.addCase(updateUser.pending, (state, action) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      state.usersList = state.usersList.map((user) => {
        if (user.id === updatedUser.id) {
          return { ...user, ...updatedUser };
        }
        return user;
      });
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
    });

    // ----------------------Delete user----------------------

    builder.addCase(deleteUser.pending, (state, action) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.usersList = state.usersList.filter((user) => user.id !== action.payload);
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
