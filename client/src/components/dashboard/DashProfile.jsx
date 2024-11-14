import { Alert, Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteUserAsync,
  updateUserAsync,
  selectError,
  selectLoader,
  selectSuccess,
} from "../../features/user/userSlice";
import { signOutAsync, selectCurrentUser } from "../../features/auth/authSlice";
import CustomModal from "../../utils/Model"

export default function DashProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoader);
  const success = useSelector(selectSuccess);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append("username", formData.username);
    updatedFormData.append("email", formData.email);
    updatedFormData.append("password", formData.password);
    if (imageFile) {
      updatedFormData.append("profilePicture", imageFile); 
    }

    try {
      await dispatch(
        updateUserAsync({ userId: currentUser._id, formData: updatedFormData })
      ).unwrap();
      console.log("User updated successfully");
    } catch (error) {
      console.log("User update failed:", error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const resultAction=await dispatch(deleteUserAsync({userId:currentUser._id})).unwrap();
      if (deleteUserAsync.fulfilled.match(resultAction)) {
        navigate("/sign-up"); 
      }
      console.log("User deleted successfully");
    } catch (error) {
      console.log("User delete failed:", error.message);
    }
  };

  const handleSignout = async () => {
    try {
      const resultAction = await dispatch(signOutAsync());
      if (signOutAsync.fulfilled.match(resultAction)) {
        navigate("/sign-in");
      }
    } catch (error) {
      console.log("User sign-out failed:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          
        />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          {imageFile && (
            <CircularProgressbar
              value={imageFileUrl ? 100 : 0}
              text={`${imageFileUrl ? 100 : 0}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${100 / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUrl && "opacity-60"
            }`}
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>

        {/* create a post */}
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>


      <div className="text-red-500 flex justify-between mt-5">
        {/* TODO:not working  */}
        <span onClick={() => setShowModal(true)} className="hover:underline cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="hover:underline cursor-pointer">
          Sign Out
        </span>
      </div>

      {success && (
        <Alert color="success" className="mt-5">
          {success}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}

      <CustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete your account?"
      />
    </div>
  );
}
