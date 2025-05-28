import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 px-4 py-3">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-black/80 shadow-md rounded-full px-6 py-3"
            : "bg-transparent"
        }`}
      >
        {/* Left: Logo */}
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            <img src="logo-removebg.png" alt="pat-a-pet" className="w-40" />
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center gap-8 items-center">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">Listing</Link>
          <Link to="/about" className="nav-link">Community</Link>
          <Link to="/contact" className="nav-link">Your Pet Hub</Link>
        </div>

        {/* Right: Profile */}
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <Link to="/" className="nav-link">Profile</Link>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <button
          className="md:hidden text-gray-700 dark:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-white dark:bg-black px-6 pb-4 overflow-hidden"
          >
            <nav className="flex flex-col space-y-4 py-4">
              <Link to="/" className="mobile-link">Home</Link>
              <Link to="/about" className="mobile-link">Listing</Link>
              <Link to="/about" className="mobile-link">Community</Link>
              <Link to="/contact" className="mobile-link">Your Pet Hub</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
