import React from 'react';
import { Button } from './Utils';

type PendingTransactionsPanelProps = {
  formattedTransactions: string;
  onGenerateBlock: () => void;
  disabled: boolean;
}

const PendingTransactionsPanel: React.FC<PendingTransactionsPanelProps> = ({ formattedTransactions, onGenerateBlock, disabled }) => {
  return (
    <div className='flex flex-col space-y-3'>
      <h2>Pending transactions</h2>
      <pre className="border-2 border-slate-100 shadow-inner">
        {formattedTransactions || 'No pending transactions yet.'}
      </pre>
        <Button disabled={disabled}
                onClick={() => onGenerateBlock()}>
                  GENERATE BLOCK</Button>
      <div className="clear"></div>
    </div>
  );
}

export default PendingTransactionsPanel;
