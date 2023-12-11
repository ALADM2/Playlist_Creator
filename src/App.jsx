import './App.css'
import { Routes, Route } from "react-router-dom";
import MainPage from './components/MainPage';
import LogPage from './components/LogPage';
import Playlist from './components/Playlist';

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<div className='logpage'><LogPage /></div>} /> 
        <Route path="/mainpage" element={<div className='mainpage'><MainPage /></div>} />
        <Route path="/playlist" element={<div className='playlist'><Playlist /></div>} />
      </Routes>
    </div>
  )
}

export default App
