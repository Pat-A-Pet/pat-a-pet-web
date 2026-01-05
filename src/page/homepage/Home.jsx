import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import Card from "../../component/card";
import { FiChevronRight } from "react-icons/fi";
import PostCard from "../../component/post";
import { useNavigate } from "react-router-dom";
// import HamsterLoader from "../../component/Loader";
import Footer from "../../component/Footer";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const { user, loading: userLoading } = useContext(UserContext); // Get both user and loading state
  const [posts, setPosts] = useState([]); // Fixed: should be array, not number
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch if user context is still loading
      if (userLoading) {
        return;
      }

      try {
        setLoading(true);

        // Create headers with authorization if user exists
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        // console.log("User token:", user?.token);

        // Fetch pets with auth headers
        const petsResponse = await axios.get(`${baseUrl}/pets/get-listings`, {
          headers,
        });
        setPets(petsResponse.data);

        // Fetch adoption stats/posts
        const postResponse = await axios.get(`${baseUrl}/posts/get-posts`, {
          headers,
        });
        setPosts(postResponse.data);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]); // Re-fetch when user changes or userLoading changes

  // Handle explore button click with auth check
  const handleExploreClick = () => {
    if (!user) {
      alert("Please login to explore pets");
      navigate("/login");
    } else {
      navigate("/listing");
    }
  };

  // Show loading while either user context is loading OR data is loading
  if (userLoading || loading) {
    return <div>{/* <HamsterLoader size={14} /> */}</div>;
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
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="relative w-full h-full">
        <img
          src="/Herro Banner_1.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-start pt-42 pl-12">
          <div className="px-8 md:px-20 max-w-xl text-black">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              One More Friend
            </h1>
            <h2 className="text-4xl md:text-5xm font-semibold mb-4">
              Thousands More Fun!
            </h2>
            <p className="text-sm md:text-xm">
              Having a pet means you have more joy, a new friend, a happy <br />
              person who will always be with you to have fun. We have{" "}
              {pets.length}+ <br />
              different pets that can meet your needs! <br />
            </p>
            <button
              onClick={handleExploreClick}
              className="bg-[#A0C878] hover:bg-green-700 text-white px-9 py-3 rounded-full text-sm font-semibold transition mt-6"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      <main className="pt-12 px-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-lg mb-1">What's new?</p>
            <h2 className="text-3xl font-bold text-gray-600">
              Take A Look At Some Of Our Pets
            </h2>
          </div>
          <button
            onClick={() => navigate("/listing")}
            className="flex items-center gap-1 px-4 py-2 border border-[#A0C878] text-[#A0C878] rounded-full text-sm hover:bg-[#A0C878] hover:text-white transition"
          >
            View More
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center mt-8">
          {pets.length > 0 ? (
            pets.slice(0, 4).map((pet) => <Card key={pet._id} pet={pet} />)
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-500">No pets available at the moment</p>
            </div>
          )}
        </div>
      </main>

      <section className="relative w-full h-full mt-10">
        <img
          src="/Banner-1.png"
          alt="banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-start justify-end pt-25 pr-12">
          <div className="px-8 md:px-20 max-w-xl text-black text-right">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Adoption Success!
            </h1>
            <h2 className="text-4xm md:text-3xl font-semibold mb-4">
              🐶 {pets.length} Pets Listed!
            </h2>
            <h2 className="text-4xm md:text-3xl font-semibold mb-4">
              🐾 {posts.length} Adoptions!
            </h2>
            <button
              onClick={handleExploreClick}
              className="bg-[#A0C878] hover:bg-green-700 text-white px-9 py-3 rounded-full text-sm font-semibold transition mt-6"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      <main className="pt-12 px-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-lg mb-1">
              Hard to choose right products for your pets?
            </p>
            <h2 className="text-3xl font-bold text-gray-600">Our Community</h2>
          </div>
          <button
            onClick={() => {
              if (!user) {
                alert("Please login to view community");
                navigate("/login");
              } else {
                navigate("/community");
              }
            }}
            className="flex items-center gap-1 px-4 py-2 border border-[#A0C878] text-[#A0C878] rounded-full text-sm hover:bg-[#A0C878] hover:text-white transition"
          >
            View More
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-center mt-8 items-start mb-16">
          {posts.length > 0 &&
            posts
              .slice(0, 3)
              .map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </main>
      <Footer />
    </>
  );
}
