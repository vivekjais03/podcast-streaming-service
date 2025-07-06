// client/src/components/PodcastList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://podcast-backend-hixn.onrender.com/api/podcasts");
        setPodcasts(res.data);
      } catch (err) {
        console.error("Error fetching podcasts:", err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🎧 Latest Podcasts</h2>
      {podcasts.map((podcast) => (
        <div
          key={podcast._id}
          className="bg-white p-4 mb-4 rounded-xl shadow-md border border-gray-200"
        >
          <h3 className="text-xl font-semibold">{podcast.title}</h3>
          <p className="text-gray-700 mb-2">{podcast.description}</p>
          <audio controls className="w-full mt-2">
            <source src={`https://podcast-backend-hixn.onrender.com/uploads/${podcast.audio}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default PodcastList;
