import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInAsync,
  selectError,
  selectLoader,
} from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorMessage = useSelector(selectError);
  const loading = useSelector(selectLoader);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const setData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(signInAsync(formData));
    if (signInAsync.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col md:flex-row md:items-center p-3 max-w-4xl mx-auto gap-5">
        {/* left side */}
        <div className="flex-1">
          <Link
            to="/"
            className="self-center whitespace-nowrap text-3xl font-bold dark:text-white"
          >
            <span className="px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white tracking-wider">
              KRISH's
            </span>
            Blog
          </Link>
          <p className="my-5 text-md font-semibold">
            This is a demo project where you can sign up using your email and
            password, or alternatively, sign up with Google.
          </p>
        </div>
        {/* right side */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Your Email" />
              <TextInput
                type="text"
                name="email"
                value={formData.email}
                onChange={setData}
                placeholder="Email"
                id="email"
              />
            </div>
            <div className="relative">
              <Label value="Your Password" />
              <TextInput
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={setData}
                placeholder="Password"
                id="password"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 pt-5 cursor-pointer"
                onClick={() => setShowPassword((prevState) => !prevState)}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-md mt-3 font-semibold">
            <span>Don't Have an Account?</span>
            <Link to={"/sign-up"} className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5 items-center" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
