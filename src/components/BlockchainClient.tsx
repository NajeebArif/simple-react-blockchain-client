import React, { useEffect, useState, useCallback } from 'react';
import { Block, BlockchainNode, Transaction } from '../lib/blockchain-node';
import { CirclieCheckIcon, ClockIcon, TerminalIcon } from './Icons';
import { Message, MessageTypes } from '../lib/message';
import { WebsocketController } from '../lib/websocket-controller';
import BlocksPanel from './BlocksPanel';
import PendingTransactionsPanel from './PendingTransactions';
import TransactionForm from './TransactionsForm';

type Props = {
  node: BlockchainNode,
  generateBlock: ()=>void,
  status: React.ReactElement,
  addTransaction:  (transaction: Transaction) => void,
};

const BlockchainClient = (props: Props) => {
  
  return (
    <main>
      <h1 className='font-bold'>Blockchain node</h1>
      <aside className='flex space-x-3 rounded'>{props.status}</aside>
      <section>
        <TransactionForm
          onAddTransaction={props.addTransaction}
          disabled={props.node.isMining || props.node.chainIsEmpty}
        />
      </section>
      <section>
        <PendingTransactionsPanel
          formattedTransactions={formatTransactions(props.node.pendingTransactions)}
          onGenerateBlock={props.generateBlock}
          disabled={props.node.isMining || props.node.noPendingTransactions}
        />
      </section>
      <section>
        <BlocksPanel blocks={props.node.chain} />
      </section>
    </main>
  );
}

function formatTransactions(transactions: Transaction[]): string {
  return transactions.map(t =>`${t.sender} → ${t.recipient}: $${t.amount}`).join('\n');
}


export default BlockchainClient;
