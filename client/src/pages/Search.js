import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allPodcasts, setAllPodcasts] = useState([]);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  useEffect(() => {
    const updateTheme = () => {
      const theme = localStorage.getItem("theme");
      setDarkMode(theme !== "light");
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", updateTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/podcasts");
        setAllPodcasts(res.data);
      } catch (err) {
        console.error("Error fetching podcasts", err);
      }
    };
    fetchPodcasts();
  }, []);

  useEffect(() => {
    const filtered = allPodcasts.filter(
      (pod) =>
        pod.title.toLowerCase().includes(query.toLowerCase()) ||
        pod.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, allPodcasts]);

  const renderMediaPlayer = (filename) => {
    if (!filename) return null;
    const ext = filename.split(".").pop().toLowerCase();
    const src = `http://localhost:5000/uploads/${filename}`;

    if (["mp3", "wav", "mpeg"].includes(ext)) {
      return (
        <audio controls className="w-full mt-2 rounded">
          <source src={src} type={`audio/${ext}`} />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (["mp4", "mov", "mkv", "webm", "ogg"].includes(ext)) {
      return (
        <video controls className="w-full mt-2 rounded max-h-64">
          <source src={src} type={`video/${ext}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <p className="text-red-500 mt-2">Unsupported file type</p>;
    }
  };

  const getSection = (category) => (
    <div className="mt-10">
      <button
        onClick={() => navigate("/dashboard")}
        className={`w-full py-3 px-6 text-center rounded-lg font-semibold text-lg transition transform hover:scale-105 shadow-md ${
          darkMode ? "bg-[#1c1c2e] text-white hover:bg-[#2c2c3c]" : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        {category} Podcasts
      </button>
    </div>
  );

  return (
    <div
      className={`p-8 min-h-screen space-y-6 transition-colors duration-300 ${
        darkMode ? "bg-[#0f0f14] text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex items-center gap-3 text-purple-400 text-2xl font-bold">
        <FaSearch />
        Search Podcasts
      </div>

      <input
        type="text"
        placeholder="Search by title or description..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full p-3 rounded-lg border placeholder-gray-400 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
        }`}
      />

      {query && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((pod) => (
              <div
                key={pod._id}
                className={`p-5 rounded-xl shadow-md hover:shadow-lg transition ${
                  darkMode ? "bg-[#1e1e2f] text-white" : "bg-white text-black"
                }`}
              >
                <h2 className="text-lg font-semibold text-purple-300 mb-1">
                  {pod.title}
                </h2>
                <p className="text-gray-400 text-sm">{pod.description}</p>
                {renderMediaPlayer(pod.media)}
              </div>
            ))
          ) : null}
        </div>
      )}

      {!query && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {getSection("Comedy")}
          {getSection("News")}
          {getSection("Sports")}
          {getSection("Crime")}
        </div>
      )}
    </div>
  );
};

export default Search;
