import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiCall from '../utils/apicall';

export const getRoles = createAsyncThunk('get-roles/roles', async (ThunkApi) => {
  const data = await ApiCall.get('/role');
  return data.data.data.roles;
});

export const createRole = createAsyncThunk('createRole/roles', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.post('/role', data);
    console.log('response from server:', res);
    return res.data.data.role;
  } catch (error) {
    return ThunkApi.rejectWithValue(error.response.data.message);
  }
});

export const updateRole = createAsyncThunk('updateRoles/roles', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.put(`/role/${data.roleId}`, data);
    return res.data.data.updatedRole;
  } catch (error) {
    console.log(error);
  }
});

export const deleteRole = createAsyncThunk('deleteRole/roles', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.delete(`/role/${data}`);
    if (res.data.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
});

export const roleSlice = createSlice({
  name: 'role',
  initialState: {
    roles: [],
    isLoading: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    clearErrorMessage: (state) => {
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRoles.pending, (state, action) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.roles = action.payload;
    });
    builder.addCase(getRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
    });

    // ------------Deleting Role -------------------
    builder.addCase(deleteRole.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteRole.fulfilled, (state, action) => {
      state.roles = state.roles.filter((role) => role.id !== action.payload);
      state.isLoading = false;
    });
    builder.addCase(deleteRole.rejected, (state, action) => {
      state.isLoading = false;
    });

    // -------------- Creating Role -----------------

    builder.addCase(createRole.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isLoading = true;
      state.message = '';
    });
    builder.addCase(createRole.fulfilled, (state, action) => {
      if (action.payload) {
        state.roles.unshift(action.payload);
        state.isLoading = false;
      }
    });
    builder.addCase(createRole.rejected, (state, action) => {
      state.message = action.payload;
      state.isLoading = false;
    });

    builder.addCase(updateRole.pending, (state, action) => {
      // console.log('in extra update pending')
      state.isLoading = true;
    });
    builder.addCase(updateRole.fulfilled, (state, action) => {
      state.roles = state.roles.map((role) => {
        if (role.id === action.payload.id) {
          return action.payload;
        }
        return role;
      });
      state.isLoading = false;
    });
    builder.addCase(updateRole.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const { clearErrorMessage } = roleSlice.actions;
export default roleSlice.reducer;
