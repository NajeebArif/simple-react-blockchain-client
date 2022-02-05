import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Transaction } from '../lib/blockchain-node';
import { DownArrowIcon } from './Icons';
import { Input, Submit } from './Utils';

type TransactionFormProps = {
  onAddTransaction: (transaction: Transaction) => void,
  disabled: boolean
};

const defaultFormValue = {
  recipient: '',
  sender: '',
  amount: 0
};

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, disabled }) => {
  const [formValue, setFormValue] = useState<Transaction>(defaultFormValue);
  const isValid = formValue.sender && formValue.recipient && formValue.amount > 0;

  function handleInputChange({ target }: ChangeEvent<HTMLInputElement>) {
    setFormValue({
      ...formValue,
      [target.name]: target.value
    });
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddTransaction(formValue);
    setFormValue(defaultFormValue);
  }

  return (
    <div className='flex flex-col space-y-3'>
      <h2>New transaction</h2>
      <form className="inline-flex flex-col space-y-3" onSubmit={handleFormSubmit}>
        <Input
          type="text"
          name="sender"
          placeholder="Sender"
          autoComplete="off"
          disabled={disabled}
          value={formValue.sender}
          onChange={handleInputChange}
        />
        <span className="inline-flex justify-center"><DownArrowIcon /></span>
        <Input
          type="text"
          name="recipient"
          placeholder="Recipient"
          autoComplete="off"
          disabled={disabled}
          value={formValue.recipient}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="amount"
          placeholder="Amount"
          disabled={disabled}
          value={formValue.amount}
          onChange={handleInputChange}
        />
        <Submit disabled={!isValid || disabled} >ADD TRANSACTION</Submit>
      </form>
    </div>
  );
}

export default TransactionForm;