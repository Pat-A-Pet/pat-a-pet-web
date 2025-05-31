import React, { useState, useRef } from "react";
import { X, Image, Smile, MapPin, Hash, Send, ChevronDown, ChevronUp, ArrowLeft, Bookmark, Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePostPage() {

  // Post content states
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(["Training Tips", "Pet Care"]);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  
  // Preview states
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(127);
  const [showComments, setShowComments] = useState(false);
  
  const fileInputRef = useRef(null);
  const MAX_CHARS = 500;
  const remainingChars = MAX_CHARS - content.length;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
      setShowTagInput(false);
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ content, tags, image, location });
    alert("Post created successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
            </div>
            <button 
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors">
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
                    <div className={`text-xs mt-2 text-right ${remainingChars < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                      {remainingChars} characters remaining
                    </div>
                  </div>

                  {/* Image Preview */}
                  <AnimatePresence>
                    {image && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 relative"
                      >
                        <div className="relative rounded-xl overflow-hidden group">
                          <img 
                            src={image} 
                            alt="Post preview" 
                            className="w-full max-h-[350px] object-cover"
                          />
                          <button 
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                          >
                            <X className="w-4 h-4 text-gray-800" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tags Section */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1"
                        >
                          #{tag}
                          <button 
                            type="button"
                            onClick={() => removeTag(index)}
                            className="hover:text-emerald-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>

                    {showTagInput ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          placeholder="Add a tag..."
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          onKeyDown={(e) => e.key === 'Enter' && addTag()}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTagInput(false)}
                          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowTagInput(true)}
                        className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800"
                      >
                        <Hash className="w-4 h-4" />
                        Add tags
                      </button>
                    )}
                  </div>

                  {/* Location */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Add location"
                        className="flex-1 py-2 text-sm bg-transparent border-b border-gray-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Image className="w-5 h-5 text-gray-600" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </button>
                    <button
                      type="button"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!content.trim()}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      content.trim()
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Post
                  </motion.button>
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
                    {previewCollapsed ? 'Expand' : 'Collapse'} 
                    {previewCollapsed ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronUp className="w-4 h-4" />
                    }
                  </button>
                </div>
                
                <AnimatePresence>
                  {!previewCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex-1 overflow-y-auto p-4"
                    >
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
                                <h3 className="font-semibold text-gray-900 text-sm">Your Name</h3>
                                <p className="text-gray-500 text-xs">Just now • {location || 'Your location'}</p>
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
                            
                            {/* Post Image */}
                            {image && (
                              <div className="relative rounded-xl overflow-hidden mb-3 group cursor-pointer">
                                <img
                                  src={image}
                                  alt="Post preview"
                                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            )}

                            {/* Tags */}
                            {tags.length > 0 && (
                              <div className="flex gap-2 mb-4 flex-wrap">
                                {tags.map((tag, index) => (
                                  <span 
                                    key={index} 
                                    className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium"
                                  >
                                    #{tag}
                                  </span>
                                ))}
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
                                    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                    liked 
                                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                                      : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                  }`}
                                >
                                  <Heart className={`w-5 h-5 transition-all duration-200 ${liked ? 'fill-current scale-110' : ''}`} />
                                  <span className="text-sm font-medium">{likeCount}</span>
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
                                  <span className="text-sm font-medium">Share</span>
                                </button>
                              </div>

                              <button
                                onClick={() => setBookmarked(!bookmarked)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  bookmarked 
                                    ? 'text-yellow-600 bg-yellow-50' 
                                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                }`}
                              >
                                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Create and share your stories with the community</p>
          <p className="mt-1">Your posts will be visible to all members</p>
        </div>
      </div>
    </div>
  );
}