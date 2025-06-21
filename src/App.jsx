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

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/petdetail/:id" element={<PetDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/myhub" element={<MyHub />} />
          <Route path="/createadopt" element={<CreateAdoption />} />
          <Route path="/editadopt/:id" element={<EditAdoption />} />
          <Route path="/createpost" element={<PostCreationPage />} />
          <Route path="/chat/" element={<ChatPage/>}/>
          <Route path="/chat/:channelId" element={<ChatPage/>}/>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
