import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { FiMail } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

import { Play } from "lucide-react";

export default function PetImageSlider({
  media = [],
  owner = null,
  onVideoClick,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentMedia = media[currentImage];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % media.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + media.length) % media.length);
  };

  const goToImage = (index) => {
    setCurrentImage(index);
  };

  const ownerName =
    typeof owner === "string"
      ? `Owner ID: ${owner}`
      : owner?.fullname || "Unknown Owner";

  return (
    <>
      <div className="w-full">
        {/* Main Image Display */}
        <div className="relative group mb-4">
          <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
            {currentMedia.type === "image" && (
              <img
                src={currentMedia.url}
                alt="Pet"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {currentMedia?.type === "video" && (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gray-400 blur-xl opacity-60" />

                <div
                  onClick={onVideoClick}
                  className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Play className="w-16 h-16 text-white" />
                  <span className="text-white text-sm font-semibold bg-black/40 px-3 py-1 rounded-full">
                    Video Preview
                  </span>
                </div>

                {/* PRO overlay badge */}
                <div
                  onClick={onVideoClick}
                  className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm border border-white/20 cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                  Watch Video
                  <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded-sm ml-1">
                    PRO
                  </span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {media.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <Expand className="w-5 h-5" />
            </button>

            {media.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentImage + 1} / {media.length}
              </div>
            )}
          </div>

          {media.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentImage
                      ? "bg-white scale-125"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {media.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-6">
            {media.map((item, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-20 h-20 rounded-xl overflow-hidden ${
                  index === currentImage
                    ? "ring-2 ring-[#A0C878]"
                    : "opacity-70"
                } cursor-pointer`}
              >
                {item.type === "image" ? (
                  <img src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Owner Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={owner?.imageUrls || "/public/german.webp"}
                alt={`${owner?.fullname || "Unknown"} profile`}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {/* {console.log("Owner data:", owner)} */}
                <h3 className="text-lg font-bold text-gray-800">
                  {ownerName || "Unknown Owner"}
                </h3>
                <FaCheckCircle className="text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Pet Owner</p>
            </div>

            {/* <button className="px-4 py-2 bg-[#A0C878] text-white rounded-lg hover:bg-green-700 transition-colors"> */}
            {/*   <FiMail className="text-lg" /> */}
            {/* </button> */}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {currentMedia.type === "image" && (
              <img
                src={media[currentImage].url}
                alt={`Pet photo ${currentImage + 1} - Fullscreen`}
                className="max-w-full max-h-full object-contain"
              />
            )}

            {currentMedia?.type === "video" && (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center relative group">
                <div
                  onClick={onVideoClick}
                  className="w-[80vw] h-[80vh] bg-gray-500 flex items-center justify-center cursor-pointer flex-col gap-2"
                >
                  <Play className="w-16 h-16 text-white" />
                  <span className="text-white text-sm font-semibold bg-black/40 px-3 py-1 rounded-full">
                    Video Preview
                  </span>
                </div>

                {/* PRO overlay badge */}
                <div
                  onClick={onVideoClick}
                  className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm border border-white/20 cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                  Watch Video
                  <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded-sm ml-1">
                    PRO
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {media.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  {currentImage + 1} / {media.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hide scrollbars for thumbnails */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
