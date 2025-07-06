import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaPodcast,
  FaGoogle,
  FaSun,
  FaMicrophoneAlt,
  FaHeadphones,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import podcastBanner from "../assets/1.jpg";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post("https://podcast-backend-hixn.onrender.com/api/auth/login", {
          email: form.email,
          password: form.password,
        });

        const { token } = res.data;
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        await axios.post("https://podcast-backend-hixn.onrender.com/api/auth/signup", form);
        toast.success("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.error || "Error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-6 md:px-10 py-10 flex flex-col md:flex-row gap-12 justify-center items-start transition-colors duration-300 ${
        isDark ? "bg-[#0e0e15] text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Left Panel */}
      <div className="md:w-1/2 w-full space-y-6">
        <div className="flex items-center gap-2 text-purple-400 text-2xl font-bold">
          <FaPodcast />
          <span>PodStream</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Discover the World of Podcasts
        </h1>

        <p className="text-lg text-gray-300 max-w-xl">
          Dive into thousands of shows on tech, comedy, news, and more. Upload
          your voice and inspire the world!
        </p>

        <img
          src={podcastBanner}
          alt="Podcast banner"
          className="rounded-lg shadow-xl w-full object-cover max-h-72"
        />

        <div className="space-y-3 text-sm md:text-base mt-6">
          <div className="flex items-center gap-3">
            <FaMicrophoneAlt className="text-purple-400" />
            <span>Host & Upload your podcasts easily.</span>
          </div>
          <div className="flex items-center gap-3">
            <FaHeadphones className="text-purple-400" />
            <span>Listen anytime, anywhere on the go.</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPodcast className="text-purple-400" />
            <span>Curated playlists and trending creators.</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="md:w-1/2 w-full flex flex-col gap-8 items-center mt-8 md:mt-20">
        <div
          className={`w-full max-w-md p-6 md:p-8 rounded-xl shadow-xl ${
            isDark ? "bg-[#1c1c29]" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isLogin ? "Login to PodStream" : "Sign Up for PodStream"}
            </h2>
            <button onClick={() => setIsDark(!isDark)}>
              <FaSun className="text-xl text-purple-400" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border border-gray-600 rounded-md ${
                      isDark ? "bg-[#2a2a3b]" : "bg-gray-100"
                    } placeholder-gray-400`}
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border border-gray-600 rounded-md ${
                    isDark ? "bg-[#2a2a3b]" : "bg-gray-100"
                  } placeholder-gray-400`}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border border-gray-600 rounded-md ${
                    isDark ? "bg-[#2a2a3b]" : "bg-gray-100"
                  } placeholder-gray-400`}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
                </button>
              </form>

              <button
                disabled
                className="w-full bg-white text-black mt-4 py-2 rounded-md flex items-center justify-center gap-2 shadow-md cursor-not-allowed opacity-50"
              >
                <FaGoogle /> Continue with Google (Coming soon)
              </button>

              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span></span>
                <button className="text-purple-400 hover:underline">
                  Forgot password?
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-4">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"} {" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-400 underline"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-4xl text-sm text-gray-300 rounded-xl px-6 py-4 mt-10 bg-[#1c1c29]">
          <h3 className="text-purple-400 font-bold text-center mb-2">
            What creators say:
          </h3>
          <p className="text-center">
            “PodStream gave me a platform to share my ideas. It changed my
            life!” – @voice_of_tech
          </p>
          <p className="text-center">
            “Best UI + easy upload process. Highly recommend.” – @dailycomedian
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
