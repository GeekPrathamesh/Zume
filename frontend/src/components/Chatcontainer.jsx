import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessagetime } from "../lib/utils";
import { Messagecontext } from "../context/Messagecontext";
import { Authcontext } from "../context/Authcontext";
import toast from "react-hot-toast";

const Chatcontainer = () => {
  const {messages,selectedUser,sendMessage,getMessegesforselected}=useContext(Messagecontext);
  const {authUser, onlineUsers}=useContext(Authcontext);

  const [input ,setinput]=useState("")
  const scrollEnd = useRef();
  useEffect(() => {
    if(scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
// handle the sending message
  const handleSendmessage=async(e)=>{
    e.preventDefault();
    if(input.trim()==="") return null;
    await sendMessage({text:input.trim()});
    setinput("")

  }
// handle the sending image
const handlesendImage=async(e)=>{
      e.preventDefault();
const file = e.target.files[0];
if(!file || !file.type.startsWith("image/")){
  toast("select an image file");
  return;
}
const reader = new FileReader();
reader.onload=async()=>{
  await sendMessage({image:reader.result});
  e.target.value="";
}
reader.readAsDataURL(file);

}

useEffect(()=>{
  if(selectedUser){
    getMessegesforselected(selectedUser._id)
  }
},[selectedUser])

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* header part  */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500 ">
<div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
  <img
    src={selectedUser?.profilePic || assets.avatar_icon}
    alt="User avatar"
    className="w-full h-full object-cover object-center"
  />
</div>
      <p className="flex-1 text-lg text-white flex items-center gap-2">
        {selectedUser.fullName}
        {onlineUsers?.includes(selectedUser._id.toString()) && (
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        )}
      </p>

        <img
          onClick={() => setselectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 "
          alt=""
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5 " />
      </div>

      {/* chat area  */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !==authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
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

            <div className="text-center text-xs ">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
  <img
    src={
      msg.senderId === authUser._id
        ? authUser?.profilePic || assets.avatar_icon
        : selectedUser?.profilePic || assets.avatar_icon
    }
    alt="User avatar"
    className="w-full h-full object-cover object-center"
  />
</div>

              <p className="text-gray-500">
                {formatMessagetime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom input text area  */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 ">
        <div className="flex flex-1 items-center bg-gray-100/12 px-3 rounded-full ">
          <input type="text" value={input} onKeyDown={(e)=>e.key==="Enter"?handleSendmessage(e):null} onChange={(e)=>setinput(e.target.value)} placeholder="send a message " className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400" />
          <input onChange={handlesendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-2 cursor-pointer"
              alt=""
            />
          </label>
        </div>
        <img onClick={handleSendmessage} src={assets.send_button} alt="" className="w-7 cursor-pointer" />{" "}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden ">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p>chat anytime ,anywhere</p>
    </div>
  );
};

export default Chatcontainer;
