import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../handler/AuthHandler";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const { user } = useContext(UserContext);
  const { logout, isAuthenticated } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileDropdownOpen(false);
  };

  const scrollTo = (id) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
      }
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const landingLinks = [
    { id: "hero", label: "Home" },
    { id: "pets", label: "Our Pets" },
    { id: "community", label: "Community" },
  ];

  const appLinks = [
    { path: "/", label: "Home" },
    { path: "/listing", label: "Listing" },
    { path: "/community", label: "Community" },
    { path: "/chat", label: "Inbox" },
    { path: "/myhub", label: "Your Pet Hub" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 px-3 sm:px-4 py-2 sm:py-3">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white/40 shadow-md backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3"
            : "bg-transparent"
        }`}
      >
        {/* Logo - Made responsive with smaller size on mobile */}
        <div className="flex-1">
          <Link to={"/"} className="max-w-min text-2xl font-bold text-gray-800">
            <motion.img
              src="/logo-removebg.png"
              alt="pat-a-pet"
              className="w-32 sm:w-40" // Smaller on mobile
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center gap-3 items-center">
          {(isAuthenticated ? appLinks : landingLinks).map((link) => {
            const isActive = isAuthenticated
              ? location.pathname === link.path
              : location.hash === `#${link.id}`;

            return (
              <div
                key={isAuthenticated ? link.path : link.id}
                className="relative w-max"
              >
                {isAuthenticated ? (
                  <Link
                    to={link.path}
                    className={`nav-link relative z-10 px-1 py-2 text-sm sm:text-base ${
                      isActive ? "text-black font-medium" : "text-black"
                    } cursor-pointer transition-transform duration-200 hover:scale-10`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollTo(link.id)}
                    className={`nav-link relative z-10 px-1 py-2 text-sm sm:text-base ${
                      isActive ? "text-white font-medium" : "text-black"
                    } cursor-pointer transition-transform duration-200 hover:scale-10 `}
                  >
                    {link.label}
                  </button>
                )}

                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#A0C878] rounded-t-full transition-transform duration-200 hover:scale-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side - Auth Buttons or Profile */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-2 sm:gap-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/signin")}
                className="cursor-pointer bg-white text-[#A0C878] border-2 border-[#A0C878] hover:bg-[#A0C878] hover:text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="cursor-pointer bg-white text-[#A0C878] border-2 border-[#A0C878] hover:bg-[#A0C878] hover:text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4" ref={profileRef}>
              <motion.button
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer bg-[#A0C878] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-[#8eb866] transition-colors"
              >
                <Crown size={16} />
                Get Premium
              </motion.button>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="bg-indigo-100 p-2 rounded-full cursor-pointer"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </motion.button>
              </div>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-16 right-20 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="py-1">
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          Welcome, {user.fullname}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-700 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? (
            <X size={24} className="text-black" /> // Smaller icon on mobile
          ) : (
            <Menu size={24} /> // Smaller icon on mobile
          )}
        </motion.button>
      </div>

      {/* Mobile Menu - Improved with smaller text and better spacing */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: "easeIn" },
                opacity: { duration: 0.1 },
              },
            }}
            className="md:hidden bg-white shadow-xl rounded-b-xl overflow-hidden"
          >
            <nav className="flex flex-col">
              {(isAuthenticated ? appLinks : landingLinks).map(
                (link, index) => {
                  const isActive = isAuthenticated
                    ? location.pathname === link.path
                    : location.hash === `#${link.id}`;

                  return (
                    <motion.div
                      key={isAuthenticated ? link.path : link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.1 },
                      }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {isAuthenticated ? (
                        <Link
                          to={link.path}
                          className={`transition-transform duration-200 hover:scale-10 flex items-center py-3 px-6 text-sm ${
                            isActive
                              ? "text-gray-800 font-medium"
                              : "text-gray-600"
                          } `}
                          onClick={() => setMenuOpen(false)}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="mobile-active-indicator"
                              className="w-1.5 h-1.5 rounded-full bg-[#A0C878] mr-2 transition-transform duration-200 hover:scale-10"
                            />
                          )}
                          {link.label}
                        </Link>
                      ) : (
                        <button
                          onClick={() => scrollTo(link.id)}
                          className={`flex items-center py-3 px-6 w-full text-left text-sm transition-transform duration-200 hover:scale-10 ${
                            isActive
                              ? "text-[#A0C878] font-medium bg-[#A0C878]/10"
                              : "text-gray-600"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="mobile-active-indicator"
                              className="w-1.5 h-1.5 rounded-full bg-[#A0C878] mr-2 transition-transform duration-200 hover:scale-10"
                            />
                          )}
                          {link.label}
                        </button>
                      )}
                    </motion.div>
                  );
                },
              )}

              {/* Auth buttons or profile options */}
              {!isAuthenticated ? (
                <div className="border-t border-gray-200 mt-2 pt-2 px-3 py-2 flex gap-2">
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setMenuOpen(false);
                    }}
                    className="flex-1 bg-[#A0C878] text-white py-2 rounded-full text-xs sm:text-sm font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                    className="flex-1 bg-white text-[#A0C878] border border-[#A0C878] py-2 rounded-full text-xs sm:text-sm font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 mt-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-1"
                  >
                    <div className="px-6 py-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        Welcome {user?.fullname || user?.username || "User"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-6 py-3 w-full text-left text-xs sm:text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Sign out
                    </button>
                  </motion.div>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
