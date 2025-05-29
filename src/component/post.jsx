import React, { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from "lucide-react";

export default function PostCard() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(127);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Here you would typically add the comment to your data
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className="w-[400px] p-[2px] bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-[24px] shadow-[0_8px_30px_rgba(34,197,94,0.12)] hover:shadow-[0_12px_40px_rgba(34,197,94,0.20)] transition-all duration-300">
      <div className="bg-white rounded-[22px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="german.webp"
                alt="Sarah Johnson"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Sarah Johnson</h3>
              <p className="text-gray-500 text-xs">2 hours ago •</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <p className="text-gray-800 text-sm leading-relaxed mb-3">
            Just finished an amazing hiking trip in Yosemite! 🏔️ The sunrise from Half Dome was absolutely breathtaking. Nothing beats connecting with nature and pushing your limits. Who else loves adventure travel? 
          </p>
          
          {/* Post Image */}
          <div className="relative rounded-xl overflow-hidden mb-3 group cursor-pointer">
            <img
              // src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
              src="/german.webp"
              alt="Dog"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">#Training Tips</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">#Pet Care</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">#Adoption Stories</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">#Health & Nutrition</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
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
                <span className="text-sm font-medium">24</span>
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
            {/* Sample Comments */}
            <div className="space-y-3 mt-4">
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                  alt="Mike Chen"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-medium text-sm text-gray-900">Mike Chen</p>
                    <p className="text-sm text-gray-700">Amazing shot! I've been wanting to do this hike for years 🔥</p>
                  </div>
                  <button className="text-xs text-gray-500 mt-1 hover:text-gray-700">Reply</button>
                </div>
              </div>

              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
                  alt="Emma Wilson"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-medium text-sm text-gray-900">Emma Wilson</p>
                    <p className="text-sm text-gray-700">The sunrise looks incredible! What time did you start the hike?</p>
                  </div>
                  <button className="text-xs text-gray-500 mt-1 hover:text-gray-700">Reply</button>
                </div>
              </div>
            </div>

            {/* Add Comment */}
            <div className="flex gap-3 mt-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                alt="You"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment(e)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
                {newComment && (
                  <button
                    onClick={handleComment}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}