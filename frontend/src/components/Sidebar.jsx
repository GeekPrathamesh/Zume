import React, { useContext, useEffect, useState } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../context/Authcontext";
import { Messagecontext } from "../context/Messagecontext";

const Sidebar = () => {
  
  const navigate = useNavigate();
  const {logout,onlineUsers}=useContext(Authcontext);
  const {    messages,
    setmessages,
    Users,setUsers,
    selectedUser,
    setselectedUser,
    getUsers,
    getMessegesforselected,
    sendMessage,
    unseenMessages,
    setunseenMessages}=useContext(Messagecontext);

    const [input,setInput]=useState("");
const filteredUsers = Users.filter(user =>
  user.fullName.toLowerCase().includes(input.toLowerCase())
);

useEffect(()=>{
  getUsers()
},[onlineUsers])

// console.log("onlineUsers:", onlineUsers);
// console.log("current user id:", Users._id.toString());

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll
  text-white ${selectedUser ? "max-md:hidden" : ""}`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center mb-5">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />

            <div
              className="absolute top-2 right-0 z-20 w-32 p-5 rounded-md
          bg-[#282142] border border-gray-600 text-gray-100 hidden
          group-hover:block"
            >
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-t border-gray-500" />

              <p onClick={logout} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-4 py-3 px-4 mt-5]">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input value={input} onChange={(e)=>{setInput(e.target.value)}}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="search user"
            name=""
            id=""
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div onClick={()=>{setselectedUser(user);setunseenMessages(prev=>({...prev,[user._id]:0})) } } key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id===user._id && "bg-[#282142]/50"}`}>
<div className="w-[35px] h-[35px] rounded-full overflow-hidden bg-gray-600">
  <img
    src={user?.profilePic || assets.avatar_icon}
    alt="User avatar"
    className="w-full h-full object-cover object-center"
  />
</div>

            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onlineUsers?.includes(user._id.toString())? (
                <span className="text-green-400 text-xs">online</span>
              ) : (
                <span className="text-neutral-400 text-xs">offline</span>
              )}
            </div>
            {unseenMessages[user._id]>0 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">{unseenMessages[user._id]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
