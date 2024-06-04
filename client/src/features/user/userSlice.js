import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUser, deleteUser,getUsers,getUser } from "./userApi"; 
import { setUser,clearUser} from '../auth/authSlice'; 

const initialState = {
  loading: false,
  currentUser: null,
  errorMessage: null,
  successMessage: null,
};

export const deleteUserAsync = createAsyncThunk(
  "user/deleteUser",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const data = await deleteUser(userId);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const data = await updateUser(userId, formData);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getUsersAsync = createAsyncThunk(
  "user/getUsers",
  async (filter, { rejectWithValue }) => {
    try {
      const data = await getUsers(filter);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserAsync = createAsyncThunk(
  "user/getUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getUser(userId);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "User deleted successfully.";
        state.currentUser = state.currentUser.filter(user => user._id !== action.payload._id);
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "User updated successfully.";
        state.currentUser = state.currentUser.map(user =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getUsersAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.users;
        state.successMessage = "Users fetched successfully.";
      })
      .addCase(getUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getUserAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.successMessage = "Users fetched successfully.";
      })
      .addCase(getUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default userSlice.reducer;

export const selectUser = (state) => state.user.currentUser;
export const selectError = (state) => state.user.errorMessage;
export const selectSuccess = (state) => state.user.successMessage;
export const selectLoader = (state) => state.user.loading;
