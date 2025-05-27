import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
