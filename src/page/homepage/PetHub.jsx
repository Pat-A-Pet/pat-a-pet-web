import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../component/Footer';
import Navbar from '../../component/Navbar';
import Card from '../../component/card';
import PostCard from '../../component/post';
import { useNavigate } from "react-router-dom";

const MyHub = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);
  const [tabIndicator, setTabIndicator] = useState({ width: 0, left: 0 });
  const tabsRef = useRef([]);
  
  const cardsData = [1, 2, 3, 4, 5, 6];
  const postsData = [1, 2, 3, 4, 5, 6];
  const navigate = useNavigate();  

  // Sample data for my adoption posts
  const myAdoptionPosts = [
    {
      id: 1,
      name: "Bella",
      breed: "Labrador Mix",
      age: "4 months",
      gender: "Female",
      status: "Available",
      views: 42,
      inquiries: 5,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Charlie",
      breed: "Tabby Cat",
      age: "1 year",
      gender: "Male",
      status: "Pending Adoption",
      views: 87,
      inquiries: 12,
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop"
    }
  ];

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
    if (tabsRef.current.length > 0) {
      const activeIndex = activeTab === 'favorites' ? 0 : activeTab === 'posts' ? 1 : 2;
      const tabElement = tabsRef.current[activeIndex];
      if (tabElement) {
        setTabIndicator({
          width: tabElement.offsetWidth,
          left: tabElement.offsetLeft
        });
      }
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

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
                  <h3 className="font-bold text-lg">Alex Johnson</h3>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex relative border-b border-gray-200 pb-1">
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
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
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
                My Adoption Posts ({myAdoptionPosts.length})
              </span>
            </motion.button>
            
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
                      key={index}
                      variants={cardVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <Card />
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
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">My Community Posts</h2>
                  <motion.button 
                    className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Post
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 items-start">
                  {postsData.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <PostCard />
                    </motion.div>
                  ))}
                </div>
                
                {postsData.length === 0 && (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">No posts yet</h3>
                    <p className="mt-1 text-gray-500">Share your pet experiences with the community!</p>
                    <motion.button 
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create First Post
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myAdoptionPosts.map((pet, index) => (
                    <motion.div 
                      key={pet.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                      variants={cardVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <div className="p-5">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <div className="bg-gray-200 border-2 border-dashed w-24 h-24 rounded-xl"></div>
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
                                <p className="font-medium">{pet.views}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Inquiries</p>
                                <p className="font-medium">{pet.inquiries}</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex space-x-3">
                              <motion.button 
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Manage Post
                              </motion.button>
                              <motion.button 
                                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {myAdoptionPosts.length === 0 && (
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
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create First Adoption Post
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Stats Section - Fixed to prevent scrollbar */}
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
                <div className="text-3xl font-bold text-emerald-600">12</div>
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