import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../component/Footer";
import Navbar from "../../component/Navbar";
import Card from "../../component/card";
import PostCard from "../../component/post";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import {
  FaHeart,
  FaBook,
  FaPlusCircle,
  FaQuestionCircle,
  FaUsers,
  FaSearch,
  FaPlus,
  FaUser,
  FaComment,
  FaTrash,
  FaFeatherAlt,
  FaHome,
  FaEdit,
} from "react-icons/fa";

const MyHub = () => {
  const [activeTab, setActiveTab] = useState("favorites");
  const [loading, setLoading] = useState(true);
  const [tabIndicator, setTabIndicator] = useState({ width: 0, left: 0 });
  const tabsRef = useRef([]);
  const [adoptionPosts, setAdoptionPosts] = useState([]);
  const [loadingAdoptions, setLoadingAdoptions] = useState(false);
  const [cardsData, setCardsData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [buyerRequests, setBuyerRequests] = useState({
    requested: [],
    adopted: [],
  });
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -5,
      boxShadow:
        "0 20px 25px -5px rgba(5, 150, 105, 0.1), 0 10px 10px -5px rgba(5, 150, 105, 0.04)",
      transition: { duration: 0.2 },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Calculate tab indicator position
  useEffect(() => {
    const tabMap = {
      favorites: 0,
      posts: 1,
      adoptions: 2,
      requests: 3,
      ownerRequests: 4,
    };

    if (tabsRef.current.length > 0) {
      const activeIndex = tabMap[activeTab];
      const tabElement = tabsRef.current[activeIndex];
      if (tabElement) {
        setTabIndicator({
          width: tabElement.offsetWidth,
          left: tabElement.offsetLeft,
        });
      }
    }

    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Fetch loved pets (favorites)
  useEffect(() => {
    const fetchFav = async () => {
      try {
        const userId = user?.id;
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:5000/api/pets/get-loved-pets/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        console.log("API Response:", response.data); // Add this to debug

        // Check if data is nested differently
        setCardsData(response.data.pets || response.data.data || response.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        console.error("Error response:", err.response?.data); // Add this too
      }
    };

    // if (activeTab === "favorites") {
    fetchFav();
    // }
  }, [user?.id]);

  // Fetch my posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = user?.id;
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:5000/api/posts/get-my-posts/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        setPostsData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    // if (activeTab === "posts") {
    fetchPosts();
    // }
  }, [user?.id]);

  // Fetch adoption posts when tab is active
  useEffect(() => {
    const fetchMyAdoptionPosts = async () => {
      setLoadingAdoptions(true);
      try {
        const userId = user?.id;

        if (!userId) {
          console.error("User ID not available");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/pets/my-adoptions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        setAdoptionPosts(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch adoption posts:",
          error.response?.data || error.message,
        );
      } finally {
        setLoadingAdoptions(false);
      }
    };

    if (user?.id) {
      fetchMyAdoptionPosts();
    }
  }, [user?.id]);

  // Fetch adoption requests for buyer (my requests)
  useEffect(() => {
    const fetchBuyerAdoptionRequests = async () => {
      setLoadingRequests(true);
      try {
        const userId = user?.id;
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:5000/api/pets/get-all-adoptions-buyer/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        setBuyerRequests(response.data);
      } catch (error) {
        console.error("Error fetching buyer adoption requests:", error);
      } finally {
        setLoadingRequests(false);
      }
    };

    // if (activeTab === "requests") {
    fetchBuyerAdoptionRequests();
    // }
  }, [user?.id]);

  // Fetch adoption requests for owner (requests for my pets)
  useEffect(() => {
    const fetchOwnerAdoptionRequests = async () => {
      setLoadingRequests(true);
      try {
        const userId = user?.id;
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:5000/api/pets/get-adoption-requests-for-owner/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        setOwnerRequests(response.data);
      } catch (error) {
        console.error("Error fetching owner adoption requests:", error);
      } finally {
        setLoadingRequests(false);
      }
    };

    // if (activeTab === "ownerRequests") {
    fetchOwnerAdoptionRequests();
    // }
  }, [user?.id]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/posts/delete-post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );
      setPostsData((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error.response?.data || error.message,
      );
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleDeleteAdoption = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this adoption post?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/pets/delete-listing/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );
      setAdoptionPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(
        "Failed to delete adoption post:",
        error.response?.data || error.message,
      );
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleCancelRequest = async (petId) => {
    if (
      !window.confirm("Are you sure you want to cancel this adoption request?")
    )
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/pets/cancel-request-adoption/${petId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: { userId: user?.id },
        },
      );

      // Update state to remove the canceled request
      setBuyerRequests((prev) => ({
        ...prev,
        requested: prev.requested.filter((pet) => pet._id !== petId),
      }));
    } catch (error) {
      console.error(
        "Failed to cancel adoption request:",
        error.response?.data || error.message,
      );
      alert("Failed to cancel request. Please try again.");
    }
  };

  // Handle adoption request response (approve/reject)
  const handleRequestResponse = async (petId, requestId, action) => {
    if (
      !window.confirm(
        `Are you sure you want to ${action} this adoption request?`,
      )
    )
      return;

    try {
      await axios.patch(
        `http://localhost:5000/api/pets/update-request-status/${petId}/${requestId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Update state to reflect the change
      setOwnerRequests((prev) =>
        prev.map((pet) => {
          if (pet._id === petId) {
            const updatedRequests = pet.adoptionRequests.map((req) => {
              if (req._id === requestId) {
                return {
                  ...req,
                  status: action === "approve" ? "approved" : "rejected",
                };
              }
              return req;
            });
            return { ...pet, adoptionRequests: updatedRequests };
          }
          return pet;
        }),
      );

      // If approved, update the pet status to adopted
      if (action === "approve") {
        setAdoptionPosts((prev) =>
          prev.map((pet) =>
            pet._id === petId ? { ...pet, status: "Adopted" } : pet,
          ),
        );
      }
    } catch (error) {
      console.error(
        "Failed to update request status:",
        error.response?.data || error.message,
      );
      alert("Failed to update request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </motion.div>
          <motion.h1
            className="mt-6 text-2xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading Your Pet Hub
          </motion.h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Navbar />

        {/* Enhanced Header */}
        <header className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-16 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  My Pet Hub
                </motion.h1>
                <motion.p
                  className="mt-3 text-xl text-white/90 max-w-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your central place to manage pets, community posts, and
                  adoption activities
                </motion.p>
              </div>
              <motion.div
                className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="relative"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </motion.div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-white">
                    {user.fullname}
                  </h3>
                  <motion.button
                    className="mt-3 text-sm bg-white text-emerald-600 px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit Profile
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* Enhanced Tabs Navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex relative border-b border-gray-200 overflow-hidden">
              <div className="flex space-x-1">
                {[
                  {
                    id: "favorites",
                    label: "Favorite Pets",
                    icon: <FaHeart />,
                    count: cardsData.length,
                  },
                  {
                    id: "posts",
                    label: "My Posts",
                    icon: <FaBook />,
                    count: postsData.length,
                  },
                  {
                    id: "adoptions",
                    label: "Adoption Posts",
                    icon: <FaPlusCircle />,
                    count: adoptionPosts.length,
                  },
                  {
                    id: "requests",
                    label: "My Requests",
                    icon: <FaQuestionCircle />,
                    count: buyerRequests.requested.length,
                  },
                  {
                    id: "ownerRequests",
                    label: "Requests Received",
                    icon: <FaUser />,
                    count: ownerRequests.length,
                  },
                ].map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    ref={(el) => (tabsRef.current[index] = el)}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-medium text-lg whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "text-emerald-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex gap-4 items-center">
                      {tab.icon}
                      {tab.label} ({tab.count})
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Animated tab indicator */}
              <motion.div
                className="absolute bottom-0 h-1 bg-emerald-500 rounded-full"
                initial={false}
                animate={{
                  width: tabIndicator.width,
                  left: tabIndicator.left,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <motion.div
                key="favorites"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      Pets I Want to Adopt
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Your saved pets for potential adoption
                    </p>
                  </div>
                  <motion.button
                    onClick={() => navigate("/listing")}
                    className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaSearch icon="search" className="mr-2" />
                    Browse More Pets
                  </motion.button>
                </div>

                {cardsData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cardsData.map((item, index) => (
                      <motion.div
                        key={item._id || index}
                        variants={cardVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card pet={item} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                      <FaHeart
                        icon="heart"
                        className="text-emerald-500 text-3xl"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      No favorite pets yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Start browsing pets to add to your favorites and find your
                      perfect companion!
                    </p>
                    <motion.button
                      onClick={() => navigate("/listing")}
                      className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-md transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSearch icon="search" className="mr-2" />
                      Browse Pets
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* My Posts Tab */}
            {activeTab === "posts" && (
              <motion.div
                key="posts"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      My Community Posts
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Share your pet experiences with fellow pet lovers
                    </p>
                  </div>
                  <motion.button
                    onClick={() => navigate("/createpost")}
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center">
                      <FaPlus icon="plus" className="h-5 w-5 mr-2" />
                      New Post
                    </div>
                  </motion.button>
                </div>

                {postsData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {postsData.map((post, index) => (
                      <motion.div
                        key={post._id}
                        variants={cardVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Post Images Carousel */}
                        {post.imageUrls?.length > 0 && (
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={post.imageUrls[0]}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {post.imageUrls.length > 1 && (
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {post.imageUrls.map((_, idx) => (
                                  <button
                                    key={idx}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                      idx === 0 ? "bg-white" : "bg-white/50"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                              {post.user?.profilePicture ? (
                                <img
                                  src={post.user.profilePicture}
                                  alt="Profile"
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <FaUser
                                  icon="user"
                                  className="text-emerald-500 text-xl"
                                />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {post.user?.fullname || "Anonymous"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.description}
                          </p>

                          {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {post.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex space-x-4">
                              <div className="flex items-center text-gray-500">
                                <FaHeart
                                  icon="heart"
                                  className="mr-2 text-red-400"
                                />
                                <span>{post.loves?.length || 0}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <FaComment
                                  icon="comment"
                                  className="mr-2 text-blue-400"
                                />
                                <span>{post.comments?.length || 0}</span>
                              </div>
                            </div>
                            <motion.button
                              onClick={() => handleDeletePost(post._id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaTrash icon="trash" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl border-2 border-dashed border-emerald-300 mb-6">
                      <FaFeatherAlt
                        icon="feather"
                        className="text-emerald-500 text-3xl"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      No posts yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Share your pet stories and connect with fellow pet lovers
                      in the community!
                    </p>
                    <motion.button
                      onClick={() => navigate("/createpost")}
                      className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlus icon="plus" className="mr-2" />
                      Create Your First Post
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* My Adoption Posts Tab */}
            {activeTab === "adoptions" && (
              <motion.div
                key="adoptions"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Pets I'm Helping Find Homes
                  </h2>
                  <motion.button
                    onClick={() => navigate("/createadopt")}
                    className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    New Adoption Post
                  </motion.button>
                </div>

                {loadingAdoptions ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Loading your adoption posts...
                    </p>
                  </div>
                ) : adoptionPosts.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">
                      No adoption posts yet
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Help pets find their forever homes by creating adoption
                      posts
                    </p>
                    <motion.button
                      onClick={() => navigate("/createadopt")}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create First Adoption Post
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adoptionPosts.map((pet, index) => (
                      <motion.div
                        key={pet._id}
                        variants={cardVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                      >
                        <div className="p-5">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              {pet.imageUrls && pet.imageUrls.length > 0 ? (
                                <img
                                  src={pet.imageUrls[0]}
                                  alt={pet.name}
                                  className="w-24 h-24 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24" />
                              )}
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800">
                                    {pet.name}
                                  </h3>
                                  <p className="text-gray-600">{pet.breed}</p>
                                </div>
                                <motion.span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    pet.status === "available"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {pet.status === "available"
                                    ? "Available"
                                    : "Adopted"}
                                </motion.span>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Age</p>
                                  <p className="font-medium">{pet.age} years</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Gender
                                  </p>
                                  <p className="font-medium">{pet.gender}</p>
                                </div>
                                {/* <div> */}
                                {/*   <p className="text-sm text-gray-500">Views</p> */}
                                {/*   <p className="font-medium"> */}
                                {/*     {pet.views || 0} */}
                                {/*   </p> */}
                                {/* </div> */}
                                {/* <div> */}
                                {/*   <p className="text-sm text-gray-500"> */}
                                {/*     Inquiries */}
                                {/*   </p> */}
                                {/*   <p className="font-medium"> */}
                                {/*     {pet.inquiries || 0} */}
                                {/*   </p> */}
                                {/* </div> */}
                              </div>

                              <div className="mt-4 flex space-x-3">
                                <motion.button
                                  onClick={() =>
                                    navigate(`/editadopt/${pet._id}`)
                                  }
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Manage Post
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDeleteAdoption(pet._id)}
                                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-red-100 text-red-500 rounded-lg transition"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* My Adoption Requests Tab (as a buyer) */}
            {activeTab === "requests" && (
              <motion.div
                key="requests"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  My Adoption Requests
                </h2>

                {loadingRequests ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Loading your adoption requests...
                    </p>
                  </div>
                ) : buyerRequests.requested.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">
                      No adoption requests yet
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Start browsing pets to find your new companion!
                    </p>
                    <motion.button
                      onClick={() => navigate("/listing")}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Browse Pets
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {buyerRequests.requested.map((pet, index) => (
                      <motion.div
                        key={pet._id}
                        variants={cardVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                      >
                        <div className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start">
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                              {pet.imageUrls && pet.imageUrls.length > 0 ? (
                                <img
                                  src={pet.imageUrls[0]}
                                  alt={pet.name}
                                  className="w-32 h-32 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800">
                                    {pet.name}
                                  </h3>
                                  <p className="text-gray-600">{pet.breed}</p>
                                </div>
                                <motion.span
                                  className={`px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
                                    pet.userRequest?.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : pet.userRequest?.status === "accepted"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {pet.userRequest?.status || "pending"}
                                </motion.span>
                              </div>

                              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Age</p>
                                  <p className="font-medium">{pet.age}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Gender
                                  </p>
                                  <p className="font-medium">{pet.gender}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Owner</p>
                                  <p className="font-medium">
                                    {pet.owner?.fullname || "Unknown"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Date Requested
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      pet.userRequest?.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {/* <div className="mt-4">
                                <p className="text-sm text-gray-500">Your Message</p>
                                <p className="font-medium bg-gray-50 p-3 rounded-lg mt-1">
                                  {pet.userRequest?.message || 'No message provided'}
                                </p>
                              </div> */}

                              <div className="mt-6 flex justify-end">
                                {pet.userRequest?.status === "pending" && (
                                  <motion.button
                                    onClick={() => handleCancelRequest(pet._id)}
                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Cancel Request
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Adoption Requests Tab (as an owner) */}
            {activeTab === "ownerRequests" && (
              <motion.div
                key="ownerRequests"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  Adoption Requests for My Pets
                </h2>
                <p className="text-gray-600 mb-6">
                  Review and manage adoption requests for your pets
                </p>

                {loadingRequests ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Loading adoption requests...
                    </p>
                  </div>
                ) : ownerRequests.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">
                      No adoption requests yet
                    </h3>
                    <p className="mt-1 text-gray-500">
                      You'll see adoption requests here when people apply to
                      adopt your pets
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    {ownerRequests.map((pet, index) => (
                      <motion.div
                        key={pet._id}
                        variants={cardVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                              {pet.imageUrls && pet.imageUrls.length > 0 ? (
                                <img
                                  src={pet.imageUrls[0]}
                                  alt={pet.name}
                                  className="w-32 h-32 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800">
                                    {pet.name}
                                  </h3>
                                  <p className="text-gray-600">
                                    {pet.breed} • {pet.age} years
                                  </p>
                                </div>
                                <motion.span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    pet.status === "Available"
                                      ? "bg-green-100 text-green-800"
                                      : pet.status === "Adopted"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {pet.status === "available"
                                    ? "Available"
                                    : "Adopted"}
                                </motion.span>
                              </div>

                              <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                  Adoption Requests (
                                  {pet.adoptionRequests.length})
                                </h4>

                                <div className="space-y-4">
                                  {pet.adoptionRequests.map(
                                    (request, reqIndex) => (
                                      <div
                                        key={reqIndex}
                                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                      >
                                        <div className="flex items-center mb-3">
                                          <div className="flex-shrink-0">
                                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
                                          </div>
                                          <div className="ml-3">
                                            <h5 className="font-medium text-gray-900">
                                              {request.user.fullname}
                                            </h5>
                                            <p className="text-sm text-gray-500">
                                              Applied on{" "}
                                              {new Date(
                                                request.createdAt,
                                              ).toLocaleDateString()}
                                            </p>
                                          </div>
                                        </div>

                                        {/* <div className="mb-4">
                                        <p className="text-sm text-gray-500">Message:</p>
                                        <p className="font-medium bg-white p-3 rounded-lg mt-1 border border-gray-200">
                                          {request.message || "No message provided"}
                                        </p>
                                      </div> */}

                                        <div className="flex items-center justify-between">
                                          <motion.span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                              request.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : request.status === "accepted"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-red-100 text-red-800"
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                          >
                                            {request.status === "pending"
                                              ? "Pending"
                                              : request.status === "rejected"
                                                ? "Rejected"
                                                : "Accepted"}
                                          </motion.span>

                                          {request.status === "pending" && (
                                            <div className="flex space-x-2">
                                              <motion.button
                                                onClick={() =>
                                                  handleRequestResponse(
                                                    pet._id,
                                                    request._id,
                                                    "approve",
                                                  )
                                                }
                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                              >
                                                Approve
                                              </motion.button>
                                              <motion.button
                                                onClick={() =>
                                                  handleRequestResponse(
                                                    pet._id,
                                                    request._id,
                                                    "reject",
                                                  )
                                                }
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                              >
                                                Reject
                                              </motion.button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Enhanced Stats Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              My Pet Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
              {[
                {
                  value: cardsData.length,
                  label: "Pets Saved",
                  icon: <FaHeart />,
                },
                {
                  value: postsData.length,
                  label: "Community Posts",
                  icon: <FaBook />,
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
                  variants={statVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 mx-auto">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-lg text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default MyHub;
