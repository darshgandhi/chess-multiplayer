import { useState, useEffect } from 'react';
import './styles/app.css';
import GameBoard from './components/GameBoard';

function App() {
  return (
    <>
      <div className="main-div">
        <div className='display-board'><GameBoard/></div>
      </div>
    </>
  )
}

export default App
