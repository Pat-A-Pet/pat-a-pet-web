import React, { useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiImage,
  FiTag,
  FiMapPin,
  FiDollarSign,
  FiInfo,
  FiHeart,
  FiCalendar,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { FaDog, FaCat } from "react-icons/fa";
import { GiFishScales, GiPig, GiRat, GiTortoise } from "react-icons/gi";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const CreateAdoption = () => {
  const { user } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_STEPS = 3;
  const progressPercentage = (step / MAX_STEPS) * 100;

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    species: "",
    age: "",
    gender: "",
    color: "",
    weight: "",
    vaccinated: false,
    neutered: false,
    microchipped: false,
    description: "",
    // traits: [],
    currentTrait: "",
    // medicalHistory: "",
    adoptionFee: "",
    location: "",
    images: [],
    files: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleAddTrait = () => {
  //   if (formData.currentTrait.trim() && formData.traits.length < 5) {
  //     setFormData(prev => ({
  //       ...prev,
  //       traits: [...prev.traits, prev.currentTrait.trim()],
  //       currentTrait: ""
  //     }));
  //   }
  // };

  // const handleRemoveTrait = (index) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     traits: prev.traits.filter((_, i) => i !== index)
  //   }));
  // };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 6) {
      setError("Maximum 6 images allowed");
      return;
    }

    setIsUploading(true);

    const newImages = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 6),
      files: [...prev.files, ...files].slice(0, 6),
    }));

    setIsUploading(false);
    setError(null);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(formData.images[index].preview);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const uploadImagesToCloudinary = async () => {
    try {
      const formDataForUpload = new FormData();

      formData.files.forEach((file) => {
        formDataForUpload.append("images", file);
      });

      const response = await axios.post(
        "http://localhost:5000/api/pets/upload-pet-images",
        formDataForUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      return response.data.images.map((img) => img.url);
    } catch (err) {
      console.error("Image upload error:", err);
      throw new Error(err.response?.data?.error || "Failed to upload images");
    }
  };

  const createPetListing = async (imageUrls) => {
    try {
      const cleanAdoptionFee = formData.adoptionFee.replace(/[^0-9.]/g, "");

      const payload = {
        name: formData.name,
        breed: formData.breed,
        age: parseFloat(formData.age) || 0,
        gender: formData.gender,
        color: formData.color,
        weight: formData.weight,
        vaccinated: formData.vaccinated,
        neutered: formData.neutered,
        microchipped: formData.microchipped,
        description: formData.description,
        // traits: formData.traits,
        // medicalHistory: formData.medicalHistory,
        adoptionFee: parseFloat(cleanAdoptionFee) || 0,
        location: formData.location,
        imageUrls,
        species: formData.species,
      };

      await axios.post(
        "http://localhost:5000/api/pets/create-listing",
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
    } catch (err) {
      console.error("Listing creation error:", err);
      throw new Error(err.response?.data?.error || "Failed to create listing");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsUploading(true);

    try {
      const imageUrls =
        formData.files.length > 0 ? await uploadImagesToCloudinary() : [];

      await createPetListing(imageUrls);

      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          breed: "",
          species: "Dog",
          age: "",
          gender: "",
          color: "",
          weight: "",
          vaccinated: false,
          neutered: false,
          microchipped: false,
          description: "",
          // traits: [],
          currentTrait: "",
          // medicalHistory: "",
          adoptionFee: "",
          location: "",
          images: [],
          files: [],
        });
        setStep(1);

        formData.images.forEach((image) => {
          URL.revokeObjectURL(image.preview);
        });
      }, 3000);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to create adoption post");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-emerald-600 hover:text-emerald-800 font-medium mb-4"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <motion.h1
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Create Adoption Post
                </motion.h1>
                <motion.p
                  className="mt-2 text-gray-600 max-w-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Help a pet find their forever home by creating a detailed
                  adoption post
                </motion.p>
              </div>

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
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center">
              <FiInfo className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                      Adoption Post Created!
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                      Your adoption post for {formData.name} has been
                      successfully created and is now visible to potential
                      adopters.
                    </p>
                    <div className="flex justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Create Another
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
                            <FiInfo className="text-emerald-500 w-6 h-6" />
                            Basic Information
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Provide basic details about the pet you're helping
                            find a home
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
                                Species *
                              </label>
                              <select
                                name="species"
                                value={formData.species}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                              >
                                <option value="">
                                  <FaDog className="inline mr-2" /> Select
                                  species
                                </option>
                                <option value="Dog">
                                  <FaDog className="inline mr-2" /> Dog
                                </option>
                                <option value="Cat">
                                  <FaCat className="inline mr-2" /> Cat
                                </option>
                                <option value="Turtle">
                                  <GiTortoise className="inline mr-2" /> Turtle
                                </option>
                                <option value="Fish">
                                  <GiFishScales className="inline mr-2" /> Fish
                                </option>
                                <option value="Pig">
                                  <GiPig className="inline mr-2" /> Pig
                                </option>
                              </select>
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
                                placeholder="e.g. 3"
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
                                placeholder="e.g. 28"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <div></div>
                          <motion.button
                            type="button"
                            onClick={() => setStep(2)}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={
                              !formData.name ||
                              !formData.breed ||
                              !formData.age ||
                              !formData.gender ||
                              !formData.color
                            }
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
                        <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-xl p-6 border border-green-200">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                            <FiHeart className="text-green-500 w-6 h-6" />
                            Health & Personality
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Share details about the pet's health and personality
                            traits
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {[
                              {
                                label: "Vaccinated",
                                name: "vaccinated",
                                icon: "💉",
                              },
                              {
                                label: "Neutered/Spayed",
                                name: "neutered",
                                icon: "✂️",
                              },
                              {
                                label: "Microchipped",
                                name: "microchipped",
                                icon: "🔬",
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer ${formData[item.name] ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    [item.name]: !prev[item.name],
                                  }))
                                }
                              >
                                <div className="text-2xl">{item.icon}</div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.label}</p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {formData[item.name] ? "Yes" : "No"}
                                  </p>
                                </div>
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${formData[item.name] ? "bg-green-500" : "bg-gray-300"}`}
                                >
                                  {formData[item.name] && (
                                    <FiCheck className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* <div className="mb-8">
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
                          </div> */}

                          {/* <div className="mb-8">
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
                                disabled={!formData.currentTrait.trim() || formData.traits.length >= 5}
                              >
                                Add
                              </button>
                            </div>
                          </div> */}

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
                              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
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
                        <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-xl p-6 border border-green-200">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                            <FiImage className="text-gray-500 w-6 h-6" />
                            Images & Final Details
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Add photos and final details to complete your
                            adoption post
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
                                  <img
                                    src={img.preview}
                                    alt={`Preview ${index}`}
                                    className="w-full h-40 object-cover rounded-xl border border-gray-200"
                                  />
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
                                  <span className="text-sm text-gray-500">
                                    Add Photo
                                  </span>
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
                                <p className="mt-2 text-sm text-gray-500">
                                  Uploading images...
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FiDollarSign className="text-green-500" />
                                Adoption Fee
                              </label>
                              <input
                                type="text"
                                name="adoptionFee"
                                value={formData.adoptionFee}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="e.g. $250"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FiMapPin className="text-gray-500" />
                                Location *
                              </label>
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                <span>
                                  Your post will be reviewed by our team within
                                  24 hours
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  2
                                </span>
                                <span>
                                  Potential adopters will contact you directly
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  3
                                </span>
                                <span>
                                  We recommend meeting adopters in a public
                                  place
                                </span>
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
                                Creating Post...
                              </>
                            ) : (
                              <>
                                <FiTag className="w-5 h-5" />
                                Create Adoption Post
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

        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white py-12 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-4xl font-bold mb-3">3,500+</div>
                <p className="text-emerald-100">Pets Adopted</p>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-4xl font-bold mb-3">98%</div>
                <p className="text-emerald-100">Success Rate</p>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-4xl font-bold mb-3">24h</div>
                <p className="text-emerald-100">Average Adoption Time</p>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default CreateAdoption;
