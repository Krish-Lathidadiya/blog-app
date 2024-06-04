import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createPost, deletePost, getPosts,updatePost } from "./postApi";

const initialState = {
  loading: false,
  currentPosts: [],
  errorMessage: null,
  successMessage: null,
  totalPosts: null,
};

export const createPostAsync = createAsyncThunk(
  "post/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await createPost(formData);
      return data.data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePostAsync = createAsyncThunk(
  "post/deletePost",
  async ({ postId, userId }, { rejectWithValue }) => {
    try {
      const data = await deletePost(postId, userId);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPostsAsync = createAsyncThunk(
  "post/getPosts",
  async (newFilter, { rejectWithValue }) => {
    try {
      const data = await getPosts(newFilter);
      // console.log("postSlice getposts data:", data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePostAsync = createAsyncThunk(
  "post/updatePost",
  async ({postId, userId,formData}, { rejectWithValue }) => {
    try {
      const data = await updatePost(postId, userId,formData);
      return data.data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createPostAsync
      .addCase(createPostAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPosts.push(action.payload);
        state.successMessage = "Post created successfully.";
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      // Handle deletePostAsync
      .addCase(deletePostAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPosts = state.currentPosts.filter(
          (post) => post._id !== action.meta.arg.postId
        );
        state.successMessage = "Post deleted successfully.";
      })
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      // Handle getPostsAsync
      .addCase(getPostsAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      // .addCase(getPostsAsync.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const newPosts = action.payload.posts.filter(
      //     (newPost) => !state.currentPosts.some((post) => post._id === newPost._id)
      //   );
      //   state.currentPosts = [...state.currentPosts, ...newPosts];
      //   state.totalPosts = action.payload.totalPosts;
      // })
      .addCase(getPostsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPosts = action.payload.posts;
        state.totalPosts = action.payload.totalPosts;
      })
      .addCase(getPostsAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      // Handle updatePostAsync
      .addCase(updatePostAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPosts=action.payload
        state.successMessage="Successfully updated"
      })
      .addCase(updatePostAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default postSlice.reducer;

export const selectPost = (state) => state.post.currentPosts;
export const selectTotalPosts = (state) => state.post.totalPosts;
export const selectError = (state) => state.post.errorMessage;
export const selectSuccess = (state) => state.post.successMessage;
export const selectLoader = (state) => state.post.loading;
