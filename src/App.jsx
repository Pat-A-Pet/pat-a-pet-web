import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Home from './page/homepage/home';
import PetDetail from './page/homepage/PetDetail';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/petdetail" element={<PetDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;
