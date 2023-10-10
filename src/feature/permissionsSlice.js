import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiCall from '../utils/apicall';

export const getPermission = createAsyncThunk('getPermission/permissions', async (ThunkApi) => {
  let data = await ApiCall.get('/permission');
  return data.data.data.permissions;
});

export const createPermission = createAsyncThunk('createPermission/permissions', async (data, ThunkApi) => {
  try {
    let res = await ApiCall.post('/permission/', data);
    return res.data.data.permission;
  } catch (error) {
    return ThunkApi.rejectWithValue(error.response.data.message);
  }
});

export const updatePermission = createAsyncThunk('updatePermissions/permissions', async (data, ThunkApi) => {
  try {
    let res = await ApiCall.put(`/permission/${data.id}`, data);
    return res.data.data.updatedPermission;
  } catch (error) {}
});

export const deletePermission = createAsyncThunk('deletePermission/permissions', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.delete(`/permission/${data}`);
    if (res.data.success) {
      return data;
    }
    throw new Error('There is an error to delete ! ');
  } catch (error) {
    console.log(error);
  }
});

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: [],
    isPermissionLoading: false,
    isSuccess: false,
    errorMessage: '',
  },
  extraReducers: (builder) => {
    // ---------------- Getting Permissions -------------
    builder.addCase(getPermission.pending, (state, action) => {
      state.isPermissionLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getPermission.fulfilled, (state, action) => {
      state.permissions = action.payload;
      state.isPermissionLoading = false;
    });
    builder.addCase(getPermission.rejected, (state, action) => {
      state.isPermissionLoading = false;
      state.isSuccess = false;
    });

    // ---------------- Deleting Permission -------------

    builder.addCase(deletePermission.pending, (state, action) => {
      // console.log('in extra pending')
      state.isPermissionLoading = true;
    });
    builder.addCase(deletePermission.fulfilled, (state, action) => {
      state.permissions = state.permissions.filter((permission) => permission.id !== action.payload);
      state.isPermissionLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(deletePermission.rejected, (state, action) => {
      state.isPermissionLoading = false;
    });

    // ---------------- Adding Permission -------------

    builder.addCase(createPermission.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isPermissionLoading = true;
    });
    builder.addCase(createPermission.fulfilled, (state, action) => {
      state.permissions.unshift(action.payload);
      state.isPermissionLoading = false;
    });
    builder.addCase(createPermission.rejected, (state, action) => {
      state.isPermissionLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(updatePermission.pending, (state, action) => {
      // console.log('in extra update pending')
      state.isPermissionLoading = true;
    });
    builder.addCase(updatePermission.fulfilled, (state, action) => {
      const updatedPermission = action.payload;
      state.permissions = state.permissions.map((permission) => {
        if (permission.id === updatedPermission.id) {
          return updatedPermission;
        }
        return permission;
      });
      state.isPermissionLoading = false;
      state.isPermissionLoading = false;
    });
    builder.addCase(updatePermission.rejected, (state, action) => {
      state.isPermissionLoading = false;
    });
  },
});

export default permissionsSlice.reducer;
