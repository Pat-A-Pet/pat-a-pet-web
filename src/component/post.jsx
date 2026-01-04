import React, { useState, useContext, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function PostCard({ post }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState(post?.comments || []);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.loves?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Use post images if available, otherwise default images
  const postImages =
    post?.imageUrls?.length > 0
      ? post.imageUrls
      : ["/german.webp", "/dog2.jpg", "/dog3.jpg", "/dog4.jpg"];

  // Initialize liked state based on whether user has already liked the post
  useEffect(() => {
    if (!user?.id || !post?.loves) return;

    // Convert both IDs to strings for reliable comparison
    const userId = user.id.toString();
    const userLiked = post.loves.some(
      (loveId) => loveId && loveId.toString() === userId,
    );

    setLiked(userLiked);
  }, [user, post]);

  const handleLike = async () => {
    if (!user || !user.token) {
      alert("Please login to like posts");
      return;
    }

    try {
      setIsLiking(true);
      // Optimistic UI update
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      await axios.post(
        `${baseUrl}/posts/post-love/${post._id}`,
        {},
        { headers },
      );
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert on error
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      alert("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;
    if (!user || !user.token) {
      alert("Please login to comment");
      return;
    }

    try {
      setIsCommenting(true);
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      const response = await axios.post(
        `${baseUrl}/posts/post-comments/${post._id}`,
        { comment: newComment },
        { headers },
      );

      // Update comments from response
      if (response.data.comments) {
        setComments(response.data.comments);
      } else if (response.data) {
        setComments(response.data.comments || []);
      }

      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === postImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? postImages.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="w-full p-[2px] bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-[24px] shadow-[0_8px_30px_rgba(34,197,94,0.12)] hover:shadow-[0_12px_40px_rgba(34,197,94,0.20)] transition-all duration-300">
      <div className="bg-white rounded-[22px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 cursor-default">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={post?.author?.profilePicture || "/default-profile.png"}
                alt={post?.author?.fullname || "User"}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {post?.author?.fullname || "Anonymous"}
              </h3>
              <p className="text-gray-500 text-xs">
                {new Date(post?.createdAt).toLocaleString()} •
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <p className="text-gray-800 text-sm leading-relaxed mb-3">
            {post?.captions || "No caption provided"}
          </p>

          {/* Post Images Carousel */}
          {postImages.length > 0 && (
            <div className="relative rounded-xl overflow-hidden mb-3 group cursor-pointer">
              <img
                src={postImages[currentImageIndex]}
                alt={`Post ${currentImageIndex + 1}`}
                className="w-full h-64 object-cover transition-all duration-500"
              />

              {postImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {postImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {postImages.map((_, index) => (
                    <div
                      key={index}
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
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  liked
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                } cursor-pointer`}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-200 ${liked ? "fill-current scale-110" : ""}`}
                />
                <span className="text-sm font-medium">
                  {isLiking ? "..." : likeCount}
                </span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-500 hover:bg-blue-50 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{comments.length}</span>
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
                  ? "text-yellow-600 bg-yellow-50"
                  : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
              } cursor-pointer`}
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
            {/* Existing Comments */}
            <div className="space-y-3 mt-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id || comment.author._id}
                    className="flex gap-3"
                  >
                    <img
                      src={
                        comment.author.profilePicture || "/default-profile.png"
                      }
                      alt={comment.author.fullname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <p className="font-medium text-sm text-gray-900">
                          {comment.author.fullname}
                        </p>
                        <p className="text-sm text-gray-700">
                          {comment.comment || comment.text}
                        </p>
                      </div>
                      <button className="text-xs text-gray-500 mt-1 hover:text-gray-700">
                        Reply
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-2">
                  No comments yet
                </p>
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-3 mt-4">
              <img
                src={user?.profilePicture || "/default-profile.png"}
                alt="You"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                />
                {newComment && (
                  <button
                    type="submit"
                    disabled={isCommenting}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    {isCommenting ? "Posting..." : "Send"}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
