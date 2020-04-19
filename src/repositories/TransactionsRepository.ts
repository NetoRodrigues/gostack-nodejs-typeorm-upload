import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const balance = allTransactions.reduce(
      (acc, transaction) => {
        const transactionType = transaction.type;
        if (transactionType === 'income') {
          acc.income += +transaction.value;
          acc.total += +transaction.value;
        }
        if (transactionType === 'outcome') {
          acc.outcome += +transaction.value;
          acc.total -= +transaction.value;
        }
        return acc;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }
}

export default TransactionsRepository;
