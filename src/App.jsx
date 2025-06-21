import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import Home from "./page/homepage/Home";
import PetDetail from "./page/homepage/PetDetail";
import Listing from "./page/homepage/Listing";
import Community from "./page/homepage/Community";
import MyHub from "./page/homepage/PetHub";
import PostCreationPage from "./page/homepage/CreatePost";
import CreateAdoption from "./page/homepage/AdoptionPost";
import ChatPage from "./page/homepage/Chat";
import LandingPage from "./page/LandingPage";
import EditAdoption from "./page/homepage/EditAdoption";
import { UserProvider } from "./context/UserContext";
import { AuthProvider, ProtectedRoute } from "./handler/AuthHandler"; // Import the AuthProvider and ProtectedRoute

function App() {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Wrap with AuthProvider */}
        <UserProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route
              path="/listing"
              element={
                <ProtectedRoute>
                  <Listing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/petdetail/:id"
              element={
                <ProtectedRoute>
                  <PetDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myhub"
              element={
                <ProtectedRoute>
                  <MyHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createadopt"
              element={
                <ProtectedRoute>
                  <CreateAdoption />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editadopt/:id"
              element={
                <ProtectedRoute>
                  <EditAdoption />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createpost"
              element={
                <ProtectedRoute>
                  <PostCreationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:channelId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
