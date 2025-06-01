import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { TiMessage } from "react-icons/ti";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = ({  currBg, setCurrBg }) => {
  const {logout,onlineUsers}=useContext(AuthContext)
  const {users,getUsers,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages}=useContext(ChatContext)
  const [input , setInput]=useState(false)
  const navigate = useNavigate();
  const filteredUsers = input 
  ? users.filter((user) => 
      user.fullName.toLowerCase().includes(input.toLowerCase())
    ) 
  : users;

  const fileInputRef = useRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrBg(reader.result);
        localStorage.setItem("bgImg", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(()=>{
    getUsers();
  },[onlineUsers])

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          {/* <img src={assets.logo} alt="" className='max-w-40' /> */}
          <div className="flex items-center space-x-3 text-white text-2xl font-bold ">
            <TiMessage className="w-7 h-7 text-indigo-400 " />
            <p className="tracking-wide text-slate-100 ">CONVOZO</p>
          </div>
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt=""
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500 " />
              <p
                onClick={handleClick}
                id="bg"
                className="cursor-pointer text-sm"
              >
                Background
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                accept="image/*"
              />
              <hr className="my-2 border-t border-gray-500 " />
              <p onClick={()=>logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img  src={assets.search_icon} alt="" className="w-3" />
          <input onChange={(e)=>setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User ..."
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div
          onClick={() => {
            setSelectedUser(false);
            navigate("/chatur")
          }}
          className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm`}
        >
          <img
            src={assets.chatur}
            alt=""
            className="w-[35px] aspect-[1/1] rounded-full"
          />
          <div className="flex flex-col leading-5">
            <p>ChaturBot</p>
            <span className="text-green-400 text-xs">Online</span>
          </div>
          {/* {index > 2 && (
              <p className="absolute top-4 right-4 text-xs h-4 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {index}
              </p>
            )} */}
        </div>
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev)=>({...prev,[user._id]:0}))
            }}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-[#282142]/50"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id)  ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {unseenMessages[user._id] > 0  && (
              <p className="absolute top-4 right-4 text-xs h-4 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
