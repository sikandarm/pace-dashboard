import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiCall from '../utils/apicall';

export const getInventory = createAsyncThunk('getInventory/Inventory', async (ThunkApi) => {
  try {
    const res = await ApiCall.get('/inventory');
    return res.data.data.inventories;
  } catch (error) {
    console.log(error);
  }
});

export const createInventory = createAsyncThunk('createInventory/Inventory', async (data, ThunkApi) => {
  try {
    const fData = new FormData();
    fData.append('ediStdNomenclature', data.ediStdNomenclature);
    fData.append('aiscManualLabel', data.aiscManualLabel);
    fData.append('shape', data.shape);
    fData.append('weight', Number(data.weight));
    fData.append('depth', Number(data.depth));
    fData.append('grade', data.grade);
    fData.append('poNumber', data.poNumber);
    fData.append('heatNumber', data.heatNumber);
    fData.append('itemType', data.itemType);
    fData.append('lengthReceivedFoot', Number(data.lengthReceivedFoot));
    fData.append('lengthReceivedInch', Number(data.lengthReceivedInch));
    fData.append('quantity', Number(data.quantity));
    fData.append('poPulledFromNumber', data.poPulledFromNumber);
    fData.append('lengthUsedFoot', Number(data.lengthUsedFoot));
    fData.append('lengthUsedInch', Number(data.lengthUsedInch));
    fData.append('lengthRemainingFoot', Number(data.lengthRemainingFoot));
    fData.append('lengthRemainingInch', Number(data.lengthRemainingInch));
    fData.append('orderArrivedInFull', data.orderArrivedInFull);
    fData.append('orderArrivedCMTR', data.orderArrivedCMTR);

    const res = await fetch(`${process.env.REACT_APP_URL}/inventory`, {
      method: 'POST',
      body: fData,
    });
    let inv = await res.json();
    if (inv.success) {
      return inv.data.inventory;
    } else {
      return ThunkApi.rejectWithValue(inv.message);
    }
  } catch (error) {
    console.log(error);
  }
});

export const updateInventory = createAsyncThunk('updateInventorys/Inventory', async (data, ThunkApi) => {
  try {
    const fData = {
      ediStdNomenclature: data.ediStdNomenclature,
      aiscManualLabel: data.aiscManualLabel,
      shape: data.shape,
      weight: Number(data.weight),
      depth: Number(data.depth),
      grade: data.grade,
      poNumber: data.poNumber,
      heatNumber: data.heatNumber,
      itemType: data.itemType,
      lengthReceivedFoot: Number(data.lengthReceivedFoot),
      lengthReceivedInch: Number(data.lengthReceivedInch),
      quantity: Number(data.quantity),
      poPulledFromNumber: data.poPulledFromNumber,
      lengthUsedFoot: Number(data.lengthUsedFoot),
      lengthUsedInch: Number(data.lengthUsedInch),
      lengthRemainingFoot: Number(data.lengthRemainingFoot),
      lengthRemainingInch: Number(data.lengthRemainingInch),
      orderArrivedInFull: data.orderArrivedInFull,
      orderArrivedCMTR: data.orderArrivedCMTR,
    };
    const res = await ApiCall.put(`/inventory/${data.id}`, fData);
    if (res.data.data.inventory) return res.data.data.inventory;
  } catch (error) {
    console.log(error);
  }
});

export const deleteInventory = createAsyncThunk('deleteInventory/Inventory', async (data, ThunkApi) => {
  try {
    const res = await ApiCall.delete(`/inventory/${data}`);
    if (res.data.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
});

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventory: [],
    isInventoryLoading: false,
    isSuccess: false,
  },
  extraReducers: (builder) => {
    builder.addCase(getInventory.pending, (state, action) => {
      state.isInventoryLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getInventory.fulfilled, (state, action) => {
      if (action.payload) {
        state.inventory = action.payload;
      }
      state.isInventoryLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getInventory.rejected, (state, action) => {
      state.isInventoryLoading = false;
      state.isSuccess = false;
    });
    // ------------------ Delete Inventory -------------

    builder.addCase(deleteInventory.pending, (state, action) => {
      // console.log('in extra pending')
      state.isInventoryLoading = true;
    });
    builder.addCase(deleteInventory.fulfilled, (state, action) => {
      state.inventory = state.inventory.filter((inv) => inv.id !== action.payload);
      state.isInventoryLoading = false;
    });
    builder.addCase(deleteInventory.rejected, (state, action) => {
      state.isInventoryLoading = false;
    });

    // ------------- Create Inventory ----------------

    builder.addCase(createInventory.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isInventoryLoading = true;
    });
    builder.addCase(createInventory.fulfilled, (state, action) => {
      if (action.payload) state.inventory.unshift(action.payload);
      state.isInventoryLoading = false;
    });
    builder.addCase(createInventory.rejected, (state, action) => {
      state.isInventoryLoading = false;
    });

    builder.addCase(updateInventory.pending, (state, action) => {
      state.isInventoryLoading = true;
    });
    builder.addCase(updateInventory.fulfilled, (state, action) => {
      const updatedInventory = action.payload;
      state.inventory = state.inventory.map((inv) => {
        if (inv.id === updatedInventory.id) {
          return updatedInventory;
        }
        return inv;
      });
      state.isInventoryLoading = false;
    });
    builder.addCase(updateInventory.rejected, (state, action) => {
      state.isInventoryLoading = false;
    });
  },
});

export default inventorySlice.reducer;
