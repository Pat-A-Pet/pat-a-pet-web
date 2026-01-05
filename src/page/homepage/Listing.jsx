import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../component/Navbar";
import Card from "../../component/card";
import { FaDog, FaCat, FaPaw } from "react-icons/fa";
import { GiTortoise, GiRabbit, GiParrotHead } from "react-icons/gi";
import { IoFish } from "react-icons/io5";
import Footer from "../../component/Footer";
import HamsterLoader from "../../component/Loader";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import PremiumModal from "../../component/PremiumModal";

export default function Listing() {
  const [selectedSpecies, setSelectedSpecies] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [premiumFeatureSource, setPremiumFeatureSource] = useState(null);

  const openPremium = (source) => {
    setPremiumFeatureSource(source);
    setIsPremiumModalOpen(true);
  };

  const cardsPerPage = 9;

  // Default icons for common categories
  const categoryIcons = {
    Dog: <FaDog className="w-5 h-5 text-gray-700" />,
    Cat: <FaCat className="w-5 h-5 text-gray-700" />,
    Turtle: <GiTortoise className="w-5 h-5 text-gray-700" />,
    Rabbit: <GiRabbit className="w-5 h-5 text-gray-700" />,
    Bird: <GiParrotHead className="w-5 h-5 text-gray-700" />,
    Fish: <IoFish className="w-5 h-5 text-gray-700" />,
    All: <FaPaw className="w-5 h-5 text-gray-700" />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        // Fetch categories first
        const categoriesResponse = await axios.get(
          `${baseUrl}/pets/categories`,
          { headers },
        );

        // Add "All" option and set categories
        const fetchedCategories = ["All", ...categoriesResponse.data];
        setCategories(fetchedCategories);

        // Then fetch pets
        const petsResponse = await axios.get(`${baseUrl}/pets/get-listings`, {
          headers,
        });
        setPets(petsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load pets");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filter pets by category
  useEffect(() => {
    if (selectedSpecies === "All") {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter(
        (pet) =>
          pet.species &&
          pet.species.toLowerCase() === selectedSpecies.toLowerCase(),
      );
      setFilteredPets(filtered);
    }
    setCurrentPage(1); // Reset to first page when category changes
  }, [pets, selectedSpecies]);

  // Pagination calculations
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredPets.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredPets.length / cardsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (loading) {
    // return <HamsterLoader size={14} />;
    return <div>{/* <HamsterLoader size={14} /> */}</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#A0C878] hover:bg-[#8cb367] text-white px-6 py-2 rounded-full transition-colors duration-300"
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
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        featureSource={premiumFeatureSource}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-[500px] bg-gray-100 overflow-hidden">
        <img
          src="Banner_1.png"
          alt="Happy pets together"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0  bg-opacity-30 flex items-center justify-end pr-4 md:pr-12 lg:pr-24">
          <div className="px-8 max-w-xl text-black">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              One More Friend
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Thousands More Fun!
            </h2>
            <p className="text-base md:text-lg mb-6">
              Having a pet means you have more joy, a new friend, a happy person
              who will always be with you to have fun. We have {pets.length}+
              different pets that can meet your needs!
            </p>
            <button className="bg-white hover:bg-green-700 hover:text-white text-gray-800 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-md cursor-pointer">
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* Category Selector */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedSpecies(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm cursor-pointer transition-all ${
                  selectedSpecies === category
                    ? "bg-[#EEF8C8] border-[#A0C878] shadow-md"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                {categoryIcons[category] || (
                  <FaPaw className="w-5 h-5 text-gray-700" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {selectedSpecies === "All" ? "All Pets" : `${selectedSpecies}s`}
          </h2>
          <p className="text-lg text-gray-600">
            {filteredPets.length} {selectedSpecies.toLowerCase()}
            {filteredPets.length !== 1 && selectedSpecies !== "All"
              ? "s"
              : ""}{" "}
            available
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>

          <div className="mb-4 rounded-xl bg-[#A0C878]/10 p-4 flex max-md:flex-col justify-between items-center">
            <p className="text-sm text-gray-700">
              Bingung memilih? Kami bisa bantu 👀
            </p>
            <button
              onClick={() => openPremium("ai_recommender")}
              className="text-sm font-semibold text-[#A0C878] cursor-pointer "
            >
              Gunakan AI Recommender
            </button>
          </div>
        </div>

        {/* Card Grid */}
        {filteredPets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCards.map((pet) => (
                <Card key={pet._id} pet={pet} />
              ))}
            </div>

            {/* Enhanced Pagination */}
            {
              <div className="flex justify-center mt-12 mb-8">
                <nav className="flex items-center gap-1">
                  {/* <button */}
                  {/*   onClick={() => setCurrentPage(1)} */}
                  {/*   disabled={currentPage === 1} */}
                  {/*   className={`p-2 rounded-full ${ */}
                  {/*     currentPage === 1 */}
                  {/*       ? "text-gray-400 cursor-not-allowed" */}
                  {/*       : "text-gray-600 hover:bg-emerald-50" */}
                  {/*   }`} */}
                  {/* > */}
                  {/*   « */}
                  {/* </button> */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-emerald-50"
                    }`}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-full text-sm ${
                          currentPage === page
                            ? "bg-emerald-500 text-white font-semibold shadow-md"
                            : "text-gray-700 hover:bg-emerald-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-emerald-50"
                    }`}
                  >
                    ›
                  </button>
                  {/* <button */}
                  {/*   onClick={() => setCurrentPage(totalPages)} */}
                  {/*   disabled={currentPage === totalPages} */}
                  {/*   className={`p-2 rounded-full ${ */}
                  {/*     currentPage === totalPages */}
                  {/*       ? "text-gray-400 cursor-not-allowed" */}
                  {/*       : "text-gray-600 hover:bg-emerald-50" */}
                  {/*   }`} */}
                  {/* > */}
                  {/*   » */}
                  {/* </button> */}
                </nav>
              </div>
            }
          </>
        ) : (
          <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              No {selectedSpecies.toLowerCase()}s available at the moment
            </p>
            <button
              onClick={() => setSelectedSpecies("All")}
              className="mt-4 bg-[#A0C878] hover:bg-[#8cb367] text-white px-6 py-2 rounded-full transition-colors"
            >
              Browse All Pets
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
