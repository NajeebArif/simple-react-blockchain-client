import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { BlockchainNode, Transaction } from "../lib/blockchain-node";
import Blockchain from "./Blockchain";
import BlockchainClient from "./BlockchainClient";
import Transactions from "./Transactions";

type Props = {
  node: BlockchainNode,
  generateBlock: ()=>void,
  status: React.ReactElement,
  addTransaction:  (transaction: Transaction) => void,
};

export default function NavBar({node, generateBlock, status, addTransaction}: Props) {
  const css = "hover:bg-gray-500 hover:rounded-b block p-3";
  return (
    <Router>
      <div id="nav-bar">
        <nav className="bg-gradient-to-r from-slate-900  hover:bg-gradient-to-l hover:text-black text-white font-bold rounded-b shadow flex flex-row">
          <Link className={css} to="/">
            Home
          </Link>
          <Link className={css} to="/transactions">
            Transactions
          </Link>
          <Link className={css} to="/blockchain">
            Blockchain
          </Link>
        </nav>
      </div>
      <Routes>
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/blockchain" element={<Blockchain node={node}/>} />
        <Route path="/" element={<BlockchainClient node={node} status={status} generateBlock={generateBlock} addTransaction={addTransaction}/>} />
      </Routes>
    </Router>
  );
}
