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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/petdetail" element={<PetDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/myhub" element={<MyHub />} />
        <Route path="/createadopt" element={<CreateAdoption />} />
        <Route path="/createpost" element={<PostCreationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
