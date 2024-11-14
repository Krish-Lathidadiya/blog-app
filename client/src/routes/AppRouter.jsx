import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import PrivateRoute from "./PrivateRoute";
import OnlyAdminPrivateRoute from "./OnlyAdminPrivateRoute"
import Home from "../pages/Home";
import Header from "../components/Header";
import FooterCom from "../components/Footer";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Dashboard from "../pages/Dashboard"
import { selectIsLoggedIn } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import CreatePost from '../pages/CreatePost';
import UpdatePost from '../pages/UpdatePost';
import PostPage from "../pages/PostPage";
import Search from "../pages/Search";
function AppRouter() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  console.log("isLoggedIn:", isLoggedIn);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage/>}/>
        <Route path="/search" element={<Search />} />

        {/* <Route path='/post/:postSlug' element={<PostPage />} /> */}
        {/* <Route path='/search' element={<Search />} /> */}

        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>

        <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <FooterCom />
    </Router>
  );
}

export default AppRouter;
