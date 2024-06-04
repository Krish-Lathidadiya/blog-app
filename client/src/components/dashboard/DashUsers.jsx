import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { deleteUserAsync, getUsersAsync } from "../../features/user/userSlice";
import CustomModal from "../../utils/Model";

function DashUsers() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [filter, setFilter] = useState({});
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      // console.log("useEffect called...");
      try {
        const result = await dispatch(getUsersAsync(filter)).unwrap();
        // console.log("result", result);
        if (result) {
          setUsers(result.users);
          if (result?.users.length < 5) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser, dispatch]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    const newFilter = { ...filter, startIndex };
    setFilter(newFilter);

    try {
      const result = await dispatch(getUsersAsync(newFilter)).unwrap();
      if (result.users && result.users.length) {
        setUsers((prev) => [...prev, ...result.users]);
        if (result.users.length < 5) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const result = await dispatch(
        deleteUserAsync({ userId: userIdToDelete })
      ).unwrap();
      if (result) {
        setUsers((prev) =>
          prev.filter((user) => user && user._id !== userIdToDelete)
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && users?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
        <p>You have no users yet!</p>
      )}

      <CustomModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setUserIdToDelete("");
        }}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
}

export default DashUsers;
