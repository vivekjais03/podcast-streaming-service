import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaPodcast, FaHeadphones, FaTrash, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPodcasts = async () => {
    try {
      const res = await axiosInstance.get("/podcasts");
      setPodcasts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch podcasts:", err);
      toast.error("Could not load podcasts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePodcast = async (podcastId) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to delete podcast");

    try {
      await axiosInstance.delete(`/podcasts/${podcastId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPodcasts((prev) => prev.filter((p) => p._id !== podcastId));
      toast.success("🗑️ Podcast deleted");
    } catch (error) {
      console.error("❌ Delete error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to delete podcast.");
    }
  };

  const handleAddToFavourites = async (podcastId) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to add to favourites");

    try {
      await axiosInstance.post(
        `/favourites/${podcastId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("❤️ Added to favourites");
    } catch (error) {
      console.error("❌ Favourites error:", error);
      toast.error("Failed to add to favourites.");
    }
  };

  const renderMediaPlayer = (filename) => {
    if (!filename) {
      return <p className="text-red-500 mt-2">No media found</p>;
    }

    const ext = filename.split(".").pop().toLowerCase();
    const src = `http://localhost:5000/uploads/${filename}`;
    const isVideo = ["mp4", "mov", "webm", "ogg"].includes(ext);
    const containerStyle =
      "mt-2 p-1 bg-gray-100 dark:bg-[#2a2a3b] border border-gray-300 dark:border-gray-600 rounded-md shadow-md";
    const playerStyle = "w-full max-h-64 rounded-md pointer-events-auto";

    const handleAutoPlay = (e) => {
      e.currentTarget.play().catch((err) => {
        console.warn("Autoplay failed:", err.message);
      });
    };

    return (
      <div className={containerStyle}>
        {isVideo ? (
          <video
            controls
            preload="metadata"
            className={playerStyle}
            onClick={handleAutoPlay}
          >
            <source src={src} type={`video/${ext}`} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <audio
            controls
            preload="metadata"
            className={playerStyle}
            onClick={handleAutoPlay}
          >
            <source src={src} type={`audio/${ext}`} />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-white dark:bg-[#0f0f1a] transition-colors duration-300">
      <div className="flex items-center gap-3 text-purple-500 dark:text-purple-300 text-3xl font-bold">
        <FaPodcast />
        All Podcasts
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : podcasts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No podcasts uploaded yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {podcasts.map((pod) => (
            <div
              key={pod._id}
              className="bg-[#f3f3f3] dark:bg-[#1c1c29] hover:dark:bg-[#22223a] hover:bg-gray-200 transition rounded-2xl shadow-xl p-5 flex flex-col justify-between text-black dark:text-white"
            >
              <h2 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-300">
                {pod.title}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-400 mb-3 line-clamp-2">
                {pod.description}
              </p>

              {renderMediaPlayer(pod.media)}

              <div className="flex items-center justify-between mt-3 text-sm text-gray-700 dark:text-gray-400">
                <span>Type: {pod.media?.split(".").pop().toUpperCase()}</span>
                <FaHeadphones className="text-purple-500" />
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleDeletePodcast(pod._id)}
                  className="flex-1 px-4 py-2 rounded-full font-semibold flex items-center gap-2 justify-center bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-red-500/40 transition-all duration-200 transform hover:scale-105"
                >
                  <FaTrash />
                  Delete
                </button>

                <button
                  onClick={() => handleAddToFavourites(pod._id)}
                  className="flex-1 px-4 py-2 rounded-full font-semibold flex items-center gap-2 justify-center bg-pink-600 hover:bg-pink-700 text-white shadow-md hover:shadow-pink-500/40 transition-all duration-200 transform hover:scale-105"
                >
                  <FaHeart />
                  Favourite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

