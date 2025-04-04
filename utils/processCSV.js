const fs = require('fs');
const csv = require('csv-parser');

const processCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const transactions = {};
        let highestUser = { userID: null, total: 0 };

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const { TransactionID, UserID, Date, Amount, TransactionType } = row;

                if (!TransactionID || !UserID || !Date || !Amount || !TransactionType) return;
                
                const amount = parseFloat(Amount);
                if (isNaN(amount)) return;

                if (!transactions[UserID]) {
                    transactions[UserID] = { totalCredits: 0, totalDebits: 0, totalAmount: 0 };
                }

                if (TransactionType.toLowerCase() === 'credit') {
                    transactions[UserID].totalCredits += amount;
                } else if (TransactionType.toLowerCase() === 'debit') {
                    transactions[UserID].totalDebits += amount;
                }

                transactions[UserID].totalAmount += amount;

                if (transactions[UserID].totalAmount > highestUser.total) {
                    highestUser = { userID: UserID, total: transactions[UserID].totalAmount };
                }
            })
            .on('end', () => {
                resolve({ transactions, highestUser });
            })
            .on('error', (err) => reject(err));
    });
};

module.exports = processCSV;
