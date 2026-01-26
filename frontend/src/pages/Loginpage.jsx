import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { Authcontext } from "../context/Authcontext";

const Loginpage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const {login} = useContext(Authcontext);

  const handleSubmit = async(e) => {
    e.preventDefault();

    // If signup → move to bio step
    if (isSignup) {
      setIsSubmitted(true);
      return;
    }

   await login("login",{email,password});
  };

  const handleBioSubmit = async(e) => {
    e.preventDefault();

       await login("signup",{fullName:name,email,password,bio});

  };

  return (
    <div className="h-screen w-full flex bg-[#0f0b14]">

      {/* LEFT – BIG LOGO */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src={assets.logo_big}
          alt="logo"
          className="w-[70%] max-w-[420px] opacity-90"
        />
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-gray-600 rounded-2xl p-8 text-white shadow-xl">

          {/* ================= BIO STEP ================= */}
          {isSubmitted ? (
            <>
              <h1 className="text-2xl font-medium text-center">
                Tell us about you
              </h1>
              <p className="text-sm text-gray-400 text-center mt-1">
                Add a short bio for your profile
              </p>

              <form
                onSubmit={handleBioSubmit}
                className="mt-8 flex flex-col gap-4"
              >
                <textarea
                  placeholder="Write a short bio..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-gray-100/10 border border-gray-600 rounded-xl px-4 py-3 text-sm outline-none text-white placeholder-gray-400 resize-none focus:border-violet-500"
                />

                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-400 to-violet-600 py-3 rounded-full text-sm font-light hover:opacity-90 transition"
                >
                  Finish Setup
                </button>
              </form>

              {/* Back to login */}
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setIsSignup(false);
                }}
                className="mt-6 text-xs text-gray-400 hover:underline block mx-auto"
              >
                ← Back to Sign In
              </button>
            </>
          ) : (
            <>
              {/* ================= LOGIN / SIGNUP ================= */}

              <h1 className="text-2xl font-medium text-center">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-sm text-gray-400 text-center mt-1">
                {isSignup
                  ? "Sign up to start chatting"
                  : "Login to continue chatting"}
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-4"
              >
                {isSignup && (
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-gray-100/10 border border-gray-600 rounded-xl px-4 py-3 text-sm outline-none text-white placeholder-gray-400 focus:border-violet-500"
                  />
                )}

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-100/10 border border-gray-600 rounded-xl px-4 py-3 text-sm outline-none text-white placeholder-gray-400 focus:border-violet-500"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-100/10 border border-gray-600 rounded-xl px-4 py-3 text-sm outline-none text-white placeholder-gray-400 focus:border-violet-500"
                />

                <button
                  type="submit"
                  className="mt-2 bg-gradient-to-r from-purple-400 to-violet-600 py-3 rounded-full text-sm font-light hover:opacity-90 transition"
                >
                  {isSignup ? "Create Account" : "Login"}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
                <span
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-violet-400 cursor-pointer hover:underline"
                >
                  {isSignup ? "Login" : "Sign up"}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
