// import React, { useState, useEffect, useContext } from "react";
// import Navbar from "../../component/Navbar";
// import Card from "../../component/card";
// import { FiChevronRight } from "react-icons/fi";
// import { FaDog, FaCat } from "react-icons/fa";
// import { GiTortoise } from "react-icons/gi";
// import Footer from "../../component/Footer";
// import HamsterLoader from "../../component/Loader";
// import { UserContext } from "../../context/UserContext";
// import axios from "axios";

// export default function Listing() {
//   const [selectedCategory, setSelectedCategory] = useState("Dog");

//   const categories = [
//     { label: "Cat", icon: <FaCat className="w-5 h-5 text-gray-700" /> },
//     { label: "Dog", icon: <FaDog className="w-5 h-5 text-gray-700" /> },
//     { label: "Turtle", icon: <GiTortoise className="w-5 h-5 text-gray-700" /> },
//     // { label: "Hams", icon: <GiHamster className="w-5 h-5 text-gray-700" /> },
//   ];

//   const [currentPage, setCurrentPage] = useState(1);
//   const cardsPerPage = 9;
//   const allCards = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `Pet #${i + 1}` }));

//   const indexOfLastCard = currentPage * cardsPerPage;
//   const indexOfFirstCard = indexOfLastCard - cardsPerPage;
//   const currentCards = allCards.slice(indexOfFirstCard, indexOfLastCard);

//   const totalPages = Math.ceil(allCards.length / cardsPerPage);

//   const [pets, setPets] = useState([]);
//   const [error, setError] = useState(null);
//   const { user } = useContext(UserContext); // Get user context
//   const [loading, setLoading] = useState(true);
  

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };
 
//    useEffect(() => {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }, [currentPage]);

//     useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Create headers with authorization if user exists
//         const headers = user && user.token 
//           ? { Authorization: `Bearer ${user.token}` } 
//           : {};
        
//         // Fetch pets with auth headers
//         const petsResponse = await axios.get(
//           "http://localhost:5000/api/pets/get-listings",
//           { headers }
//         );
//         setPets(petsResponse.data);
        
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.response?.data?.message || "Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]); // Re-fetch when user changes


//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <div className="flex-grow flex items-center justify-center">
//           <HamsterLoader size={14} />
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <div className="flex-grow flex justify-center items-center">
//           <div className="text-center">
//             <p className="text-red-500 text-lg">{error}</p>
//             <button 
//               onClick={() => window.location.reload()} 
//               className="mt-4 bg-[#A0C878] text-white px-4 py-2 rounded-full"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }



//   return (
//     <>
//       <Navbar />

//       {/* Hero Section with Text Overlay */}
//       <section className="relative w-full h-full">
//         <img
//           src="/Banner-2.png"
//           alt="Banner2"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 flex items-start justify-end pt-25 pr-12">
//             <div className="px-8 md:px-20 max-w-xl text-black">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//                 One More Friend
//             </h1>
//             <h2 className="text-4xl md:text-5xm font-semibold mb-4">
//                 Thousands More Fun!
//             </h2>
//             <p className="text-sm md:text-xm">
//                 Having a pet means you have more joy, a new friend, a happy <br /> person who will always be with you to have fun. We have 200+ <br /> different pets that can meet your needs! <br /> 
//             </p>
//             {/* Rounded green button */}
//             <button className="bg-white hover:bg-green-700 text-black px-9 py-3 rounded-full text-sm font-semibold transition mt-6">
//                 Explore Now
//             </button>
//             </div>
//         </div>
//       </section>

//       {/* Category Selector */}
//       <section className="flex gap-4 px-8 py-6 justify-center bg-white -mt-8 z-10 relative">
//         {categories.map((cat) => (
//           <div
//             key={cat.label}
//             onClick={() => setSelectedCategory(cat.label)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-md cursor-pointer transition ${
//               selectedCategory === cat.label
//                 ? "bg-[#EEF8C8] border-[#A0C878]"
//                 : "bg-white border-gray-200 hover:bg-gray-100"
//             }`}
//           >
//             {cat.icon}
//             <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
//           </div>
//         ))}
//       </section>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto">
//         <div className="mb-6 ml-5">
//             <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-300">
//             {selectedCategory}s
//             </h2>
//             <p className="text-lg mb-1">30 {selectedCategory.toLowerCase()}s</p>
//         </div>

//         {/* Card Grid */}
//         <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 justify-items-center">
//          {pets.length > 0 ? (
//                      pets.slice(0, 4).map((pet) => (
//                        <Card 
//                          key={pet._id} 
//                          pet={pet}
//                          // Only show heart if user is logged in
//                          showHeart={!!user}
//                        />
//                      ))
//                    ) : (
//                      <div className="col-span-4 text-center py-8">
//                        <p className="text-gray-500">No pets available at the moment</p>
//                      </div>
//                    )}
//         </div>

//         {/* Pagination */}
//        <div className="flex justify-center mt-16 mb-16">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-full text-sm font-medium ${
//                 currentPage === 1 
//                   ? "text-gray-400 cursor-not-allowed" 
//                   : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
//               }`}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             </button>
            
//             {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
//               let pageNum;
//               if (totalPages <= 5) {
//                 pageNum = index + 1;
//               } else if (currentPage <= 3) {
//                 pageNum = index + 1;
//               } else if (currentPage >= totalPages - 2) {
//                 pageNum = totalPages - 4 + index;
//               } else {
//                 pageNum = currentPage - 2 + index;
//               }
              
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium ${
//                     currentPage === pageNum
//                       ? "bg-emerald-500 text-white shadow-md"
//                       : "text-gray-700 hover:bg-emerald-100"
//                   }`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
            
//             {totalPages > 5 && currentPage < totalPages - 2 && (
//               <span className="px-2 text-gray-500">...</span>
//             )}
            
//             {totalPages > 5 && currentPage < totalPages - 2 && (
//               <button
//                 onClick={() => setCurrentPage(totalPages)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium ${
//                   currentPage === totalPages
//                     ? "bg-emerald-500 text-white shadow-md"
//                     : "text-gray-700 hover:bg-emerald-100"
//                 }`}
//               >
//                 {totalPages}
//               </button>
//             )}
            
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-full text-sm font-medium ${
//                 currentPage === totalPages 
//                   ? "text-gray-400 cursor-not-allowed" 
//                   : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
//               }`}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }


import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../component/Navbar";
import Card from "../../component/card";
import { FiChevronRight } from "react-icons/fi";
import { FaDog, FaCat } from "react-icons/fa";
import { GiTortoise } from "react-icons/gi";
import Footer from "../../component/Footer";
import HamsterLoader from "../../component/Loader";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

export default function Listing() {
  const [selectedSpecies, setSelectedSpecies] = useState("Dog");
  const [currentPage, setCurrentPage] = useState(1);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  
  const cardsPerPage = 9;
  
  const categories = [
    { label: "Cat", icon: <FaCat className="w-5 h-5 text-gray-700" /> },
    { label: "Dog", icon: <FaDog className="w-5 h-5 text-gray-700" /> },
    { label: "Turtle", icon: <GiTortoise className="w-5 h-5 text-gray-700" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
        const response = await axios.get(
          "http://localhost:5000/api/pets/get-listings",
          { headers }
        );
        setPets(response.data);
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
    const filtered = pets.filter(pet => 
      pet.species && 
      pet.species.toLowerCase() === selectedSpecies.toLowerCase()
    );
    setFilteredPets(filtered);
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

  // Loading state
   if (loading) {
    return (
      <div>
        <HamsterLoader size={14} />
      </div>
    );
  }

  // Error state
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
                Having a pet means you have more joy, a new friend, a happy <br /> 
                person who will always be with you to have fun. We have {pets.length}+ <br /> 
                different pets that can meet your needs! <br /> 
            </p>
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
            onClick={() => setSelectedSpecies(cat.label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-md cursor-pointer transition ${
              selectedSpecies === cat.label
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
      <main className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-600">
            {selectedSpecies}s
          </h2>
          <p className="text-lg mb-1">
            {filteredPets.length} {selectedSpecies.toLowerCase()}{filteredPets.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 justify-items-center">
          {currentCards.length > 0 ? (
            currentCards.map((pet) => (
              <Card 
                key={pet._id} 
                pet={pet}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No {selectedSpecies.toLowerCase()}s available</p>
            </div>
          )}
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