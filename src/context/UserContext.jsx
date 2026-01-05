import React, { createContext, useState, useEffect } from "react";

// Create the context
const UserContext = createContext(null);

// Create the provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    // console.log("Token from localStorage:", token); // <-- Add this
    if (!token) {
      setUser(null);
      setLoading(false);
      // console.log("No token found, user is null."); // <-- Add this
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Check if the response was successful
        console.error("HTTP error! Status:", res.status);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      // console.log("Data from /api/auth/profile:", data); // <-- Add this to see the raw response
      setUser({
        id: data.user._id,
        fullname: data.user.fullname,
        email: data.user.email,
        profilePicture: data.user.profilePictureUrl,
        token: token,
        // Add other fields you need
      });
      // console.log("User set in context:", { ...data, token }); // <-- Add this to see the final user object
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
