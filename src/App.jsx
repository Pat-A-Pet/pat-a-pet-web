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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/petdetail" element={<PetDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/myhub" element={<MyHub />} />
        <Route path="/createadopt" element={<CreateAdoption />} />
        <Route path="/editadopt" element={<EditAdoption />} />
        <Route path="/createpost" element={<PostCreationPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
