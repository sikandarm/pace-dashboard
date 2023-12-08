import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../utils/apicall";

export const getSequence = createAsyncThunk(
  "getSequence/Sequence",
  async (ThunkApi) => {
    try {
      const res = await ApiCall.get("/sequences/get-all-sequence");
      //   console.log(res, "+++++");
      return res.data.data.sequence;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createSequence = createAsyncThunk(
  "createSequence/Sequence",
  async (data, ThunkApi) => {
    try {
      const fData = new FormData();
      fData.append("sequence_name", data.sequence_name);
      fData.append("job_id", data.job_id);

      const res = await ApiCall.post("/sequences/createsequence", fData);
      if (res.data.success) {
        return res.data.data.createsequence;
      } else {
        return ThunkApi.rejectWithValue(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const deletesequence = createAsyncThunk(
  "deleteSequence/Sequence",
  async (data, ThunkApi) => {
    try {
      const res = await ApiCall.delete(`/sequences/deletesequence/${data}`);
      if (res.data.success) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateSequence = createAsyncThunk(
  "updateSequence/Sequence",
  async (data, ThunkApi) => {
    try {
      const fData = new FormData();
      fData.append("sequence_name", data.sequence_name);
      fData.append("job_id", data.job_id);

      const res = await ApiCall.put(
        `/sequences/update-sequence/${data.id}`,
        fData
      );
      if (res.data.success) {
        return res.data.data.updatesequence;
      } else {
        return ThunkApi.rejectWithValue(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
);
export const createSequencetask = createAsyncThunk(
  "createSequencetask/SequenceTask",
  async (data, ThunkApi) => {
    try {
      const fData = new FormData();
      fData.append("sequence_id", data.sequence_id);
      fData.append("task_id", data.task_id);

      const res = await ApiCall.post(
        "/sequencestask/updatesequencetask",
        fData
      );

      if (res.data.success) {
        return res.data.data;
      } else {
        return ThunkApi.rejectWithValue(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const sequenceSlice = createSlice({
  name: "sequence",
  initialState: {
    sequence: [],
    isSequenceLoading: false,
    isSuccess: false,
  },
  extraReducers: (builder) => {
    builder.addCase(getSequence.pending, (state, action) => {
      state.isSequenceLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getSequence.fulfilled, (state, action) => {
      if (action.payload) {
        state.sequence = action.payload;
      }
      state.isSequenceLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getSequence.rejected, (state, action) => {
      state.isSequenceLoading = false;
      state.isSuccess = false;
    });
    // ------------------ Delete Sequence -------------

    builder.addCase(deletesequence.pending, (state, action) => {
      // console.log('in extra pending')
      state.isSequenceLoading = true;
    });
    builder.addCase(deletesequence.fulfilled, (state, action) => {
      state.sequence = state.sequence.filter(
        (inv) => inv.id !== action.payload
      );
      state.isSequenceLoading = false;
    });
    builder.addCase(deletesequence.rejected, (state, action) => {
      state.isSequenceLoading = false;
    });

    // ------------- Create Sequence ----------------

    builder.addCase(createSequence.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isSequenceLoading = true;
    });
    builder.addCase(createSequence.fulfilled, (state, action) => {
      if (action.payload) state.sequence.unshift(action.payload);
      state.isSequenceLoading = false;
    });
    builder.addCase(createSequence.rejected, (state, action) => {
      state.isSequenceLoading = false;
    });

    // ------------- Create SequenceTask ----------------
    builder.addCase(createSequencetask.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isSequenceLoading = true;
    });
    builder.addCase(createSequencetask.fulfilled, (state, action) => {
      console.log(action.payload, ")))))))");
      if (action.payload) state.sequence.unshift(action.payload);
      state.isSequenceLoading = false;
    });
    builder.addCase(createSequencetask.rejected, (state, action) => {
      state.isSequenceLoading = false;
    });

    // ------------- Update Sequence ----------------

    builder.addCase(updateSequence.pending, (state, action) => {
      state.isSequenceLoading = true;
    });
    builder.addCase(updateSequence.fulfilled, (state, action) => {
      const updatedSequence = action.payload;
      state.sequence = state.sequence.map((inv) => {
        if (inv.id === updatedSequence.id) {
          return updatedSequence;
        }
        return inv;
      });
      state.isSequenceLoading = false;
    });
    builder.addCase(updateSequence.rejected, (state, action) => {
      state.isSequenceLoading = false;
    });
  },
});

export default sequenceSlice.reducer;
