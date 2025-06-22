import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import PostCard from "../../component/post";
import HamsterLoader from "../../component/Loader";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [searchQuery, setSearchQuery] = useState("");
  const cardsPerPage = 6;
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};
        const { data } = await axios.get(
          "http://localhost:5000/api/posts/get-posts",
          { headers },
        );
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  const totalPages = Math.ceil(posts.length / cardsPerPage);
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentPosts = posts.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <HamsterLoader size={14} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#A0C878] hover:bg-[#8cb368] text-white px-6 py-2 rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] bg-[#A0C878] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#A0C878] to-[#FAF6E9] opacity-60 z-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Pet Lovers Community
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6">
            Share, Connect & Learn Together
          </h2>
          <p className="text-base sm:text-lg text-white max-w-2xl mb-6 sm:mb-8 px-2 sm:px-0">
            Join thousands of pet enthusiasts sharing stories, advice, and
            photos of their furry friends.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={() => navigate("/createpost")}
              className="bg-white text-black hover:bg-emerald-50 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
            >
              Share Your Story
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("posts-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition hover:scale-105 w-full sm:w-auto"
            >
              Explore Posts
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main
        id="posts-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow scroll-mt-16"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Community Posts
            </h2>
            <p className="text-gray-600 mt-1 sm:mt-2">
              Discover stories and tips from fellow pet lovers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate("/createpost")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2 rounded-full font-medium transition-all flex items-center justify-center whitespace-nowrap hover:scale-105 w-full sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Post
            </button>
          </div>
        </div>

        {/* Post Cards */}
        {currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start place-items-center-safe">
              {currentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12 sm:mt-16">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm font-medium flex items-center justify-center ${
                      currentPage === i + 1
                        ? "bg-emerald-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-emerald-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No posts found
              </h3>
              <p className="mt-1 text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Be the first to create a post!"}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/createpost")}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Post
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-12 sm:py-16 mt-8 sm:mt-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Become an active community member
          </h2>
          <p className="text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Engage with other pet lovers and make the most of our community
            features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="bg-white/10 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Ask Questions
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Get advice from experienced pet owners
              </p>
            </div>
            <div className="bg-white/10 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Share Photos
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Show off your adorable pets
              </p>
            </div>
            <div className="bg-white/10 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Connect
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Meet other pet lovers in your area
              </p>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/createpost")}
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              Create Your First Post
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
