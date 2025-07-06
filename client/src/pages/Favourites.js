import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaPodcast, FaTrash, FaPlay } from "react-icons/fa";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [sortBy, setSortBy] = useState(localStorage.getItem("sortOption") || "date");
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const itemsPerPage = 6;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://podcast-backend-hixn.onrender.com/api/favourites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavourites(res.data);
      } catch (err) {
        console.error("Failed to fetch favourites:", err);
      }
    };

    fetchFavourites();
  }, []);

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://podcast-backend-hixn.onrender.com/api/favourites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavourites((prev) => prev.filter((fav) => fav._id !== id));
    } catch (err) {
      console.error("Failed to remove favourite:", err);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    localStorage.setItem("sortOption", value);
  };

  const sortedFavourites = [...favourites].sort((a, b) => {
    if (sortBy === "type") {
      return a.media.localeCompare(b.media);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const renderMediaPlayer = (filename, autoplay = false) => {
    const ext = filename.split(".").pop().toLowerCase();
    const src = `https://podcast-backend-hixn.onrender.com/uploads/${filename}`;

    if (["mp3", "wav", "mpeg"].includes(ext)) {
      return (
        <audio controls autoPlay={autoplay} className="w-full mt-2">
          <source src={src} type={`audio/${ext}`} />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (["mp4", "mov", "mkv"].includes(ext)) {
      return (
        <video controls autoPlay={autoplay} className="w-full mt-2 rounded">
          <source src={src} type={`video/${ext}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <p className="text-red-600">Unsupported media type</p>;
    }
  };

  const playAll = () => {
    const firstAudio = document.querySelector("audio, video");
    if (firstAudio) {
      firstAudio.play();
    }
  };

  const exportToFile = () => {
    const data = favourites.map(({ title, description, media }) => ({ title, description, media }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "favourites.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFavourites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedFavourites.length / itemsPerPage);

  return (
    <div className={`space-y-6 transition-colors min-h-screen p-6 ${darkMode ? "bg-[#0f0f14] text-white" : "bg-gray-100 text-black"}`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaHeart className="text-red-500" /> Your Favourite Podcasts
        </h1>
        <div className="flex gap-2">
          <select
            className={`border p-2 rounded ${
              darkMode ? "bg-[#1e1e2f] text-white border-gray-600" : "bg-white text-black border-gray-300"
            }`}
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="type">Sort by Type</option>
          </select>
          <button
            onClick={playAll}
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          >
            <FaPlay className="inline mr-1" /> Play All
          </button>
          <button
            onClick={exportToFile}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Export
          </button>
        </div>
      </div>

      {currentItems.length === 0 ? (
        <p className="text-center text-gray-400">No favourites added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((fav) => (
            <div
              key={fav._id}
              className={`shadow-md rounded-xl p-5 hover:shadow-lg transition relative ${
                darkMode ? "bg-[#1e1e2f] text-white" : "bg-white text-black"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <FaPodcast className="text-purple-400" /> {fav.title}
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-700"} mb-2`}>
                {fav.description}
              </p>
              {renderMediaPlayer(fav.media)}
              <button
                onClick={() => handleRemove(fav._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
              <p className={`text-sm mt-2 ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                Type: {fav.media.split(".").pop().toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-purple-600 text-white"
                  : darkMode
                  ? "bg-[#2a2a3b] text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
