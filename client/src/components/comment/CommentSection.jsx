import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";

import {
  createCommentAsync,
  getPostCommentsAsync,
  likeCommentAsync,
  deleteCommentAsync,
  updateCommentAsync,
  selectComments,
  selectLoader,
  selectError,
} from "../../features/comment/commentSlice";
import CustomModal from "../../utils/Model";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Alert, Textarea, Button } from "flowbite-react";

function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const comments = useSelector(selectComments);
  const loading = useSelector(selectLoader);
  const error = useSelector(selectError);
  const navigate = useNavigate();

  const [editedContent, setEditedContent] = useState("");
  const [editedId, setEditedId] = useState(null);
  const [content, setContent] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {

    if (postId) {
      (async () => {
        const result = await dispatch(getPostCommentsAsync(postId)).unwrap();
        // console.log("getPostComments result", result);
      })();
    }
  }, [
    dispatch,
    postId,
    createCommentAsync.fulfilled,
    updateCommentAsync.fulfilled,
    deleteCommentAsync.fulfilled,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length > 200) {
      return;
    }
    try {
      const formData = { content, postId, userId: currentUser._id };
      await dispatch(createCommentAsync(formData)).unwrap();
      setContent("");
    } catch (error) {
      setCommentError(error.message);
    }
  };

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    await dispatch(likeCommentAsync(commentId)).unwrap();
  };

  const handleEdit = async () => {
    await dispatch(updateCommentAsync({ commentId: editedId, content: editedContent })).unwrap();
    setEditedId(null);
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    await dispatch(deleteCommentAsync(commentId)).unwrap();
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            className="w-full"
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - content.length} characters remaining
            </p>
            <Button type="submit"  gradientDuoTone="purpleToBlue" outline>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {loading ? (
        <p className="text-sm my-5">Loading comments...</p>
      ) : error ? (
        <p className="text-sm my-5 text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          {/* user comments start */}
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments?.map((comment) => (
            <div
              className="flex p-4 border-b dark:border-gray-600 text-sm"
              key={comment?._id}
            >
              <div className="flex-shrink-0 mr-3">
                <img
                  className="w-10 h-10 rounded-full bg-gray-200"
                  src={comment?.user?.[0]?.profilePicture || ""}
                  alt={comment?.user?.[0]?.username || "Anonymous"}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="font-bold mr-1 text-xs truncate">
                    {comment.user?.[0]
                      ? `@${comment?.user?.[0].username}`
                      : "Anonymous"}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {moment(comment?.createdAt).fromNow()}
                  </span>
                </div>
                {editedId === comment._id ? (
                  <>
                    <Textarea
                      className="mb-2"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <Button
                        type="button"
                        size="sm"
                        gradientDuoTone="purpleToBlue"
                        onClick={handleEdit}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        gradientDuoTone="purpleToBlue"
                        outline
                        onClick={() => setEditedId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 pb-2">{comment?.content}</p>
                    {/* handle comment like,edit, and delete start */}
                    <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                      <button
                        type="button"
                        onClick={() => handleLike(comment?._id)}
                        className={`text-gray-400 hover:text-blue-500 ${
                          currentUser &&
                          comment.likes.includes(currentUser?._id) &&
                          "!text-blue-500"
                        }`}
                      >
                        <FaThumbsUp className="text-sm" />
                      </button>
                      <p className="text-gray-400">
                        {comment?.numberOfLikes > 0 &&
                          `${comment.numberOfLikes} ${
                            comment.numberOfLikes === 1 ? "like" : "likes"
                          }`}
                      </p>
                      {currentUser &&
                        (currentUser._id === comment?.userId ||
                          currentUser.isAdmin) && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                // setIsEditing(true);
                                setEditedContent(comment.content);
                                setEditedId(comment._id);
                              }}
                              className="text-gray-400 hover:text-blue-500"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowModal(true);
                                setCommentToDelete(comment._id);
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              Delete
                            </button>
                          </>
                        )}
                    </div>
                    {/* handle comment like,edit, and delete end */}
                  </>
                )}
              </div>
            </div>
          ))}
          {/* user comments end */}
        </>
      )}

      <CustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleDelete(commentToDelete)}
        message="Are you sure you want to delete this comment?"
      />
    </div>
  );
}

export default CommentSection;
