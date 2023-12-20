import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../utils/apicall";

export const getContacts = createAsyncThunk(
  "getContacts/contacts",
  async (ThunkApi) => {
    try {
      const res = await ApiCall.get("/contact");
      return res.data.data.contacts;
    } catch (error) {
      return ThunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const createContact = createAsyncThunk(
  "createContact/contacts",
  async (data, ThunkApi) => {
    try {
      const res = await ApiCall.post("/contact", data);
      //  console.log(res);
      return res.data;
    } catch (error) {
      const { message } = error.response.data;
      throw new Error(message);
    }
  }
);

export const updateContact = createAsyncThunk(
  "updateContacts/contacts",
  async (data, ThunkApi) => {
    try {
      const res = await ApiCall.put(`/contact/${data.id}`, data);
      console.log(res);

      return res.data;
    } catch (error) {
      const { message } = error.response.data;
      throw new Error(message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  "deleteContact/contacts",
  async (data, ThunkApi) => {
    try {
      const res = await ApiCall.delete(`/contact/${data}`);
      if (res.data.success) {
        return data.data;
      }
    } catch (error) {
      return ThunkApi.rejectWithValue("Error deleting in");
    }
  }
);

export const importContacts = createAsyncThunk(
  "ImportContacts/contacts",
  async (data, ThunkApi) => {
    try {
      const res = await ApiCall.post("/contact/import", data, {
        headers: {
          "Content-Type": "application/json", // Set the content type to indicate JSON data
        },
      });
      return res.data.data;
    } catch (error) {
      return error;
    }
  }
);

export const ContactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    isContactLoading: false,
    isSuccess: false,
  },
  extraReducers: (builder) => {
    builder.addCase(getContacts.pending, (state, action) => {
      state.isContactLoading = true;
      state.isSuccess = false;
    });
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.contacts = action.payload;
      state.isContactLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(getContacts.rejected, (state, action) => {
      state.isContactLoading = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteContact.pending, (state, action) => {
      // console.log('in extra pending')
      state.isContactLoading = true;
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contacts = state.contacts.filter(
        (contacts) => contacts.id !== action.payload
      );
      state.isContactLoading = false;
    });
    builder.addCase(deleteContact.rejected, (state, action) => {
      state.isContactLoading = false;
    });

    builder.addCase(createContact.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isContactLoading = true;
    });
    builder.addCase(createContact.fulfilled, (state, action) => {
      state.contacts = [...state.contacts, action.payload];
      state.isContactLoading = false;
    });
    builder.addCase(createContact.rejected, (state, action) => {
      state.isContactLoading = false;
      return action.payload;
    });

    builder.addCase(updateContact.pending, (state, action) => {
      // console.log('in extra update pending')
      state.isContactLoading = true;
    });
    builder.addCase(updateContact.fulfilled, (state, action) => {
      const updatedContact = action.payload;
      state.contact = state.contact.map((contact) => {
        if (contact.id === updatedContact.id) {
          return updatedContact;
        }
        return contact;
      });
      state.isContactLoading = false;
    });
    builder.addCase(updateContact.rejected, (state, action) => {
      state.isContactLoading = false;
      return action.payload;
    });

    builder.addCase(importContacts.pending, (state, action) => {
      // console.log('in extra add pending')
      state.isContactLoading = true;
    });
    builder.addCase(importContacts.fulfilled, (state, action) => {
      state.Contacts = [...action.payload, ...state.Contacts];
      state.isContactLoading = false;
    });
    builder.addCase(importContacts.rejected, (state, action) => {
      state.isContactLoading = false;
    });
  },
});

export default ContactSlice.reducer;
