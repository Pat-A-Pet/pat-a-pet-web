import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Image,
  Send,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const navigate = useNavigate();
  // Post content states
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(127);
  const [showComments, setShowComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const MAX_CHARS = 500;
  const remainingChars = MAX_CHARS - content.length;
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Clean up object URLs when component unmounts
    return () => {
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  // Handle multiple image uploads - FIXED
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      alert("Maximum of 4 images allowed");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(), // Add unique ID
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      // If this is the first image, set current index to 0
      if (prev.length === 0) {
        setCurrentImageIndex(0);
      }
      return updated;
    });

    // Clear the file input to allow selecting the same file again
    e.target.value = "";
  };

  // Remove an image - FIXED
  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      // Revoke the object URL before removing
      if (newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);

      // Adjust current image index if needed
      if (currentImageIndex >= newImages.length && newImages.length > 0) {
        setCurrentImageIndex(newImages.length - 1);
      } else if (newImages.length === 0) {
        setCurrentImageIndex(0);
      } else if (currentImageIndex === index) {
        // If we removed the current image, go to the next one if available
        setCurrentImageIndex(Math.min(index, newImages.length - 1));
      }

      return newImages;
    });
  };

  // Carousel navigation - FIXED
  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  // Get current image safely
  const getCurrentImage = () => {
    if (images.length === 0 || currentImageIndex >= images.length) {
      return null;
    }
    return images[currentImageIndex];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to create a post");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("captions", content);

      // Append all images
      images.forEach((img) => {
        formData.append("images", img.file);
      });

      const response = await axios.post(
        "http://localhost:5000/api/posts/create-post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      console.log("Post created:", response.data);
      alert("Post created successfully!");
      navigate("/community");
      // Reset form after successful submission
      setContent("");
      setImages([]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        "Failed to create post: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const currentImage = getCurrentImage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                Create New Post
              </h2>
            </div>
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2 p-6 border-r border-gray-100">
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <div className="flex-1">
                  {/* Text Editor */}
                  <div className="mb-6">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full min-h-[180px] p-4 text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      maxLength={MAX_CHARS}
                    />
                    <div
                      className={`text-xs mt-2 text-right ${remainingChars < 50 ? "text-red-500" : "text-gray-500"}`}
                    >
                      {remainingChars} characters remaining
                    </div>
                  </div>

                  {/* Image Preview - FIXED */}
                  {images.length > 0 && (
                    <div className="mb-6 relative">
                      <div className="relative rounded-xl overflow-hidden group">
                        {currentImage?.preview && (
                          <img
                            src={currentImage.preview}
                            alt={`Post preview ${currentImageIndex + 1}`}
                            className="w-full max-h-[350px] object-cover"
                            key={currentImage.id} // Use unique ID as key
                          />
                        )}

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all z-10"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all z-10"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Image Indicators - FIXED */}
                        {images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentImageIndex
                                    ? "bg-white w-3"
                                    : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(currentImageIndex)}
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
                        >
                          <X className="w-4 h-4 text-gray-800" />
                        </button>
                      </div>

                      {/* Thumbnail Strip - FIXED */}
                      <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                          <div
                            key={img.id} // Use unique ID as key
                            className={`relative cursor-pointer border-2 ${index === currentImageIndex ? "border-emerald-500" : "border-transparent"} rounded-md flex-shrink-0`}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <img
                              src={img.preview}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={images.length >= 4}
                    >
                      <Image className="w-5 h-5 text-gray-600" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        multiple
                      />
                    </button>
                    {images.length >= 4 && (
                      <span className="text-xs text-gray-500 self-center">
                        Max 4 images
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={
                      (!content.trim() && images.length === 0) || loading
                    }
                    className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                      content.trim() || images.length > 0
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">Preview</h3>
                  <button
                    onClick={() => setPreviewCollapsed(!previewCollapsed)}
                    className="flex items-center gap-1 text-sm text-emerald-600"
                  >
                    {previewCollapsed ? "Expand" : "Collapse"}
                    {previewCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {!previewCollapsed && (
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="w-full p-[2px] bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-[24px] shadow-[0_8px_30px_rgba(34,197,94,0.12)]">
                      <div className="bg-white rounded-[22px] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">
                                Your Name
                              </h3>
                              <p className="text-gray-500 text-xs">Just now</p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                          <p className="text-gray-800 text-sm leading-relaxed mb-3">
                            {content || "Your post content will appear here..."}
                          </p>

                          {/* Post Images Preview - FIXED */}
                          {images.length > 0 && currentImage?.preview && (
                            <div className="relative rounded-xl overflow-hidden mb-3 group cursor-pointer">
                              <img
                                src={currentImage.preview}
                                alt="Post preview"
                                className="w-full h-64 object-cover"
                                key={currentImage.id} // Use unique ID as key
                              />

                              {/* Navigation Arrows */}
                              {images.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      prevImage();
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                                  >
                                    <ChevronLeft className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      nextImage();
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                                  >
                                    <ChevronRight className="w-5 h-5" />
                                  </button>
                                </>
                              )}

                              {/* Image Indicators */}
                              {images.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                  {images.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(index);
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentImageIndex
                                          ? "bg-white w-3"
                                          : "bg-white/50"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions Bar */}
                        <div className="px-4 pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => {
                                  setLiked(!liked);
                                  setLikeCount(
                                    liked ? likeCount - 1 : likeCount + 1,
                                  );
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                  liked
                                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                                    : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                                }`}
                              >
                                <Heart
                                  className={`w-5 h-5 transition-all duration-200 ${liked ? "fill-current scale-110" : ""}`}
                                />
                                <span className="text-sm font-medium">
                                  {likeCount}
                                </span>
                              </button>

                              <button
                                onClick={() => setShowComments(!showComments)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
                              >
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">0</span>
                              </button>

                              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-500 hover:bg-green-50 transition-all duration-200">
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                  Share
                                </span>
                              </button>
                            </div>

                            <button
                              onClick={() => setBookmarked(!bookmarked)}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                bookmarked
                                  ? "text-yellow-600 bg-yellow-50"
                                  : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
                              }`}
                            >
                              <Bookmark
                                className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {showComments && (
                          <div className="px-4 pb-4 border-t border-gray-100 mt-2">
                            <div className="space-y-3 mt-4">
                              <div className="text-center py-4 text-gray-500 text-sm">
                                No comments yet. Be the first to comment!
                              </div>
                            </div>

                            {/* Add Comment */}
                            <div className="flex gap-3 mt-4">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Create and share your stories with the community</p>
          <p className="mt-1">
            Try uploading multiple images to test the carousel!
          </p>
        </div>
      </div>
    </div>
  );
}

