import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiImage, FiTag, FiMapPin, FiDollarSign, FiInfo, FiHeart, FiCalendar, FiX, FiCheck, FiEdit, FiTrash2 } from "react-icons/fi";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";

const EditAdoption = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "",
    size: "",
    color: "",
    weight: "",
    vaccinated: false,
    neutered: false,
    microchipped: false,
    description: "",
    traits: [],
    currentTrait: "",
    medicalHistory: "",
    adoptionFee: "",
    location: "",
    images: []
  });
  
  const fileInputRef = useRef(null);
  const MAX_STEPS = 3;
  const progressPercentage = (step / MAX_STEPS) * 100;

  // Simulate loading existing data
  useEffect(() => {
    // In a real app, this would come from an API
    setIsUploading(true);
    setTimeout(() => {
      setOriginalData({
        id: "post-123",
        createdAt: "2025-05-15",
        views: 124,
        inquiries: 8
      });
      
      setFormData({
        name: "Max",
        breed: "German Shepherd",
        age: "3 years",
        gender: "Male",
        size: "Large",
        color: "Black & Tan",
        weight: "28 kg",
        vaccinated: true,
        neutered: true,
        microchipped: true,
        description: "Max is a loyal, intelligent, and energetic German Shepherd looking for his forever home. He's well-trained, great with families, and loves outdoor activities. Max would thrive in an active household where he can get plenty of exercise and mental stimulation.",
        traits: ["Loyal", "Energetic", "Intelligent", "Friendly", "Protective"],
        medicalHistory: "Up to date on all vaccinations, regular vet checkups, no known health issues.",
        adoptionFee: "$250",
        location: "San Francisco, CA",
        images: [
          "/german.webp",
          "/dog2.jpg",
          "/dog3.jpg"
        ]
      });
      
      setIsUploading(false);
    }, 800);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTrait = () => {
    // Fixed: Added null/undefined check before trim()
    if (formData.currentTrait && formData.currentTrait.trim() && formData.traits.length < 5) {
      setFormData(prev => ({
        ...prev,
        traits: [...prev.traits, prev.currentTrait.trim()],
        currentTrait: ""
      }));
    }
  };

  const handleRemoveTrait = (index) => {
    setFormData(prev => ({
      ...prev,
      traits: prev.traits.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newImages = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 6) // Limit to 6 images
      }));
      setIsUploading(false);
    }, 1000);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log("Adoption Post Updated:", formData);
      setIsUploading(false);
      setIsSubmitted(true);
      
      // Reset form after submission if needed
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this adoption post? This action cannot be undone.")) {
      setIsUploading(true);
      // Simulate delete process
      setTimeout(() => {
        console.log("Post deleted");
        setIsUploading(false);
        // Redirect or show success message
        window.location.href = "/my-hub";
      }, 1200);
    }
  };

  if (isUploading && !originalData) {
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
            Loading Adoption Post
          </motion.h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
              >
                <FiArrowLeft className="mr-2" /> Back
              </button>
              
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-600">
                  Step {step} of {MAX_STEPS}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <motion.div 
                    className="bg-emerald-500 h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Edit Adoption Post
                </motion.h1>
                <motion.p 
                  className="mt-2 text-gray-600 max-w-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Update your adoption post to help {formData.name} find a loving home
                </motion.p>
              </div>
              
              {originalData && (
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-medium flex items-center gap-2"
                    onClick={handleDeletePost}
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete Post
                  </motion.button>
                  <div className="text-sm text-gray-500">
                    <div>Posted: {originalData.createdAt}</div>
                    <div>Views: {originalData.views} • Inquiries: {originalData.inquiries}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Form Content */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-6">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiCheck className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Post Updated!
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                      Your adoption post for {formData.name} has been successfully updated.
                    </p>
                    <div className="flex justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Continue Editing
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
                      >
                        View Post
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                            <FiEdit className="text-emerald-500 w-6 h-6" />
                            Basic Information
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Update basic details about {formData.name}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pet Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="e.g. Max"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Breed *
                              </label>
                              <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="e.g. German Shepherd"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Age *
                              </label>
                              <input
                                type="text"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="e.g. 3 years"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender *
                              </label>
                              <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Size *
                              </label>
                              <select
                                name="size"
                                value={formData.size}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select size</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                                <option value="Extra Large">Extra Large</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color *
                              </label>
                              <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="e.g. Black & Tan"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Weight
                              </label>
                              <input
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="e.g. 28 kg"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <div></div> {/* Empty div for spacing */}
                          <motion.button
                            type="button"
                            onClick={() => setStep(2)}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!formData.name || !formData.breed || !formData.age || !formData.gender || !formData.size || !formData.color}
                          >
                            Next: Health & Traits
                            <FiArrowLeft className="transform rotate-180" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                    
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                            <FiHeart className="text-blue-500 w-6 h-6" />
                            Health & Personality
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Update health details and personality traits
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {[
                              { label: 'Vaccinated', name: 'vaccinated', icon: '💉' },
                              { label: 'Neutered/Spayed', name: 'neutered', icon: '✂️' },
                              { label: 'Microchipped', name: 'microchipped', icon: '🔬' }
                            ].map((item, index) => (
                              <div 
                                key={index} 
                                className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer ${formData[item.name] ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                                onClick={() => setFormData(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                              >
                                <div className="text-2xl">{item.icon}</div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.label}</p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {formData[item.name] ? 'Yes' : 'No'}
                                  </p>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData[item.name] ? 'bg-green-500' : 'bg-gray-300'}`}>
                                  {formData[item.name] && (
                                    <FiCheck className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Medical History
                            </label>
                            <textarea
                              name="medicalHistory"
                              value={formData.medicalHistory}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                              placeholder="Describe any medical conditions or treatments..."
                            ></textarea>
                          </div>
                          
                          <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Personality Traits
                            </label>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {formData.traits.map((trait, index) => (
                                <motion.span
                                  key={index}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium flex items-center gap-1"
                                >
                                  {trait}
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveTrait(index)}
                                    className="ml-1 text-blue-900 hover:text-blue-800"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </button>
                                </motion.span>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={formData.currentTrait}
                                onChange={(e) => setFormData(prev => ({ ...prev, currentTrait: e.target.value }))}
                                placeholder="Add a trait (e.g. Friendly)"
                                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTrait()}
                              />
                              <button
                                type="button"
                                onClick={handleAddTrait}
                                className="px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                disabled={!formData.currentTrait || !formData.currentTrait.trim() || formData.traits.length >= 5}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description *
                            </label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              required
                              rows="4"
                              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                              placeholder="Tell potential adopters about your pet..."
                            ></textarea>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <motion.button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiArrowLeft /> Back
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => setStep(3)}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!formData.description}
                          >
                            Next: Images & Details
                            <FiArrowLeft className="transform rotate-180" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                    
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                            <FiImage className="text-purple-500 w-6 h-6" />
                            Images & Final Details
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Update photos and final details
                          </p>
                          
                          <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Photos (Up to 6)
                            </label>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                              {formData.images.map((img, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="relative group"
                                >
                                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40" />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    <FiX className="w-4 h-4 text-gray-800" />
                                  </button>
                                </motion.div>
                              ))}
                              
                              {formData.images.length < 6 && (
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer h-40 bg-gray-50 hover:bg-gray-100 transition-colors"
                                  onClick={() => fileInputRef.current.click()}
                                >
                                  <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-500">Add Photo</span>
                                </motion.div>
                              )}
                            </div>
                            
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              multiple
                              className="hidden"
                            />
                            
                            {isUploading && (
                              <div className="text-center py-4">
                                <div className="w-8 h-8 mx-auto border-t-2 border-emerald-500 border-solid rounded-full animate-spin"></div>
                                <p className="mt-2 text-sm text-gray-500">Uploading images...</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FiDollarSign className="text-purple-500" />
                                Adoption Fee
                              </label>
                              <input
                                type="text"
                                name="adoptionFee"
                                value={formData.adoptionFee}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="e.g. $250"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FiMapPin className="text-purple-500" />
                                Location *
                              </label>
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="e.g. San Francisco, CA"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FiCalendar className="text-emerald-500" />
                              Adoption Process
                            </h4>
                            <ul className="text-gray-700 space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  1
                                </span>
                                <span>Your post will be reviewed by our team within 24 hours</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  2
                                </span>
                                <span>Potential adopters will contact you directly</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  3
                                </span>
                                <span>We recommend meeting adopters in a public place</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <motion.button
                            type="button"
                            onClick={() => setStep(2)}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiArrowLeft /> Back
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                                Updating Post...
                              </>
                            ) : (
                              <>
                                <FiEdit className="w-5 h-5" />
                                Update Adoption Post
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white py-12 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-4xl font-bold mb-3">24h</div>
                <p className="text-emerald-100">Average Response Time</p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-4xl font-bold mb-3">92%</div>
                <p className="text-emerald-100">Adoption Success Rate</p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-4xl font-bold mb-3">1,000+</div>
                <p className="text-emerald-100">Active Adopters</p>
              </motion.div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default EditAdoption;