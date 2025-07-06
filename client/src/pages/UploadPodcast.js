import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FaMicrophoneAlt, FaCloudUploadAlt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import WaveSurfer from "wavesurfer.js";
import axiosInstance from "../utils/axiosInstance";

const UploadPodcast = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: null,
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const waveformRef = useRef(null);
  const waveContainer = useRef(null);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith("audio") && !file.type.startsWith("video")) {
      toast.error("Only audio or video files allowed.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size exceeds 50MB limit.");
      return;
    }

    setFormData((prev) => ({ ...prev, media: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "audio/*": [],
      "video/*": [],
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.media || !formData.title || !formData.description) {
      toast.error("All fields are required.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("media", formData.media);

    try {
      setUploading(true);
      // await axiosInstance.post("/podcasts/upload", data, {
      await axiosInstance.post("/api/podcasts/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Podcast uploaded successfully!");
      setFormData({ title: "", description: "", media: null });
      setPreviewUrl(null);
      if (waveformRef.current) {
        waveformRef.current.destroy();
        waveformRef.current = null;
      }
    // } catch (error) {
    //   console.error("Upload error:", error);
    //   toast.error(error.response?.data?.message || "Upload failed.");
    // } finally {
    //   setUploading(false);
    // }
     }catch (error) {
        console.error("Upload error:", error);
        let errorMessage = "Upload failed.";

        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = "Endpoint not found - please contact support";
          } else {
            errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          }
        } else if (error.request) {
          errorMessage = "No response from server - check your connection";
        }

        toast.error(errorMessage);
      } finally {
        setUploading(false);
      }
    };

    useEffect(() => {
      if (
        previewUrl &&
        formData.media &&
        formData.media.type.startsWith("audio")
      ) {
        if (waveformRef.current) waveformRef.current.destroy();

        const wavesurfer = WaveSurfer.create({
          container: waveContainer.current,
          waveColor: "#888",
          progressColor: "#6b46c1",
          height: 60,
          responsive: true,
        });

        waveformRef.current = wavesurfer;
        wavesurfer.load(previewUrl);
      }

      return () => {
        if (waveformRef.current) {
          waveformRef.current.destroy();
          waveformRef.current = null;
        }
      };
    }, [previewUrl, formData.media]);

    return (
      <div className={`p-6 sm:p-10 rounded-xl shadow-xl w-full max-w-3xl mx-auto min-h-screen transition-colors ${darkMode ? "bg-[#1e1e2f] text-white" : "bg-white text-black"}`}>
        <div className="flex items-center gap-2 text-purple-500 text-2xl font-bold mb-8">
          <FaMicrophoneAlt />
          <span>Upload a New Podcast</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              className={`w-full p-3 rounded-lg border placeholder-gray-400 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter podcast title"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows="4"
              className={`w-full p-3 rounded-lg border placeholder-gray-400 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your podcast episode"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Media File</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive
                  ? "border-purple-500 bg-purple-100 text-purple-700"
                  : darkMode
                    ? "border-gray-500 bg-gray-800 text-white"
                    : "border-gray-400 bg-white text-black"
                }`}
            >
              <input {...getInputProps()} />
              {formData.media ? (
                <p className="text-sm">{formData.media.name}</p>
              ) : (
                <p className="text-sm">Drag and drop your audio/video file here, or click to select</p>
              )}
            </div>
          </div>

          {formData.media && previewUrl && formData.media.type.startsWith("audio") && (
            <div id="waveform" ref={waveContainer} className="mt-4" />
          )}

          {formData.media && previewUrl && formData.media.type.startsWith("video") && (
            <video
              controls
              src={previewUrl}
              className="w-full mt-4 rounded-md max-h-64"
            />
          )}

          <button
            type="submit"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition font-semibold disabled:opacity-50"
            disabled={uploading}
          >
            <FaCloudUploadAlt />
            {uploading ? "Uploading..." : "Upload Podcast"}
          </button>
        </form>
      </div>
    );
  };

  export default UploadPodcast;
