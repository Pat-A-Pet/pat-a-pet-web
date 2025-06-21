import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, HelpCircle } from "lucide-react";
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

  // Scroll to section function for landing page
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

  // Landing page links (shown when not authenticated)
  const landingLinks = [
    { id: "hero", label: "Home" },
    { id: "pets", label: "Our Pets" },
    { id: "community", label: "Community" },
  ];

  // App links (shown when authenticated)
  const appLinks = [
    { path: "/", label: "Home" },
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
            ? "bg-white/40 shadow-md backdrop-blur-sm rounded-full px-6 py-3"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div className="flex-1">
          <Link
            to={"/"}
            className="text-2xl font-bold text-gray-800 dark:text-white"
          >
            <motion.img
              src="logo-removebg.png"
              alt="pat-a-pet"
              className="w-40"
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
                className="relative"
              >
                {isAuthenticated ? (
                  <Link
                    to={link.path}
                    className={`nav-link relative z-10 px-1 py-2 transition-all duration-200 ${
                      isActive ? "text-black font-medium" : "text-black"
                    } cursor-pointer`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollTo(link.id)}
                    className={`nav-link relative z-10 px-1 py-2 transition-all duration-200 ${
                      isActive ? "text-white font-medium" : "text-black"
                    } cursor-pointer`}
                  >
                    {link.label}
                  </button>
                )}

                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#A0C878] rounded-t-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side - Auth Buttons or Profile */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/signin")}
                className="cursor-pointer bg-white text-[#A0C878] border-2 border-[#A0C878] hover:bg-[#A0C878] hover:text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="cursor-pointer bg-white text-[#A0C878] border-2 border-[#A0C878] hover:bg-[#A0C878] hover:text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full cursor-pointer"
              >
                <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </motion.button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className=" absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    {/* TODO: Profile dropdown content remains the same */}
                    {/* Replace the above line with this: */}
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          Welcome, {user.fullname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {/* <Link */}
                        {/*   to="/profile" */}
                        {/*   onClick={() => setProfileDropdownOpen(false)} */}
                        {/*   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" */}
                        {/* > */}
                        {/*   <User className="w-4 h-4 mr-3" /> */}
                        {/*   Your Profile */}
                        {/* </Link> */}
                        {/* <Link */}
                        {/*   to="/settings" */}
                        {/*   onClick={() => setProfileDropdownOpen(false)} */}
                        {/*   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" */}
                        {/* > */}
                        {/*   <Settings className="w-4 h-4 mr-3" /> */}
                        {/*   Settings */}
                        {/* </Link> */}
                        {/* <Link */}
                        {/*   to="/help" */}
                        {/*   onClick={() => setProfileDropdownOpen(false)} */}
                        {/*   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" */}
                        {/* > */}
                        {/*   <HelpCircle className="w-4 h-4 mr-3" /> */}
                        {/*   Help */}
                        {/* </Link> */}
                      </div>
                      <div className="py-1 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
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

      {/* Mobile Menu */}
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
            className="md:hidden bg-white dark:bg-gray-900 shadow-xl rounded-b-xl overflow-hidden"
          >
            <nav className="flex flex-col py-4">
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
                            />
                          )}
                          {link.label}
                        </Link>
                      ) : (
                        <button
                          onClick={() => scrollTo(link.id)}
                          className={`mobile-link flex items-center py-4 px-8 w-full text-left ${
                            isActive
                              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="mobile-active-indicator"
                              className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-3"
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
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-4 py-2 flex gap-2">
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setMenuOpen(false);
                    }}
                    className="flex-1 bg-[#A0C878] text-white py-2 rounded-full text-sm font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                    className="flex-1 bg-white text-[#A0C878] border border-[#A0C878] py-2 rounded-full text-sm font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-1"
                  >
                    <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.fullName || user?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-8 py-4 w-full text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
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
