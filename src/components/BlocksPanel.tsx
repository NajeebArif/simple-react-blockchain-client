import React from 'react';
import { Block, Transaction } from '../lib/blockchain-node';

type BlocksPanelProps = {
  blocks: Block[],
  customCss?: string,
};

const BlocksPanel: React.FC<BlocksPanelProps> = ({ blocks, customCss }) => {
  const mainPageCss = "flex overflow-y-auto"
  return (
    <div>
      <h2>Current blocks</h2>
      <div className="relative">
        <div className={ !!customCss ? customCss : mainPageCss }>
          {blocks.map((b, i) => <BlockComponent key={b.hash} index={i} block={b}></BlockComponent>)}
        </div>
      </div>
    </div>
  );
}

const BlockComponent: React.FC<{ index: number, block: Block }> = ({ index, block }) => {
  const formattedTransactions = formatTransactions(block.transactions);
  const timestamp = new Date(block.timestamp).toLocaleTimeString();

  return (
    <div className="border-2 shadow-inner m-1 p-2 space-y-3">
      <div className="flex justify-between mx-2">
        <span className="font-bold text-xl">#{index}</span>
        <span className="font-extralight text-slate-700 text-sm">{timestamp}</span>
      </div>
      <div className="flex justify-between font-extralight text-slate-700 text-sm">
        <div className="w-24">
          <div >← PREV HASH</div>
          <div ><p className="truncate overflow-clip">{block.previousHash}</p></div>
        </div>
        <div className="w-24">
          <div>THIS HASH</div>
          <div><p className="truncate overflow-clip">{block.hash}</p></div>
        </div>
      </div>
      <hr />
      <div className='space-y-3 w-72 max-w-sm'>
        <div className="font-extralight text-slate-700 text-sm">TRANSACTIONS</div>
        <pre className="text-sm">{formattedTransactions || 'No transactions'}</pre>
      </div>
    </div>
  );
}

function formatTransactions(transactions: Transaction[]): string {
  return transactions.map(t =>`${t.sender} → ${t.recipient}: $${t.amount}`).join('\n');
}

export default BlocksPanel;
