import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState(""); // New
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#A0C878]">
      {/* Left Section */}
      <div className="w-1/2 relative flex justify-center items-center text-white px-10 bg-[#A0C878]">
        <img
          src="icon-bg.png"
          alt="Dogs"
          className="absolute bottom-0 left-0 w-full h-[250px] object-contain"
        />
        <div className="relative z-10 max-w-md text-left">
          <h1 style={{ fontFamily: "'Epilogue', sans-serif" }} className="text-white font-bold text-[50px] leading-[1.1]">
            Welcome to <br /> Pat-A-Pet
          </h1>
          <hr className="border-white w-20 my-4" />
          <p className="text-lg">Fast and easy melanoma detection using advanced AI technology.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[#FDF7F4] p-10 rounded-tl-[50px] rounded-bl-[50px] shadow-lg">
        <img
          src="logo.png"
          alt="logo"
          className="w-40 mb-3"
        />
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Account</h2>

        <form className="w-3/4" onSubmit={handleSignUp}>
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

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
              placeholder="********"
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

          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full text-white py-2 rounded-lg font-semibold hover:bg-[#0f6b87] transition"
            style={{ backgroundColor: "#A0C878" }}
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="font-bold hover:underline"
            style={{ color: "#A0C878" }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
