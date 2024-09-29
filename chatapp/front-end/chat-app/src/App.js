import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './login';
import Home from './home';
import Chats from './chats';
import Signup from './signup';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/chats/:Id" element={<Chats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/" element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
