import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signUp, signIn, google,signOut } from "./authApi";

const initialState = {
  loading: false,
  currentUser: null,
  errorMessage: null,
  isLoggedIn: false,
};

export const signUpAsync = createAsyncThunk(
  "auth/signUp",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await signUp(formData);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const signInAsync = createAsyncThunk(
  "auth/signIn",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await signIn(formData);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const googleAsync = createAsyncThunk(
  "auth/google",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await google(formData);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutAsync = createAsyncThunk(
  "auth/signOut",
  async (_,{ rejectWithValue }) => {
    try {
      const data = await signOut();
      // console.log("authSlice signout data:",data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //when update the user
    setUser(state, action) {
      state.currentUser = action.payload;
    },
    //when delete the user
    clearUser(state) {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(signInAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(googleAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(googleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(googleAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.isLoggedIn = false;
      })
      .addCase(signOutAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Sign out failed';
      });
  },
});

export default authSlice.reducer;
export const { setUser, clearUser } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectError = (state) => state.auth.errorMessage;
export const selectLoader = (state) => state.auth.loading;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
