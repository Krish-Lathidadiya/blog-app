import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../utils/Model";
import { selectCurrentUser } from "../../features/auth/authSlice";
import {
  getAllCommentsAsync,
  selectComments,
  selectTotalComments,
  deleteCommentAsync,
} from "../../features/comment/commentSlice";

function DashComments() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const comments = useSelector(selectComments);
  const totalComments = useSelector(selectTotalComments);
  const [limit, setLimit] = useState(5); // Initialize with a value to avoid multiple fetches
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await dispatch(getAllCommentsAsync({ limit })).unwrap();
        if (result.comments.length >= totalComments) {
          setShowMore(false);
        }
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [dispatch, currentUser, limit, totalComments]);

  const handleShowMore = async () => {
    try {
      const newLimit = limit + 5;
      setLimit(newLimit);
      const result = await dispatch(
        getAllCommentsAsync({ limit: newLimit })
      ).unwrap();
      if (result.comments.length >= totalComments) {
        setShowMore(false);
      }
    } catch (error) {
      console.error("Error showing more comments:", error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setShowModal(false);
    try {
      await dispatch(deleteCommentAsync(commentId)).unwrap();
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>User Name</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y border-t " key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.post?.[0]?.title}</Table.Cell>
                  <Table.Cell>{comment.user?.[0]?.username}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer text-xl"
                    >
                      <MdDelete/>
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}

      <CustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={()=>handleDeleteComment(commentIdToDelete)}
        message="Are you sure you want to delete this comment?"
      />
    </div>
  );
}

export default DashComments;
