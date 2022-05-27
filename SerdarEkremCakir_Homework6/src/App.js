import './App.css';
import LoginRegister from './Auth/LoginRegister.js';
import Main from './Main/Main.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/Main" element={<Main/>}/>

        <Route exact path="/" element={<LoginRegister/>}/>
            

           </Routes>
    </Router>
  );
}

export default App;
