const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const monitorTransactionChanges = () => {
  const transactionChangeStream = Transaction.watch();

  transactionChangeStream.on('change', (change) => {
    console.log('Transaction change detected:', change);
  });
};

module.exports = monitorTransactionChanges;
