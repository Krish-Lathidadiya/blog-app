import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createComment,
  getPostComments,
  deleteComment,
  likeComment,
  updateComment,
  getAllComments,
} from "./commentApi";

const initialState = {
  loading: false,
  comments: [],
  totalComments: 0,
  errorMessage: null,
  successMessage: null,
  totalComments: null,
};

export const getAllCommentsAsync = createAsyncThunk(
  "comment/getAllComments",
  async (newFilter, { rejectWithValue }) => {
    try {
      const data = await getAllComments(newFilter);
      // console.log("commentSlice getAllComments data:",data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCommentAsync = createAsyncThunk(
  "comment/createComment",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await createComment(formData);
      return data.data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPostCommentsAsync = createAsyncThunk(
  "comment/getPostComments",
  async (postId, { rejectWithValue }) => {
    try {
      const data = await getPostComments(postId);
      // console.log("commentSlice getPostComment data:",data);
      return data.data.comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCommentAsync = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const data = await deleteComment(commentId);
      return data.data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeCommentAsync = createAsyncThunk(
  "comment/likeComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const data = await likeComment(commentId);
      console.log("commentSlice likeComment data:", data.data.comment);
      return data.data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCommentAsync = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const data = await updateComment(commentId, content);
      return data.data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // handle getAllCommentsAsync
      .addCase(getAllCommentsAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(getAllCommentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.comments=action.payload.comments;
        state.totalComments=action.payload.totalComments
        state.successMessage = "Comment get successfully";
      })
      .addCase(getAllCommentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // handle createCommentAsync
      .addCase(createCommentAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(createCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        // state.comments=[...state.comments,action.payload];
        state.comments.push(action.payload);
        state.successMessage = "Comment created successfully";
      })
      .addCase(createCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // handle getPostCommentsAsync
      .addCase(getPostCommentsAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(getPostCommentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
        state.successMessage = "Comments fetched successfully";
      })
      .addCase(getPostCommentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // handle deleteCommentAsync
      .addCase(deleteCommentAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        console.log("deleteCommentAsync action.payload:", action.payload);
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload._id
        );
        state.successMessage = "Comment deleted successfully";
      })
      .addCase(deleteCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // handle likeCommentAsync
      .addCase(likeCommentAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(likeCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
        state.successMessage = "Comment liked successfully";
      })
      .addCase(likeCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // handle updateCommentAsync
      .addCase(updateCommentAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(updateCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
        state.successMessage = "Comment updated successfully";
      })
      .addCase(updateCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default commentSlice.reducer;

export const selectComments = (state) => state.comment.comments;
export const selectTotalComments = (state) => state.comment.totalComments;
export const selectError = (state) => state.comment.errorMessage;
export const selectSuccess = (state) => state.comment.successMessage;
export const selectLoader = (state) => state.comment.loading;
