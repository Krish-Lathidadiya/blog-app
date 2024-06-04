import {
  Navbar,
  TextInput,
  Button,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Dropdown,
  Avatar,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { toggleTheme, selectCurrentTheme } from "../features/theme/themeSlice";
import { signOutAsync } from "../features/auth/authSlice";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const theme = useSelector(selectCurrentTheme);
  const { pathname } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  // console.log(pathname);

  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2 py-2">
      {/* Logo */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white"
      >
        <span className="px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white tracking-wider">
          KRISH's
        </span>
        Blog
      </Link>

      {/* Search Input */}
      <form action="" className="hidden lg:inline" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search .."
          rightIcon={AiOutlineSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="lg:hidden w-12 h-10" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      {/* Actions */}
      <div className="flex gap-2 md:order-2">
        {/* toggle theme */}
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>

        {currentUser ? (
          // Content for logged-in users
          <>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="User" img={currentUser.profilePicture} rounded />
              }
            >
              <DropdownHeader>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </DropdownHeader>
              {currentUser.isAdmin ? (
                <>
                  <Link to={"/dashboard"}>
                    <DropdownItem>Dashboard</DropdownItem>
                  </Link>
                  <DropdownDivider />
                </>
              ) : null}
              <Link to={"/dashboard?tab=profile"}>
                <DropdownItem>Profile</DropdownItem>
              </Link>
              <DropdownDivider />
              <div onClick={handleSignout}>
                <DropdownItem>Sign Out</DropdownItem>
              </div>
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/sign-in">
              <Button outline gradientDuoTone="purpleToBlue">
                Sign In
              </Button>
            </Link>
          </>
        )}
        <NavbarToggle />
      </div>

      {/* Navigation Links */}
      <NavbarCollapse>
        <NavbarLink active={pathname === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </NavbarLink>
        <NavbarLink active={pathname === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </NavbarLink>
        <NavbarLink active={pathname === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Header;
