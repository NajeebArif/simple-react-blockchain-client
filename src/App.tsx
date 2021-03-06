import MainPageComponent from './components/NavBar';
import './App.css';
import React, { useEffect, useState, useCallback } from 'react';
import { Block, BlockchainNode, Transaction } from './lib/blockchain-node';
import { CirclieCheckIcon, ClockIcon, TerminalIcon } from './components/Icons';
import { Message, MessageTypes } from './lib/message';
import { WebsocketController } from './lib/websocket-controller';
import BlocksPanel from './components/BlocksPanel';
import PendingTransactionsPanel from './components/PendingTransactions';
import TransactionForm from './components/TransactionsForm';

const server = new WebsocketController();
const node = new BlockchainNode();

function App() {
  const [status, setStatus] = useState<React.ReactElement>();

  const handleGetLongestChainRequest = useCallback((message: Message) => {
    server.send({
      type: MessageTypes.LONGEST_CHAIN_RESPONSE,
      correlationId: message.correlationId,
      payload: node.chain
    });
  }, []);

  const handleNewBlockRequest = useCallback(async (message: Message) => {
    const transactions = message.payload as Transaction[];
    const miningProcessIsDone = node.mineBlockWith(transactions);

    setStatus(getStatus(node));

    const newBlock = await miningProcessIsDone;
    addBlock(newBlock);
  }, []);

  const handleNewBlockAnnouncement = useCallback(async (message: Message) => {
    const newBlock = message.payload as Block;
    addBlock(newBlock, false);
  }, []);

  const handleServerMessages = useCallback((message: Message) => {
    switch (message.type) {
      case MessageTypes.LONGEST_CHAIN_REQUEST: return handleGetLongestChainRequest(message);
      case MessageTypes.NEW_BLOCK_REQUEST       : return handleNewBlockRequest(message);
      case MessageTypes.NEW_BLOCK_ANNOUNCEMENT  : return handleNewBlockAnnouncement(message);
      default: {
        console.log(`Received message of unknown type: "${message.type}"`);
      }
    }
  }, [
    handleGetLongestChainRequest,
    handleNewBlockAnnouncement,
    handleNewBlockRequest
  ]);

  useEffect(() => {
    async function initializeBlockchainNode() {
      await server.connect(handleServerMessages);
      const blocks = await server.requestLongestChain();
      if (blocks.length > 0) {
        node.initializeWith(blocks);
      } else {
        await node.initializeWithGenesisBlock();
      }
      setStatus(getStatus(node));
    }

    initializeBlockchainNode();

    return () => server.disconnect();
  }, [ handleServerMessages ]);

   useEffect(() => {
    setStatus(getStatus(node));
  }, []); 

  function addTransaction(transaction: Transaction): void {
    node.addTransaction(transaction);
    setStatus(getStatus(node));
  }

  async function generateBlock() {
    // Let everyone in the network know that transactions need to be added to the blockchain.
    // Every node will try to generate a new block first for the provided transactions.
    server.requestNewBlock(node.pendingTransactions);
    const miningProcessIsDone = node.mineBlockWith(node.pendingTransactions);

    setStatus(getStatus(node));

    const newBlock = await miningProcessIsDone;
    addBlock(newBlock);
  }

  async function addBlock(block: Block, notifyOthers = true): Promise<void> {
    // The addBlock() method returns a promise that is rejected if the block cannot be added
    // to the chain. Hence wrap the addBlock() call in the try / catch.
    try {
      await node.addBlock(block);
      if (notifyOthers) {
        server.announceNewBlock(block);
      }
    } catch (err) {
    //   console.log(err.message);
    }

    setStatus(getStatus(node));
  }
  return (
    <header>
      <MainPageComponent node={node} status={getStatus(node)} generateBlock={generateBlock} addTransaction={addTransaction}/>
    </header>
  );
}

function getStatus(node: BlockchainNode): React.ReactElement {
  return <>
  {
         node.chainIsEmpty          ? <><ClockIcon /> <span>Initializing the blockchain...</span></> :
         node.isMining              ? <> <ClockIcon /> <span>Mining a new block...</span></>:
         node.noPendingTransactions ? <><TerminalIcon /> <span>Add one or more transactions</span></>:
                                      <> <CirclieCheckIcon /> <span>Ready to mine a new block (transactions: {node.pendingTransactions.length}). </span></>}</>
}


export default App;
