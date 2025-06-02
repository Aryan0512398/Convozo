import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import Chatur from "./pages/Chatur";
import {Toaster} from "react-hot-toast"
import { AuthContext } from "../context/AuthContext";

const App = () => {
  const {authUser}=useContext(AuthContext)
  const [currBg, setCurrBg] = useState(null);
   // Load background from localStorage on first render
  useEffect(() => {
    const savedBg = localStorage.getItem("bgImg");
    if (savedBg) {
      setCurrBg(savedBg);
    }
  }, []);
   // Save background to localStorage when updated
  useEffect(() => {
    if (currBg) {
      localStorage.setItem("bgImg", currBg);
    }
  }, [currBg]);
  return (
    <div className="bg-contain" style={{
          backgroundImage: currBg ? `url(${currBg})` : `url('./src/assets/bg2.jpg')`
        }}>
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage currBg={currBg} setCurrBg={setCurrBg}></HomePage> : <Navigate to="/login"></Navigate>} />
        <Route path="/login" element={ !authUser ? <LoginPage></LoginPage> : <Navigate to="/"></Navigate>} />
        <Route path="/profile" element={authUser ?<ProfilePage></ProfilePage> : <Navigate to="/login"></Navigate>} />
        <Route path="/chatur" element={authUser  ? <Chatur></Chatur> : <Navigate to="/login"></Navigate>} />
      </Routes>
    </div>
  );
};

export default App;
