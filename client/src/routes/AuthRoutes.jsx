import React from "react";
import { Routes, Route } from "react-router-dom";


function AuthRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default AuthRoutes;
