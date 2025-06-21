import React, { useState } from "react";
import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function Card({ pet }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [liked, setLiked] = useState(() => {
    try {
      const userId = user?._id?.toString();
      return pet?.loves?.some(id => id?.toString() === userId) || false;
    } catch (error) {
      console.error("Error checking initial like status:", error);
      return false;
    }
  });
  const [saving, setSaving] = useState(false);

  // Default data if no pet is provided
  const defaultPet = {
    name: "German Shepherd",
    species: "Dog",
    breed: "German Shepherd",
    age: "2 years old",
    weight: "65 lbs",
    location: "Indonesia",
    images: ["german.webp"],
    _id: "default"
  };

  const displayPet = pet || defaultPet;

  const handleToggleLove = async (e) => {
    e.stopPropagation();
    
    // Don't proceed if no user or it's the default pet
    if (!user) {
      alert("Please log in to use favorites.");
      return;
    }
    
    if (displayPet._id === "default") {
      return;
    }

    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const { data } = await axios.patch(
        `http://localhost:5000/api/pets/pet-love/${displayPet._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Safely update based on server response
      const userId = user._id?.toString();
      const isLiked = data.loves?.some(id => id?.toString() === userId) || false;
      setLiked(isLiked);
    } catch (err) {
      console.error("Error toggling favorite:", err.response?.data || err.message);
      setLiked(!optimisticLiked); // Revert on error
      alert("Failed to update favorite. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`w-[320px] h-[320px] bg-white rounded-[32px] p-[3px] relative shadow-[0_70px_30px_-50px_#604b4a30] transition-all duration-500 ease-in-out border-4 border-green-500 ${
        hover ? "rounded-tl-[55px]" : ""
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate(`/petdetail/${displayPet._id}`)}
    >
      {/* Fav Icon */}
      <div className="absolute top-[1.4rem] right-8 z-10">
        <button
          onClick={handleToggleLove}
          disabled={saving || displayPet._id === "default" || !user}
          className={`bg-transparent border-none transform transition-all duration-300 hover:scale-110 focus:outline-none ${
            displayPet._id === "default" || !user ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          {liked ? (
            <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
          ) : (
            <Heart className="w-6 h-6 text-rose-500 drop-shadow-sm" />
          )}
        </button>
      </div>

      {/* Profile Picture */}
      <div
        className={`absolute top-[3px] left-[3px] transition-all duration-500 ease-in-out z-[1] overflow-hidden border-solid ${
          hover
            ? "w-[120px] h-[120px] top-[15px] left-[15px] border-[7px] rounded-full z-[3] border-[#A0C878] shadow-[0_5px_5px_rgba(96,75,74,0.19)]"
            : "w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-[29px] border-0"
        }`}
      >
        <img
          src={
            displayPet.imageUrls && displayPet.imageUrls.length > 0
              ? displayPet.imageUrls[0]
              : "german.webp"
          }
          alt={displayPet.name || "Pet"}
          className={`w-full h-full object-cover transition-all duration-500 ${
            hover ? "scale-[1] object-[50%_30%] delay-500" : "object-center"
          }`}
        />
      </div>

      {/* Bottom Section */}
      <div
        className={`absolute left-[3px] right-[3px] bottom-[3px] bg-gradient-to-br from-green-500 to-emerald-600 rounded-[29px] shadow-inner overflow-hidden z-[2] transition-all duration-500 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${
          hover ? "top-[15%] rounded-tl-[80px]" : "top-[75%]"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

        <div className="absolute bottom-0 left-6 right-6 h-[200px] flex flex-col justify-between py-4">
          <div className="space-y-2">
            <span className="block text-white font-bold text-xl tracking-wide mt-2">
              {displayPet.name || "Unknown Pet"}
            </span>
          </div>

          {/* Expandable Content */}
          <div
            className={`space-y-3 transition-all duration-500 ${
              hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="grid grid-cols-2 gap-3 text-white/80 text-xs">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="block font-medium text-white">Age</span>
                <span>{displayPet.age || "Unknown"}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="block font-medium text-white">Weight</span>
                <span>{displayPet.weight || "Unknown"}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm hover:text-white transition-colors cursor-pointer">
                  {displayPet.location || "Unknown Location"}
                </span>
              </div>
              <span className="text-white text-sm font-medium hover:text-green-200 transition-colors cursor-pointer">
                {displayPet.breed || displayPet.species || "Unknown Breed"}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/petdetail/${displayPet._id}`);
              }}
              className={`bg-white text-green-600 px-5 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg text-sm ${
                hover
                  ? "bg-yellow-200 text-green-800 transform scale-105 shadow-xl hover:shadow-2xl"
                  : "hover:bg-green-50 hover:scale-105"
              }`}
            >
              Adopt
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className={`absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full transition-all duration-500 ${
          hover ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      ></div>
      <div
        className={`absolute top-8 left-8 w-2 h-2 bg-emerald-300 rounded-full transition-all duration-700 delay-100 ${
          hover ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      ></div>
    </div>
  );
}