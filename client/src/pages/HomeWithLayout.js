import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaMicrophone,
  FaSearch,
  FaHeart,
  FaUpload,
  FaSun,
  FaMoon,
  FaSignInAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Dashboard from "./Dashboard";
import UploadPodcast from "./UploadPodcast";
import SearchPage from "./Search";
import Favourites from "./Favourites";
import { motion, AnimatePresence } from "framer-motion";

// Genre Assets
import MostPopular1 from "../assets/genres/most-popular-1.jpeg";
import MostPopular2 from "../assets/genres/most-popular-2.jpeg";
import MostPopular3 from "../assets/genres/most-popular-3.jpg";
import Comedy1 from "../assets/genres/comedy-1.png";
import Comedy2 from "../assets/genres/comedy-2.png";
import Comedy3 from "../assets/genres/comedy-3.png";
import News1 from "../assets/genres/news-1.png";
import News2 from "../assets/genres/news-2.png";
import News3 from "../assets/genres/news-3.png";
import Crime1 from "../assets/genres/crime-1.png";
import Crime2 from "../assets/genres/crime-2.jpeg";
import Crime3 from "../assets/genres/crime-3.jpeg";
import Sports1 from "../assets/genres/sports-1.jpeg";
import Sports2 from "../assets/genres/sports-2.png";
import Sports3 from "../assets/genres/sports-3.png";

const slideVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

const HomeWithLayout = ({ page }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") !== "light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState({ name: "Vivek Jaiswal" });
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    {
      name: "Most Popular",
      data: [
        { img: MostPopular1, title: "The Daily Mindset", desc: "Boost your day with quick mental habits." },
        { img: MostPopular2, title: "Global Talks", desc: "Top news with a global perspective." },
        { img: MostPopular3, title: "Tech Vibes", desc: "Stay updated with the latest in tech." },
      ],
    },
    {
      name: "Comedy",
      data: [
        { img: Comedy1, title: "Laugh Central", desc: "Your daily dose of comedy sketches." },
        { img: Comedy2, title: "Comic Roast", desc: "Stand-up meets satire." },
        { img: Comedy3, title: "Silly Hour", desc: "Hilarious stories and more!" },
      ],
    },
    {
      name: "News",
      data: [
        { img: News1, title: "Morning Brief", desc: "Start your day informed." },
        { img: News2, title: "Headlines Tonight", desc: "Evening news roundup." },
        { img: News3, title: "News 360", desc: "All angles of today’s top stories." },
      ],
    },
    {
      name: "Crime",
      data: [
        { img: Crime1, title: "Dark Files", desc: "True crime, chilling tales." },
        { img: Crime2, title: "Murdered Voices", desc: "Unsolved mysteries revisited." },
        { img: Crime3, title: "Crime Chronicles", desc: "Real events, real suspense." },
      ],
    },
    {
      name: "Sports",
      data: [
        { img: Sports1, title: "Game Day", desc: "All about match-day drama." },
        { img: Sports2, title: "The Final Whistle", desc: "Post-match analysis and opinions." },
        { img: Sports3, title: "Playmaker Talks", desc: "Athletes share their journey." },
      ],
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
    else setIsLoggedIn(true);
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
  };

  const renderContent = () => {
    const pages = {
      dashboard: <Dashboard />,
      upload: <UploadPodcast />,
      search: <SearchPage />,
      favourites: <Favourites />,
    };

    if (pages[page]) {
      return (
        <motion.div
          key={page}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          {pages[page]}
        </motion.div>
      );
    }

    return (
      <motion.div
        key="home"
        variants={slideVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* <h2 className="text-3xl font-bold mb-2">🎧 Explore Top Podcasts</h2> */}
        <h2 className="text-3xl font-bold mb-2">
                  🎧 Welcome to PodStream!
                </h2>
                <p className="text-xl font-italic mb-1 text-gray-900 dark:text-gray-300">
                  Discover top trending podcasts across genres.
                </p>
        {categories.map((cat, idx) => (
          <motion.section
            key={idx}
            className={`rounded-xl p-6 ${darkMode ? "bg-[#1e1e2f] text-white" : "bg-white text-black"} shadow`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{cat.name}</h3>
              <button onClick={() => navigate("/dashboard")} className="text-purple-500 hover:underline text-sm">
                Show All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {cat.data.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className={`rounded-lg p-3 cursor-pointer ${darkMode ? "bg-[#2b2b3d]" : "bg-gray-100"}`}
                  onClick={() => navigate("/dashboard")}
                >
                  <img src={item.img} alt={item.title} className="w-full h-40 object-cover rounded mb-2" />
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </motion.div>
    );
  };

  const linkClass = (path) =>
    `flex items-center gap-2 px-2 py-1 rounded ${location.pathname === path
      ? "bg-purple-500 text-white"
      : "hover:text-purple-500 dark:text-white text-gray-800"
    }`;

  if (isLoggedIn === null) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#0f0f14] text-white" : "bg-gray-100 text-black"}`}>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className={`md:hidden p-4 text-xl fixed top-2 left-2 z-50 ${darkMode ? "text-white" : "text-black"}`}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`w-64 h-screen p-6 flex-col justify-between hidden md:flex md:sticky top-0 ${darkMode ? "bg-[#14141c]" : "bg-white border-r"}`}>
        <div>
          <button onClick={() => navigate("/")} className={`text-2xl font-bold flex items-center mb-8 ${darkMode ? "text-purple-500" : "text-purple-600"}`}>
            <FaMicrophone className="mr-2" /> PODSTREAM
          </button>
          <nav className="flex flex-col gap-4 text-lg">
            <Link to="/dashboard" className={linkClass("/dashboard")}><FaMicrophone /> Dashboard</Link>
            <Link to="/search" className={linkClass("/search")}><FaSearch /> Search</Link>
            <Link to="/favourites" className={linkClass("/favourites")}><FaHeart /> Favourites</Link>
            <Link to="/upload" className={linkClass("/upload")}><FaUpload /> Upload</Link>
            {!isLoggedIn && <Link to="/auth" className={linkClass("/auth") + " mt-4"}><FaSignInAlt /> Login / Sign Up</Link>}
            <button onClick={toggleTheme} className="flex items-center gap-2 hover:text-purple-500 mt-2">
              {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light" : "Dark"} Mode
            </button>
          </nav>
        </div>
        {isLoggedIn && (
          <div className="mt-6 flex items-center gap-2">
            <FaUserCircle className="text-3xl text-purple-400" />
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
              <button onClick={handleLogout} className="text-xs text-red-400 hover:underline">Logout</button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed left-0 top-0 w-64 h-screen p-6 flex flex-col justify-between z-50 md:hidden ${darkMode ? "bg-[#14141c]" : "bg-white border-r"}`}
          >
            <div>
              <button onClick={() => { navigate("/"); setSidebarOpen(false); }} className={`text-2xl font-bold flex items-center mb-8 ${darkMode ? "text-purple-500" : "text-purple-600"}`}>
                <FaMicrophone className="mr-2" /> PODSTREAM
              </button>
              <nav className="flex flex-col gap-4 text-lg">
                <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className={linkClass("/dashboard")}><FaMicrophone /> Dashboard</Link>
                <Link to="/search" onClick={() => setSidebarOpen(false)} className={linkClass("/search")}><FaSearch /> Search</Link>
                <Link to="/favourites" onClick={() => setSidebarOpen(false)} className={linkClass("/favourites")}><FaHeart /> Favourites</Link>
                <Link to="/upload" onClick={() => setSidebarOpen(false)} className={linkClass("/upload")}><FaUpload /> Upload</Link>
                {!isLoggedIn && <Link to="/auth" onClick={() => setSidebarOpen(false)} className={linkClass("/auth") + " mt-4"}><FaSignInAlt /> Login / Sign Up</Link>}
                <button onClick={toggleTheme} className="flex items-center gap-2 hover:text-purple-500 mt-2">
                  {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light" : "Dark"} Mode
                </button>
              </nav>
            </div>
            {isLoggedIn && (
              <div className="mt-6 flex items-center gap-2">
                <FaUserCircle className="text-3xl text-purple-400" />
                <div className="text-sm">
                  <p className="font-semibold">{user.name}</p>
                  <button onClick={handleLogout} className="text-xs text-red-400 hover:underline">Logout</button>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto p-6 md:p-6 pt-16 md:pt-6">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HomeWithLayout;
