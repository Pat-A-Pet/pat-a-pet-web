import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../component/Navbar";
import PetImageSlider from "../../component/petslider";
import { FiClock, FiMapPin, FiHeart } from "react-icons/fi";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import HamsterLoader from "../../component/Loader";
import { useNavigate } from "react-router-dom";

export default function PetDetail() {
  const { user } = useContext(UserContext);
  console.log(user);
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [petData, setPetData] = useState(null);
  const navigate = useNavigate();
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/pets/get-listing/${id}`,
        );

        // Handle both response formats
        const petData = response.data.pet || response.data;

        if (!petData) {
          throw new Error("Pet not found");
        }

        console.log("Owner data:", petData.owner); // Verify owner data
        setPetData(petData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pet data:", err);
        setError(err.response?.data?.error || "Failed to load pet details");
        setLoading(false);
      }
    };

    fetchPetData();
  }, [id]);

  const handleAdoptClick = async () => {
    try {
      // Check if user is logged in
      if (!user) {
        // You might want to redirect to login or show a modal
        alert("Please log in to adopt a pet");
        return;
      }

      // Check if user is the owner
      if (user.id === petData.owner._id) {
        alert("You can't adopt your own pet!");
        return;
      }

      // Make the adoption request
      const response = await axios.post(
        `http://localhost:5000/api/pets/request-adoption/${id}`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Handle successful adoption request
      alert("Adoption request sent successfully!");
      // You might want to update the UI or redirect
    } catch (error) {
      console.error("Error sending adoption request:", error);
      alert(error.response?.data?.message || "Failed to send adoption request");
    }
  };

  // Inside PetDetail.jsx

  const handleMessageClick = async () => {
    // Ensure user is logged in and petData is available
    if (!user || !user.id) {
      alert("Please log in to message the owner.");
      navigate("/login");
      return;
    }
    if (!petData) {
      alert("Pet data not loaded yet.");
      return;
    }
    // Prevent messaging self if user is the owner
    // Assuming petData.owner is the string ID of the owner in this check
    // NOTE: If petData.owner is an object in your data model, ensure petData.owner._id is used here too
    if (user.id === petData.owner) {
      // This check should compare IDs.
      alert("You cannot message yourself (the owner of this pet).");
      navigate("/chat"); // Optionally navigate to chat list
      return;
    }

    setIsCreatingChannel(true);
    try {
      const payload = {
        petId: petData._id,
        requesterId: user.id, // The logged-in user is the requester (string ID)
        // CORRECTED: Pass only the owner's ID string
        ownerId: petData.owner._id, // Ensure petData.owner is an object with an _id property
      };

      console.log("Sending payload to create-channel:", payload); // For debugging: see what's being sent

      const response = await axios.post(
        "http://localhost:5000/api/chat/create-channel",
        payload,
        {
          headers: {
            // Assuming your backend expects the user's JWT token for authentication
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success && response.data.channelId) {
        console.log(
          "Channel created/retrieved successfully:",
          response.data.channelId,
        );
        navigate(`/chat/${response.data.channelId}`);
      } else {
        console.error(
          "Failed to create chat channel (backend response):",
          response.data.error || "Unknown error",
        );
        alert(
          `Failed to create chat channel: ${response.data.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error creating chat channel (Axios error):", error);
      // Access more specific error details from Axios
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to create chat channel";
      alert(`Error creating chat channel: ${errorMessage}`);
    } finally {
      setIsCreatingChannel(false);
    }
  };

  if (loading) {
    return (
      <div>
        <HamsterLoader size={14} />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FiHeart className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Error Loading Pet
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!petData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No pet data available</p>
          </div>
        </div>
      </>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Convert MongoDB date to YYYY-MM-DD format
  const publishDate = petData.createdAt
    ? formatDate(petData.createdAt)
    : "Unknown date";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Pet Image Slider */}
            <div>
              <PetImageSlider
                images={petData.imageUrls}
                owner={petData.owner}
              />
            </div>

            {/* Right: Pet Information */}
            <div className="space-y-6">
              {/* Pet Header */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {petData.name} the {petData.breed}
                    </h1>
                    <p className="text-lg text-gray-600 flex items-center gap-2">
                      <FiMapPin className="inline-block text-gray-500 mr-1" />
                      {petData.location}
                    </p>
                    <p className="text-lg text-gray-600 flex items-center gap-2">
                      <FiClock className="inline-block text-gray-500 mr-1" />
                      {publishDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        isLiked
                          ? "bg-red-500 text-white scale-110"
                          : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
                        fill={isLiked ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button className="p-3 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-bold text-gray-900">{petData.age}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-bold text-gray-900">{petData.gender}</p>
                  </div>
                  {/* <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-bold text-gray-900">{petData.size}</p>
                  </div> */}
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-bold text-gray-900">{petData.weight}</p>
                  </div>
                </div>

                {/* Adoption Fee */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium">
                        Adoption Fee
                      </p>
                      <p className="text-3xl font-bold text-green-800">
                        ${petData.adoptionFee}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAdoptClick}
                    disabled={user && user.id === petData.owner._id}
                    className={`flex-1 bg-[#A0C878] text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 ${
                      user && user.id === petData.owner._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Adopt {petData.name}
                  </button>
                  <button
                    onClick={handleMessageClick}
                    disabled={
                      isCreatingChannel ||
                      (user && user.id === petData.owner._id)
                    }
                    className={`px-6 py-4 border-2 border-[#A0C878] text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 ${
                      isCreatingChannel ||
                      (user && user.id === petData.owner._id)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isCreatingChannel ? "Loading..." : "Message"}
                  </button>
                </div>
              </div>

              {/* Information Tabs */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  {[
                    { id: "details", label: "Details", icon: "📋" },
                    { id: "health", label: "Health", icon: "🏥" },
                    // { id: 'personality', label: 'Personality', icon: '🐕' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        activeTab === tab.id
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === "details" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          About {petData.name}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {petData.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Breed:</span>
                            <span className="font-medium text-gray-900">
                              {petData.breed}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Color:</span>
                            <span className="font-medium text-gray-900">
                              {petData.color}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Age:</span>
                            <span className="font-medium text-gray-900">
                              {petData.age}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gender:</span>
                            <span className="font-medium text-gray-900">
                              {petData.gender}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weight:</span>
                            <span className="font-medium text-gray-900">
                              {petData.weight}
                            </span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium text-gray-900">{petData.size}</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "health" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Health Status
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            label: "Vaccinated",
                            status: petData.vaccinated,
                            icon: "💉",
                          },
                          {
                            label: "Neutered",
                            status: petData.neutered,
                            icon: "✂️",
                          },
                          {
                            label: "Microchipped",
                            status: petData.microchipped,
                            icon: "🔬",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border-2 ${item.status ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{item.icon}</div>
                              <div
                                className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${item.status ? "bg-green-500" : "bg-red-500"}`}
                              >
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  {item.status ? (
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  ) : (
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  )}
                                </svg>
                              </div>
                              <p className="text-sm font-medium">
                                {item.label}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Medical History</h4>
                        <p className="text-gray-700">{petData.medicalHistory || "No significant medical history reported"}</p>
                      </div> */}
                    </div>
                  )}

                  {/* {activeTab === 'personality' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Personality Traits</h3>
                        <div className="flex flex-wrap gap-3">
                          {petData.traits && petData.traits.length > 0 ? (
                            petData.traits.map((trait, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                              >
                                {trait}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500">No personality traits listed</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🏠</span>
                          Perfect Home For {petData.name}
                        </h4>
                        <ul className="text-gray-700 space-y-2">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Active families or individuals
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Homes with yards or nearby parks
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Experienced pet owners preferred
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Those seeking a loyal companion
                          </li>
                        </ul>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

