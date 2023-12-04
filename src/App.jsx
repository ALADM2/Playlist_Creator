import './App.css'
import { Routes, Route } from "react-router-dom";
import MainPage from './components/MainPage';
import LogPage from './components/logPage';

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<div className='logpage'><LogPage /></div>} /> 
        <Route path="/mainpage" element={<div className='mainpage'><MainPage /></div>} />
      </Routes>
    </div>
  )
}

export default App
