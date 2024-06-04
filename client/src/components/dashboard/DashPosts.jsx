import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../../features/auth/authSlice";
import {
  deletePostAsync,
  getPostsAsync,
  selectPost,
  selectTotalPosts,
} from "../../features/post/postSlice";
import CustomModal from "../../utils/Model";

function DashPosts() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPost);
  const totalPosts = useSelector(selectTotalPosts);
  console.log("totalPosts",totalPosts);
  const currentUser = useSelector(selectCurrentUser);
  const [filter, setFilter] = useState({ userId: currentUser?._id });
  const [limit, setLimit] = useState(5); 
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const newFilter = { ...filter, userId: currentUser._id,limit:limit };
        setFilter(newFilter);
        const result = await dispatch(getPostsAsync(newFilter)).unwrap();
        // console.log("dashposts result:",result);
        if (result.posts.length === totalPosts) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [dispatch, currentUser, totalPosts]);

  const handleShowMore = async () => {
    const newLimit = limit + 5;

    try {
      const newFilter = { ...filter, limit: newLimit };
      setFilter(newFilter);
      const result = await dispatch(getPostsAsync(newFilter)).unwrap();
      if (result.posts.length === totalPosts) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      await dispatch(
        deletePostAsync({ postId: postIdToDelete, userId: currentUser._id })
      ).unwrap();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && posts?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {posts.map((post, index) => (
              <Table.Body key={post._id || index} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  {/* Post page Link start */}
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  {/* Post page Link end */}

                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  {/* Update Post */}
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      Edit
                    </Link>
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
        <p>You have no posts yet!</p>
      )}

      {/* Delete post modal */}
      <CustomModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setPostIdToDelete("");
        }}
        onConfirm={handleDeletePost}
        message="Are you sure you want to delete this post?"
      />
    </div>
  );
}

export default DashPosts;
