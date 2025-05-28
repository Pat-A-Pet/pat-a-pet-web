import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";
import Card from "../../component/card";
import { FiChevronRight } from "react-icons/fi";
import { FaDog, FaCat } from "react-icons/fa";
import { GiTortoise } from "react-icons/gi";
import Footer from "../../component/Footer";

export default function Listing() {
  const [selectedCategory, setSelectedCategory] = useState("Cat");

  const categories = [
    { label: "Cat", icon: <FaCat className="w-5 h-5 text-gray-700" /> },
    { label: "Dog", icon: <FaDog className="w-5 h-5 text-gray-700" /> },
    { label: "Turtle", icon: <GiTortoise className="w-5 h-5 text-gray-700" /> },
    // { label: "Hams", icon: <GiHamster className="w-5 h-5 text-gray-700" /> },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const allCards = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `Pet #${i + 1}` }));

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = allCards.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(allCards.length / cardsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);


  return (
    <>
      <Navbar />

      {/* Hero Section with Text Overlay */}
      <section className="relative w-full h-full">
        <img
          src="/Banner-2.png"
          alt="Banner2"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-start justify-end pt-25 pr-12">
            <div className="px-8 md:px-20 max-w-xl text-black">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                One More Friend
            </h1>
            <h2 className="text-4xl md:text-5xm font-semibold mb-4">
                Thousands More Fun!
            </h2>
            <p className="text-sm md:text-xm">
                Having a pet means you have more joy, a new friend, a happy <br /> person who will always be with you to have fun. We have 200+ <br /> different pets that can meet your needs! <br /> 
            </p>
            {/* Rounded green button */}
            <button className="bg-white hover:bg-green-700 text-black px-9 py-3 rounded-full text-sm font-semibold transition mt-6">
                Explore Now
            </button>
            </div>
        </div>
      </section>

      {/* Category Selector */}
      <section className="flex gap-4 px-8 py-6 justify-center bg-white -mt-8 z-10 relative">
        {categories.map((cat) => (
          <div
            key={cat.label}
            onClick={() => setSelectedCategory(cat.label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-md cursor-pointer transition ${
              selectedCategory === cat.label
                ? "bg-[#EEF8C8] border-[#A0C878]"
                : "bg-white border-gray-200 hover:bg-gray-100"
            }`}
          >
            {cat.icon}
            <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <div className="mb-6 ml-5">
            <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-300">
            {selectedCategory}s
            </h2>
            <p className="text-lg mb-1">30 {selectedCategory.toLowerCase()}s</p>
        </div>

        {/* Card Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 justify-items-center">
          {currentCards.map((card) => (
            <Card key={card.id} data={card} />
          ))}
        </div>

        {/* Pagination */}
       <div className="flex justify-center mt-16 mb-16">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentPage === 1 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    currentPage === pageNum
                      ? "bg-emerald-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-emerald-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-emerald-100"
                }`}
              >
                {totalPages}
              </button>
            )}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentPage === totalPages 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
