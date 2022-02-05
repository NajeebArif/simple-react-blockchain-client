import React from 'react';
import NavBar from './components/NavBar';
import './App.css';
import BlockchainClient from './components/BlockchainClient';

function App() {
  return (
    <header>
      <NavBar />
      <BlockchainClient />
    </header>
  );
}

export default App;
