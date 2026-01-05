import React, { useContext, useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Card from "../component/card";
import { FiChevronRight } from "react-icons/fi";
import PostCard from "../component/post";
import { useNavigate } from "react-router-dom";
// import HamsterLoader from "../component/Loader";
import Footer from "../component/Footer";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const { user, loading: userLoading } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    petsListed: 0,
    adoptions: 0,
  });
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (userLoading) {
        return;
      }

      try {
        setLoading(true);

        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        // Fetch pets and posts in parallel
        const [petsResponse, postsResponse] = await Promise.all([
          axios.get(`${baseUrl}/pets/get-listings`, { headers }),
          axios.get(`${baseUrl}/posts/get-posts`, { headers }),
        ]);

        setPets(petsResponse.data.slice(0, 4));
        setPosts(postsResponse.data.slice(0, 3));

        // Update stats
        setStats({
          petsListed: petsResponse.data.length,
          adoptions: petsResponse.data.filter((pet) => pet.status === "adopted")
            .length,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]);

  const handleExploreClick = () => {
    if (!user) {
      navigate("/signin");
    } else {
      navigate("/listing");
    }
  };

  const handleViewCommunity = () => {
    if (!user) {
      navigate("/signin");
    } else {
      navigate("/community");
    }
  };

  if (userLoading || loading) {
    // return <HamsterLoader size={14} />;
    return;
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
    <div className="overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="scroll-mt-20 relative h-screen max-h-[800px] w-full"
      >
        <div className="absolute inset-0 bg-black/5 z-[1]" />
        <img
          src="/Herro Banner.png"
          alt="Hero"
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Hero Content - Made responsive with different padding and text sizes */}
        <div className="absolute inset-0 flex items-center px-4 sm:px-6 md:px-12 lg:px-20 z-[2]">
          <div className="max-w-3xl pl-4 sm:pl-8 md:pl-12 lg:pl-60 space-y-2 sm:space-y-3 md:space-y-4 text-black">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              One More Friend
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-800">
              Thousands More Fun!
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              Having a pet means you have more joy, a new friend, a happy person
              who will always be with you to have fun. We have{" "}
              {stats.petsListed}+ different pets that can meet your needs!
            </p>
            <button
              onClick={handleExploreClick}
              className="cursor-pointer bg-[#A0C878] hover:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl mt-4 sm:mt-6"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section
        id="pets"
        className="scroll-mt-20 py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <p className="text-base sm:text-lg text-gray-500 mb-1">
              What's new?
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Take A Look At Some Of Our Pets
            </h2>
          </div>
          <button
            onClick={handleExploreClick}
            className="cursor-pointer flex items-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2.5 border-2 border-[#A0C878] text-[#A0C878] rounded-full text-xs sm:text-sm font-medium hover:bg-[#A0C878] hover:text-white transition-all duration-300"
          >
            View More
            <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 xl:gap-72 justify-items-center">
          {pets.length > 0 ? (
            pets.map((pet) => <Card key={pet._id} pet={pet} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No pets available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full my-8 sm:my-12">
        <div className="absolute inset-0 bg-black/10 z-[1]" />
        <img
          src="/Banner-1.png"
          alt="banner"
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 flex items-center justify-center sm:justify-end px-4 sm:px-6 md:px-12 lg:px-20 z-[2]">
          <div className="max-w-3xl text-center sm:text-right px-4 sm:px-0 sm:pr-8 md:pr-12 lg:pr-60 space-y-3 sm:space-y-4 md:space-y-6 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
              Adoption Success!
            </h1>
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                🐶 {stats.petsListed} Pets Listed!
              </h2>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                🐾 {stats.adoptions} Adoptions!
              </h2>
            </div>
            <button
              onClick={handleExploreClick}
              className="cursor-pointer bg-[#A0C878] hover:bg-green-700 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl mt-2 sm:mt-4"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section
        id="community"
        className="scroll-mt-20 py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <p className="text-base sm:text-lg text-gray-500 mb-1">
              Hard to choose right products for your pets?
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Our Community
            </h2>
          </div>
          <button
            onClick={handleViewCommunity}
            className="cursor-pointer flex items-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2.5 border-2 border-[#A0C878] text-[#A0C878] rounded-full text-xs sm:text-sm font-medium hover:bg-[#A0C878] hover:text-white transition-all duration-300"
          >
            View More
            <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-6 justify-items-center items-start">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No community posts available</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
