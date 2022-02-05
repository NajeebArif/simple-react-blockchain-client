import React, { useEffect, useState, useCallback } from 'react';
import { Block, BlockchainNode, Transaction } from '../lib/blockchain-node';
import { CirclieCheckIcon, ClockIcon, TerminalIcon } from './Icons';
import { Message, MessageTypes } from '../lib/message';
import { WebsocketController } from '../lib/websocket-controller';
import BlocksPanel from './BlocksPanel';
import PendingTransactionsPanel from './PendingTransactions';
import TransactionForm from './TransactionsForm';

const server = new WebsocketController();
const node = new BlockchainNode();

const BlockchainClient: React.FC = () => {
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
    <main>
      <h1>Blockchain node</h1>
      <aside><p>{status}</p></aside>
      <section>
        <TransactionForm
          onAddTransaction={addTransaction}
          disabled={node.isMining || node.chainIsEmpty}
        />
      </section>
      <section>
        <PendingTransactionsPanel
          formattedTransactions={formatTransactions(node.pendingTransactions)}
          onGenerateBlock={generateBlock}
          disabled={node.isMining || node.noPendingTransactions}
        />
      </section>
      <section>
        <BlocksPanel blocks={node.chain} />
      </section>
    </main>
  );
}

function getStatus(node: BlockchainNode): React.ReactElement {
  return <>
  {
         node.chainIsEmpty          ? <><ClockIcon /> Initializing the blockchain...</> :
         node.isMining              ? <> <ClockIcon />Mining a new block... </>:
         node.noPendingTransactions ? <><TerminalIcon /> Add one or more transactions </>:
                                      <> <CirclieCheckIcon />Ready to mine a new block (transactions: {node.pendingTransactions.length}).</>}</>
}

function formatTransactions(transactions: Transaction[]): string {
  return transactions.map(t =>`${t.sender} → ${t.recipient}: $${t.amount}`).join('\n');
}


export default BlockchainClient;
