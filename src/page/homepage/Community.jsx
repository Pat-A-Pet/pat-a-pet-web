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
  const cardsPerPage = 6;
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
        const { data } = await axios.get("http://localhost:5000/api/posts/get-posts", { headers });
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
    return (     
      <HamsterLoader size={14} />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#A0C878] text-white px-4 py-2 rounded-full"
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
      <section className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 opacity-90 z-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Pet Lovers Community
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Share, Connect & Learn Together
          </h2>
          <p className="text-lg text-white max-w-2xl mb-8">
            Join thousands of pet enthusiasts sharing stories, advice, and photos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-xl">
              Share Your Story
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-8 py-3 rounded-full text-lg font-semibold transition">
              Explore Posts
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Community Posts</h2>
            <p className="text-gray-600 mt-2">Discover stories and tips from fellow pet lovers</p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-full pl-5 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                <option>All Topics</option>
                <option>Training Tips</option>
                <option>Health & Nutrition</option>
                <option>Adoption Stories</option>
                <option>Pet Care</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate("/createpost")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-medium transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Post
            </button>
          </div>
        </div>

        {/* Post Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {currentPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
              }`}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-emerald-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
              }`}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-emerald-50 py-16 mt-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to share your pet story?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our growing community of pet lovers and share your experiences, photos, and advice with thousands of fellow enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg">
              Create Your First Post
            </button>
            <button className="bg-white text-emerald-600 border border-emerald-500 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold transition">
              Browse Community Guidelines
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
