import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { StreamChat } from "stream-chat";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { fetchUser } = useContext(UserContext);
  const STREAM_CHAT_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Sign in to your backend
      const response = await axios.post(
        "https://pat-a-pet-backend.vercel.app/api/auth/signin",
        {
          email,
          password,
        },
      );

      const { token } = response.data;
      localStorage.setItem("token", token);

      // 2. Fetch user data into context
      await fetchUser();

      // 3. Connect to Stream Chat
      const chatClient = StreamChat.getInstance(STREAM_CHAT_API_KEY);
      const tokenResponse = await axios.post(
        "https://pat-a-pet-backend.vercel.app/api/chat/chatToken",
        { userId: response.data.user._id }, // Assuming your backend returns userId in the signin response
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await chatClient.connectUser(
        {
          id: response.data.user._id,
          name: response.data.user.fullname || email,
          image:
            response.data.user.profilePicture ||
            `https://getstream.io/random_png/?id=${response.data.userId}&name=${response.data.fullname || email}`,
        },
        tokenResponse.data.token,
      );

      // 4. Navigate to home and reload
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
      setError(err.response?.data?.error || "Something went wrong");

      // Disconnect from Stream if connection was partially established
      if (StreamChat.getInstance(STREAM_CHAT_API_KEY).userID) {
        StreamChat.getInstance(STREAM_CHAT_API_KEY).disconnectUser();
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#A0C878]">
      {/* Left Section */}
      {/* <div className="w-1/2 relative flex justify-center items-center text-white px-10 bg-[#A0C878]">
        <img
          src="icon-bg.png"
          alt="Dogs"
          className="absolute bottom-0 left-0 w-full h-[250px] object-contain "
        />
        <div className="absolute inset-0"></div>

        <div className="relative z-10 max-w-md text-left">
          <h1
          style={{ fontFamily: "'Epilogue', sans-serif" }}
          className="text-white font-bold text-[80px] leading-[1.1]"
        >
          Welcome to <br /> Melanotect
        </h1>
          <hr className="border-white w-20 my-4" />
          <p className="text-lg">Fast and easy melanoma detection using advanced AI technology.</p>
        </div>
      </div> */}

      <div className="w-1/2 relative flex justify-center items-center text-white px-10 bg-[#A0C878]">
        <img
          src="icon-bg.png"
          alt="Dogs"
          className="absolute bottom-0 left-0 w-full h-[250px] object-contain"
        />
        <div className="relative z-10 max-w-md text-left">
          <h1
            style={{ fontFamily: "'Epilogue', sans-serif" }}
            className="text-white font-bold text-[50px] leading-[1.1]"
          >
            Welcome back <br /> Pawrents
          </h1>
          <hr className="border-white w-20 my-4" />
          {/* <p className="text-lg">Fast and easy melanoma detection using advanced AI technology.</p> */}
          <p className="text-lg">
            Connecting pets with loving homes, faster and simpler than ever.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[#FDF7F4] p-10 rounded-tl-[50px] rounded-bl-[50px] shadow-lg">
        <img
          src="logo.png"
          alt="pat-a-pet"
          className="absolute top-15 mid w-40 z-20"
        />
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Sign In to Pat-A-Pet
        </h2>

        <form className="w-3/4" onSubmit={handleLogin}>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="mail@abc.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <label className="block text-gray-700 mb-2">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[20px] transform -translate-y-1/2 text-sm text-gray-600"
            >
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <label>
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <a
              href="#"
              className="hover:underline font-bold"
              style={{ color: "#A0C878" }}
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 rounded-lg font-semibold hover:bg-[#0f6b87] transition"
            style={{ backgroundColor: "#A0C878" }}
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-sm">
          Don't have an account yet?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-bold hover:underline"
            style={{ color: "#A0C878" }}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}
