import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links data
  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/listing", label: "Listing" },
    { path: "/community", label: "Community" },
    { path: "/chat", label: "Inbox" },
    { path: "/myhub", label: "Your Pet Hub" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 px-4 py-3">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-black/80 shadow-md backdrop-blur-sm rounded-full px-6 py-3"
            : "bg-transparent"
        }`}
      >
        {/* Left: Animated Logo */}
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <motion.img 
                src="logo-removebg.png" 
                alt="pat-a-pet" 
                className="w-40"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </Link>
        </div>

        {/* Center: Desktop Nav with Animated Indicators */}
        <div className="hidden md:flex flex-1 justify-center gap-3 items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <div key={link.path} className="relative">
                <Link 
                  to={link.path} 
                  className={`nav-link relative z-10 px-1 py-2 transition-all duration-200 ${
                    isActive 
                      ? "text-indigo-600 dark:text-indigo-400 font-medium" 
                      : "text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300"
                  }`}
                >
                  {link.label}
                </Link>
                
                {/* Animated active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 dark:bg-indigo-400 rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                
                {/* Hover effect */}
                {!isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-200 dark:bg-indigo-900 rounded-t-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Profile with Animation */}
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <Link 
            to="/profile" 
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full"
            >
              <User 
                className={`w-6 h-6 transition-colors ${
                  location.pathname === "/profile"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              />
            </motion.div>
            
            {location.pathname === "/profile" && (
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              />
            )}
          </Link>
        </div>

        {/* Hamburger Icon (Mobile) with Animation */}
        <motion.button
          className="md:hidden text-gray-700 dark:text-white z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? (
            <X size={28} className="text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Menu size={28} />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu with Enhanced Animation */}
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
                opacity: { duration: 0.2, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { 
                height: { duration: 0.3, ease: "easeIn" },
                opacity: { duration: 0.1 }
              }
            }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-xl rounded-b-xl overflow-hidden"
          >
            <nav className="flex flex-col py-4">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { 
                        delay: index * 0.1,
                        duration: 0.3
                      }
                    }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Link 
                      to={link.path}
                      className={`mobile-link flex items-center py-4 px-8 ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-active-indicator"
                          className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-3"
                          transition={{ type: "spring", stiffness: 500 }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Profile link in mobile menu */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    delay: navLinks.length * 0.1,
                    duration: 0.3
                  }
                }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Link 
                  to="/profile"
                  className={`mobile-link flex items-center py-4 px-8 ${
                    location.pathname === "/profile"
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {location.pathname === "/profile" && (
                    <motion.div
                      layoutId="mobile-active-indicator"
                      className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-3"
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                  )}
                  Profile
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;