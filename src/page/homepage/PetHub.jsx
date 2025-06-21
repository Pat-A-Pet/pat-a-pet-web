import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../component/Footer';
import Navbar from '../../component/Navbar';
import Card from '../../component/card';
import PostCard from '../../component/post';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

const MyHub = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);
  const [tabIndicator, setTabIndicator] = useState({ width: 0, left: 0 });
  const tabsRef = useRef([]);
  const [adoptionPosts, setAdoptionPosts] = useState([]);
  const [loadingAdoptions, setLoadingAdoptions] = useState(false);
  const [cardsData, setCardsData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [buyerRequests, setBuyerRequests] = useState({ requested: [], adopted: [] });
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
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(5, 150, 105, 0.1), 0 10px 10px -5px rgba(5, 150, 105, 0.04)",
      transition: { duration: 0.2 }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Calculate tab indicator position
  useEffect(() => {
    const tabMap = {
      'favorites': 0,
      'posts': 1,
      'adoptions': 2,
      'requests': 3,
      'ownerRequests': 4
    };
    
    if (tabsRef.current.length > 0) {
      const activeIndex = tabMap[activeTab];
      const tabElement = tabsRef.current[activeIndex];
      if (tabElement) {
        setTabIndicator({
          width: tabElement.offsetWidth,
          left: tabElement.offsetLeft
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
    const userId = user?.user?._id;
    if (!userId) return;

    const response = await axios.get(`http://localhost:5000/api/pets/get-loved-pets/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('API Response:', response.data); // Add this to debug
    
    // Check if data is nested differently
    setCardsData(response.data.pets || response.data.data || response.data);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    console.error('Error response:', err.response?.data); // Add this too
  }
};

    if (activeTab === 'favorites') {
      fetchFav();
    }
  }, [activeTab, user?.user?._id]);

  // Fetch my posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = user?.user?._id;
        if (!userId) return;

        const response = await axios.get(`http://localhost:5000/api/posts/get-my-posts/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        setPostsData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab, user?.user?._id]);

  // Fetch adoption posts when tab is active
  useEffect(() => {
    const fetchMyAdoptionPosts = async () => {
      setLoadingAdoptions(true);
      try {
        const userId = user?.user?._id;
        
        if (!userId) {
          console.error("User ID not available");
          return;
        }
        
        const response = await axios.get(
          `http://localhost:5000/api/pets/my-adoptions/${userId}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setAdoptionPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch adoption posts:", error.response?.data || error.message);
      } finally {
        setLoadingAdoptions(false);
      }
    };

    if (user?.user?._id && activeTab === 'adoptions') {
      fetchMyAdoptionPosts();
    }
  }, [activeTab, user?.user?._id]);

  // Fetch adoption requests for buyer (my requests)
  useEffect(() => {
    const fetchBuyerAdoptionRequests = async () => {
      setLoadingRequests(true);
      try {
        const userId = user?.user?._id;
        if (!userId) return;
        
        const response = await axios.get(
          `http://localhost:5000/api/pets/get-all-adoptions-buyer/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setBuyerRequests(response.data);
      } catch (error) {
        console.error("Error fetching buyer adoption requests:", error);
      } finally {
        setLoadingRequests(false);
      }
    };
    
    if (activeTab === 'requests') {
      fetchBuyerAdoptionRequests();
    }
  }, [activeTab, user?.user?._id]);

  // Fetch adoption requests for owner (requests for my pets)
  useEffect(() => {
    const fetchOwnerAdoptionRequests = async () => {
      setLoadingRequests(true);
      try {
        const userId = user?.user?._id;
        if (!userId) return;
        
        const response = await axios.get(
          `http://localhost:5000/api/pets/get-adoption-requests-for-owner/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setOwnerRequests(response.data);
      } catch (error) {
        console.error("Error fetching owner adoption requests:", error);
      } finally {
        setLoadingRequests(false);
      }
    };
    
    if (activeTab === 'ownerRequests') {
      fetchOwnerAdoptionRequests();
    }
  }, [activeTab, user?.user?._id]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/posts/delete-post/${postId}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setPostsData(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error.response?.data || error.message);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleDeleteAdoption = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this adoption post?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/pets/delete-listing/${postId}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setAdoptionPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete adoption post:", error.response?.data || error.message);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleCancelRequest = async (petId) => {
    if (!window.confirm("Are you sure you want to cancel this adoption request?")) return;
    
    try {
      await axios.delete(
        `http://localhost:5000/api/pets/cancel-request-adoption/${petId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          data: { userId: user.user._id }
        }
      );
      
      // Update state to remove the canceled request
      setBuyerRequests(prev => ({
        ...prev,
        requested: prev.requested.filter(pet => pet._id !== petId)
      }));
    } catch (error) {
      console.error("Failed to cancel adoption request:", error.response?.data || error.message);
      alert("Failed to cancel request. Please try again.");
    }
  };

  // Handle adoption request response (approve/reject)
  const handleRequestResponse = async (petId, requestId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this adoption request?`)) return;
    
    try {
      await axios.patch(
        `http://localhost:5000/api/pets/update-request-status/${petId}/${requestId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update state to reflect the change
      setOwnerRequests(prev => 
        prev.map(pet => {
          if (pet._id === petId) {
            const updatedRequests = pet.adoptionRequests.map(req => {
              if (req._id === requestId) {
                return { ...req, status: action === 'approve' ? 'approved' : 'rejected' };
              }
              return req;
            });
            return { ...pet, adoptionRequests: updatedRequests };
          }
          return pet;
        })
      );
      
      // If approved, update the pet status to adopted
      if (action === 'approve') {
        setAdoptionPosts(prev => 
          prev.map(pet => 
            pet._id === petId ? { ...pet, status: 'Adopted' } : pet
          )
        );
      }
    } catch (error) {
      console.error("Failed to update request status:", error.response?.data || error.message);
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
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <Navbar/>
        
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-500 to-green-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 md:mb-0">
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  My Pet Hub
                </motion.h1>
                <motion.p 
                  className="mt-3 text-xl text-emerald-100 max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Manage your favorite pets, community posts, and adoption listings in one place
                </motion.p>
              </div>
              <motion.div 
                className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl p-4"
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
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </motion.div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">{user.user.fullname}</h3>
                  <p className="text-emerald-100">Pet Lover since 2022</p>
                  <motion.button 
                    className="mt-2 text-sm bg-white text-emerald-600 px-3 py-1 rounded-full font-medium"
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

        {/* Tabs Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex relative border-b border-gray-200 pb-1 overflow-x-auto">
            <div className="flex space-x-4">
              <motion.button
                ref={el => tabsRef.current[0] = el}
                onClick={() => setActiveTab('favorites')}
                className={`px-6 py-4 font-medium text-lg whitespace-nowrap ${
                  activeTab === 'favorites' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" clipRule="evenodd" />
                  </svg>
                  Favorite Pets ({cardsData.length})
                </span>
              </motion.button>
              
              <motion.button
                ref={el => tabsRef.current[1] = el}
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-4 font-medium text-lg whitespace-nowrap ${
                  activeTab === 'posts' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  My Posts ({postsData.length})
                </span>
              </motion.button>
              
              <motion.button
                ref={el => tabsRef.current[2] = el}
                onClick={() => setActiveTab('adoptions')}
                className={`px-6 py-4 font-medium text-lg whitespace-nowrap ${
                  activeTab === 'adoptions' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  My Adoption Posts ({adoptionPosts.length})
                </span>
              </motion.button>
              
              {/* My Adoption Requests Tab (as a buyer) */}
              <motion.button
                ref={el => tabsRef.current[3] = el}
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-4 font-medium text-lg whitespace-nowrap ${
                  activeTab === 'requests' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  My Adoption Requests ({buyerRequests.requested.length})
                </span>
              </motion.button>
              
              {/* Adoption Requests Tab (as an owner) */}
              <motion.button
                ref={el => tabsRef.current[4] = el}
                onClick={() => setActiveTab('ownerRequests')}
                className={`px-6 py-4 font-medium text-lg whitespace-nowrap ${
                  activeTab === 'ownerRequests' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Adoption Requests ({ownerRequests.length})
                </span>
              </motion.button>
            </div>
            
            {/* Animated tab indicator */}
            <motion.div 
              className="absolute bottom-0 h-1 bg-emerald-500 rounded-full"
              initial={false}
              animate={{
                width: tabIndicator.width,
                left: tabIndicator.left
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <motion.div
                key="favorites"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800">Pets I Want to Adopt</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cardsData.map((item, index) => (
                    <motion.div
                      key={item._id || index}
                      variants={cardVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <Card pet={item} /> 
                    </motion.div>
                  ))}
                </div>
                
                {cardsData.length === 0 && (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">No favorite pets yet</h3>
                    <p className="mt-1 text-gray-500">Start browsing pets to add to your favorites!</p>
                    <motion.button 
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Browse Pets
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* My Posts Tab */}
            {activeTab === 'posts' && (
              <motion.div
                key="posts"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      My Community Posts
                    </h2>
                    <p className="text-gray-600 mt-1">Share your pet experiences with fellow pet lovers</p>
                  </div>
                  <motion.button
                    onClick={() => navigate("/createpost")}
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      New Post
                    </div>
                  </motion.button>
                </div>
                
                {/* Posts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      {post.imageUrls && post.imageUrls.length > 0 && (
                        <div className="p-4 pb-0">
                          <div className="relative overflow-hidden rounded-xl bg-gray-100">
                            <div 
                              className="flex transition-transform duration-300 ease-in-out"
                              style={{ transform: `translateX(-${(currentImageIndex[post._id] || 0) * 100}%)` }}
                            >
                              {post.imageUrls.map((imageUrl, imgIndex) => (
                                <div key={imgIndex} className="w-full flex-shrink-0">
                                  <img
                                    src={imageUrl}
                                    alt={`${post.title} ${imgIndex + 1}`}
                                    className="w-full h-48 object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                            
                            {/* Navigation Dots */}
                            {post.imageUrls.length > 1 && (
                              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {post.imageUrls.map((_, dotIndex) => (
                                  <button
                                    key={dotIndex}
                                    onClick={() => setCurrentImageIndex(prev => ({
                                      ...prev,
                                      [post._id]: dotIndex
                                    }))}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                      (currentImageIndex[post._id] || 0) === dotIndex 
                                        ? 'bg-white shadow-md' 
                                        : 'bg-white/60 hover:bg-white/80'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            
                            {/* Navigation Arrows */}
                            {post.imageUrls.length > 1 && (
                              <>
                                <button
                                  onClick={() => setCurrentImageIndex(prev => ({
                                    ...prev,
                                    [post._id]: ((prev[post._id] || 0) - 1 + post.imageUrls.length) % post.imageUrls.length
                                  }))}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setCurrentImageIndex(prev => ({
                                    ...prev,
                                    [post._id]: ((prev[post._id] || 0) + 1) % post.imageUrls.length
                                  }))}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </>
                            )}
                            
                            {/* Image Counter */}
                            {post.imageUrls.length > 1 && (
                              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                {(currentImageIndex[post._id] || 0) + 1}/{post.imageUrls.length}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4">
                        {/* Post Header with User Info */}
                        <div className="flex items-center mb-4">
                          <div className="relative">
                            <img 
                              src={post.user?.profilePicture || "https://via.placeholder.com/48"} 
                              alt="User"
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">{post.user?.fullname || "Anonymous"}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(post.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })} • {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                        
                        {/* Post Content */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">{post.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line line-clamp-3">{post.description}</p>
                          
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {post.tags.map((tag, i) => (
                                <span 
                                  key={i}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 hover:border-emerald-300 transition-colors cursor-pointer"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Post Stats */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center text-gray-600">
                              <div className="p-2 bg-red-100 rounded-full mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </div>
                              <span className="font-medium">{post.likes?.length || 0}</span>
                              <span className="text-sm ml-1">likes</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <div className="p-2 bg-blue-100 rounded-full mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <span className="font-medium">{post.comments?.length || 0}</span>
                              <span className="text-sm ml-1">comments</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <div className="flex justify-end">
                          <motion.button 
                            onClick={() => handleDeletePost(post._id)}
                            className="group relative px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl font-medium transition-all duration-200 border border-red-200 hover:border-red-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Post
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Empty State */}
                {postsData.length === 0 && (
                  <motion.div 
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="relative mx-auto w-24 h-24 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl border-2 border-dashed border-emerald-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Ready to share your pet stories? Create your first post and connect with fellow pet enthusiasts!</p>
                    <motion.button 
                      onClick={() => navigate("/createpost")}
                      className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Your First Post
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* My Adoption Posts Tab */}
            {activeTab === 'adoptions' && (
              <motion.div
                key="adoptions"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Pets I'm Helping Find Homes</h2>
                  <motion.button
                    onClick={() => navigate("/createadopt")}
                    className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Adoption Post
                  </motion.button>
                </div>
                
                {loadingAdoptions ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your adoption posts...</p>
                  </div>
                ) : adoptionPosts.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">No adoption posts yet</h3>
                    <p className="mt-1 text-gray-500">Help pets find their forever homes by creating adoption posts</p>
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
                                  <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                                  <p className="text-gray-600">{pet.breed}</p>
                                </div>
                                <motion.span 
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    pet.status === 'Available' 
                                      ? 'bg-green-100 text-green-800' 
                                      : pet.status === 'Adopted'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {pet.status}
                                </motion.span>
                              </div>
                              
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Age</p>
                                  <p className="font-medium">{pet.age}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Gender</p>
                                  <p className="font-medium">{pet.gender}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Views</p>
                                  <p className="font-medium">{pet.views || 0}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Inquiries</p>
                                  <p className="font-medium">{pet.inquiries || 0}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex space-x-3">
                                <motion.button
                                  onClick={() => navigate(`/editadopt/${pet._id}`)}
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
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            {activeTab === 'requests' && (
              <motion.div
                key="requests"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800">My Adoption Requests</h2>
                
                {loadingRequests ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your adoption requests...</p>
                  </div>
                ) : buyerRequests.requested.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">No adoption requests yet</h3>
                    <p className="mt-1 text-gray-500">Start browsing pets to find your new companion!</p>
                    <motion.button 
                      onClick={() => navigate("/adopt")}
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
                                  <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                                  <p className="text-gray-600">{pet.breed}</p>
                                </div>
                                <motion.span 
                                  className={`px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
                                    pet.userRequest?.status === 'pending' 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : pet.userRequest?.status === 'accepted'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {pet.userRequest?.status || 'pending'}
                                </motion.span>
                              </div>
                              
                              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Age</p>
                                  <p className="font-medium">{pet.age}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Gender</p>
                                  <p className="font-medium">{pet.gender}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Owner</p>
                                  <p className="font-medium">{pet.owner?.fullname || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Date Requested</p>
                                  <p className="font-medium">
                                    {new Date(pet.userRequest?.createdAt).toLocaleDateString()}
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
                                {pet.userRequest?.status === 'pending' && (
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
            {activeTab === 'ownerRequests' && (
              <motion.div
                key="ownerRequests"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800">Adoption Requests for My Pets</h2>
                <p className="text-gray-600 mb-6">Review and manage adoption requests for your pets</p>
                
                {loadingRequests ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading adoption requests...</p>
                  </div>
                ) : ownerRequests.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">No adoption requests yet</h3>
                    <p className="mt-1 text-gray-500">You'll see adoption requests here when people apply to adopt your pets</p>
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
                                  <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                                  <p className="text-gray-600">{pet.breed} • {pet.age}</p>
                                </div>
                                <motion.span 
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    pet.status === 'Available' 
                                      ? 'bg-green-100 text-green-800' 
                                      : pet.status === 'Adopted'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {pet.status}
                                </motion.span>
                              </div>
                              
                              <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Adoption Requests ({pet.adoptionRequests.length})</h4>
                                
                                <div className="space-y-4">
                                  {pet.adoptionRequests.map((request, reqIndex) => (
                                    <div 
                                      key={reqIndex}
                                      className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                      <div className="flex items-center mb-3">
                                        <div className="flex-shrink-0">
                                          <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
                                        </div>
                                        <div className="ml-3">
                                          <h5 className="font-medium text-gray-900">{request.user.fullname}</h5>
                                          <p className="text-sm text-gray-500">
                                            Applied on {new Date(request.createdAt).toLocaleDateString()}
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
                                            request.status === 'pending' 
                                              ? 'bg-yellow-100 text-yellow-800' 
                                              : request.status === 'approved'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                        >
                                          {request.status}
                                        </motion.span>
                                        
                                        {request.status === 'pending' && (
                                          <div className="flex space-x-2">
                                            <motion.button
                                              onClick={() => handleRequestResponse(pet._id, request._id, 'approve')}
                                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm"
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                            >
                                              Approve
                                            </motion.button>
                                            <motion.button
                                              onClick={() => handleRequestResponse(pet._id, request._id, 'reject')}
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
                                  ))}
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

        {/* Stats Section */}
        <section className="bg-emerald-50 py-12 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">My Pet Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="bg-white rounded-xl p-6 text-center shadow-sm overflow-hidden"
                variants={statVariants}
                custom={0}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold text-emerald-600">{cardsData.length}</div>
                <p className="mt-2 text-gray-600">Pets Saved</p>
              </motion.div>
              <motion.div 
                className="bg-white rounded-xl p-6 text-center shadow-sm overflow-hidden"
                variants={statVariants}
                custom={1}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold text-emerald-600">{postsData.length}</div>
                <p className="mt-2 text-gray-600">Community Posts</p>
              </motion.div>
              <motion.div 
                className="bg-white rounded-xl p-6 text-center shadow-sm overflow-hidden"
                variants={statVariants}
                custom={2}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold text-emerald-600">{adoptionPosts.length}</div>
                <p className="mt-2 text-gray-600">Pets Helped Find Homes</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer/>
      </div>
    </>
  );
};

export default MyHub;