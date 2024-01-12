import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../utils/apicall";

export const getbill = createAsyncThunk("getBill/Bill", async (ThunkApi) => {
  try {
    const res = await ApiCall.get("/bill/get-bill");
    return res.data.data.Billdata;
  } catch (error) {
    console.log(error);
  }
});

export const createBill = createAsyncThunk(
  "createBill/Bill",
  async (data, ThunkApi) => {
    try {
      //   const fData = new FormData();
      //   fData.append("orderdate", data.orderdate);
      //   fData.append("dilverydate", data.dilverydate);
      //   fData.append("terms", data.terms);
      //   fData.append("shipvia", data.shipvia);
      //   fData.append("address", data.address);
      //   fData.append("billTitle", data.billTitle);
      //   fData.append("bill_of_landing_item", data.billItems);

      const res = await ApiCall.post("bill/create-bill", data);
      // console.log(res, "SLICCE");
      if (res.data.success) {
        return res.data.data;
      } else {
        return ThunkApi.rejectWithValue(res.data.message);
      }
    } catch (error) {
      console.log("Error");
    }
  }
);

export const deleteBill = createAsyncThunk(
  "deleteBill/Bill",
  async (data, ThunkApi) => {
    try {
      const res = await ApiCall.delete(`/bill/delete-bill/${data}`);
      if (res.data.success) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// export const updateSequence = createAsyncThunk(
//   "updateSequence/Sequence",
//   async (data, ThunkApi) => {
//     try {
//       const fData = new FormData();
//       fData.append("sequence_name", data.sequence_name);
//       fData.append("job_id", data.job_id);

//       const res = await ApiCall.put(
//         `/sequences/update-sequence/${data.id}`,
//         fData
//       );
//       if (res.data.success) {
//         return res.data.data.updatesequence;
//       } else {
//         return ThunkApi.rejectWithValue(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

export const billSlice = createSlice({
  name: "shippinglist",
  initialState: {
    bill: [],
    isBillLoading: false,
    isSuccess: false,
  },
  extraReducers: (builder) => {
    builder.addCase(getbill.pending, (state, action) => {
      state.isBillLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getbill.fulfilled, (state, action) => {
      if (action.payload) {
        state.bill = action.payload;
      }
      state.isBillLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getbill.rejected, (state, action) => {
      state.isBillLoading = false;
      state.isSuccess = false;
    });
    // ------------------ Delete Bill -------------

    builder.addCase(deleteBill.pending, (state, action) => {
      // console.log('in extra pending')
      state.isBillLoading = true;
    });
    builder.addCase(deleteBill.fulfilled, (state, action) => {
      state.bill = state.bill.filter((inv) => inv.id !== action.payload);
      state.isBillLoading = false;
    });
    builder.addCase(deleteBill.rejected, (state, action) => {
      state.isBillLoading = false;
    });

    // ------------- Create Bill ----------------

    builder.addCase(createBill.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isBillLoading = true;
    });
    builder.addCase(createBill.fulfilled, (state, action) => {
      //   console.log(action, "check State");
      if (action.payload) state.bill.unshift(action.payload);
      state.isBillLoading = false;
    });
    builder.addCase(createBill.rejected, (state, action) => {
      state.isBillLoading = false;
    });

    // ------------- Update Sequence ----------------

    // builder.addCase(updateSequence.pending, (state, action) => {
    //   state.isSequenceLoading = true;
    // });
    // builder.addCase(updateSequence.fulfilled, (state, action) => {
    //   const updatedSequence = action.payload;
    //   state.sequence = state.sequence.map((inv) => {
    //     if (inv.id === updatedSequence.id) {
    //       return updatedSequence;
    //     }
    //     return inv;
    //   });
    //   state.isSequenceLoading = false;
    // });
    // builder.addCase(updateSequence.rejected, (state, action) => {
    //   state.isSequenceLoading = false;
    // });
  },
});

export default billSlice.reducer;
