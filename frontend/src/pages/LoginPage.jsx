import React, { useContext, useState } from "react";
import { TiMessage } from "react-icons/ti";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const{login}=useContext(AuthContext)

  const onSubmitHandler=(e)=>{
    e.preventDefault();
    if(currState==="Sign Up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return
    }
    login(currState==="Sign Up" ? "signup" : "login" ,{fullName,email,password,bio})

  }
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8  sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left */}
      <div className="flex flex-col items-center text-white text-2xl font-bold w-[min(30vw,250px)]">
        <TiMessage className="w-[min(30vw,250px)] h-[min(30vw,150px)] text-indigo-400" />
        <p className="w-[min(30vw,150px) text-5xl text-center tracking-wide text-slate-100">
          CONVOZO
        </p>
      </div>
      {/* Right */}
      <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h1 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h1>
        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </>
        )}
        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            rows={4}
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter about yourself"
            required
          ></textarea>
        )}
        <button
          type="submitted"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 cursor-pointer rounded"
        >
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>
        {currState === "Sign Up" && <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" className="accent-violet-500" required />
          <p>Agree to the all terms and privacy policy</p>
        </div>}
        <div>
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already have an account ?{" "}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => setCurrState("Sign Up")}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
