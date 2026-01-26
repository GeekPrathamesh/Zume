import React, { useContext, useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { Messagecontext } from "../context/Messagecontext";
import { Authcontext } from "../context/Authcontext";

const Rightsidebar = () => {
  const {selectedUser,messages}=useContext(Messagecontext);
  const {logout,onlineUsers}=useContext(Authcontext);
  const [msgImages,setmsgImages]=useState([])

  //get all media
  useEffect(()=>{
    setmsgImages(messages.filter(msg=>msg.image).map(msg=>msg.image))
  },[messages])
  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
     <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-600">
  <img
    src={selectedUser?.profilePic || assets.avatar_icon}
    alt="User avatar"
    className="w-full h-full object-cover object-center"
  />
</div>

          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2 ">
            {onlineUsers.includes(selectedUser._id)&&<p className="w-2 h-2 rounded-full bg-green-500"></p>}
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
        {/* ----------------------------------------  */}
        <hr className="border-[#ffffff50] my-4" />
        {/* ----------------------------------------  */}
        <div className="px-4 text-xs">
          <p>media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                onClick={() => window.open(url)}
                key={index}
                className="cursor-pointer rounded"
              >
                <img src={url} className="h-full rounded-md" alt="" />
              </div>
            ))}
          </div>
        </div>
        {/* ----------------------------------------  */}
        <button onClick={logout}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2
  bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none
  text-sm font-light py-2 px-20 rounded-full cursor-pointer"
        >
          Logout
        </button>

      </div>
    )
  );
};

export default Rightsidebar;
