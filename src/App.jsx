import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Home from './page/homepage/home';
import PetDetail from './page/homepage/PetDetail';
import Listing from './page/homepage/listing';
import Community from './page/homepage/community';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/listing" element={<Listing/>} />
        <Route path="/community" element={<Community/>} />
      </Routes>
    </Router>
  );
}

export default App;
