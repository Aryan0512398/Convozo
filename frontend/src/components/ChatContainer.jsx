import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { TiMessage } from "react-icons/ti";
import { formatMessageTime } from "../lib/utils.js";
import EmojiPicker from "emoji-picker-react";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const ChatContainer = () => {
  const { selectedUser, setSelectedUser, messages, sendMessage, getMessages } =
    useContext(ChatContext);
  const { onlineUsers, authUser } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };
  // Handling image
  const handleSendImage = async (e) => {
    const file = e.target.files[0]; //  Get selected file
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file"); //  If not image, show error
      return;
    }
    const reader = new FileReader(); //  Read the file
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result }); //  Send base64 image
      e.target.value = ""; //  Reset input
    };
    reader.readAsDataURL(file); //  Read file as base64 URL
  };
  // Handling send message

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };
  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header part */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>
      {/* Chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !==authUser._id && "flex-row-reverse"
            } `}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                className="w-7 rounded-full"
                alt=""
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/* Bottom Area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-4"
          />
          <img
            src={assets.smile}
            className="w-5 mr-2 cursor-pointer"
            alt=""
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
          {/* Conditionally Show Emoji Picker */}
          {showEmojiPicker && (
            <div
              className="
      absolute
      bottom-16
      left-4
      z-50
      bg-white
      dark:bg-[#1f1f2e]
      rounded-2xl
      shadow-2xl
      p-3
      w-56   /* default width for small screens */
      h-60   /* default height for small screens */
      md:w-64  /* wider on medium+ screens */
      md:h-67  /* taller on medium+ screens */
      overflow-auto
      ring-1
      ring-gray-300
      dark:ring-gray-700
      scrollbar-thin
      scrollbar-thumb-indigo-500
      scrollbar-track-gray-200
      dark:scrollbar-track-gray-800
      "
              style={{ maxWidth: "80vw" }}
            >
              <EmojiPicker
                previewConfig={{ showPreview: false }}
                searchDisabled={true}
                onEmojiClick={handleEmojiClick}
                width="100%"
                height="100%"
                theme="dark"
              />
            </div>
          )}

          <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-2 cursor-pointer"
              alt=""
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          className="w-7 cursor-pointer"
          alt=""
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      {/* <img src={assets.arrow_icon} alt="" />  */}
      <TiMessage className="text-indigo-400 text-6xl " />

      <p className="text-lg font-medium text-white">
        Talk freely, wherever you are
      </p>
    </div>
  );
};

export default ChatContainer;
