const fs = require('fs');
const csv = require('csv-parser');

const processCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const transactions = {};
        let maxUser = { userId: null, total: 0 };
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (!row.UserID || !row.Amount || !row.TransactionType) return;

                const userId = row.UserID.trim();
                const amount = parseFloat(row.Amount);
                const type = row.TransactionType.trim().toLowerCase();

                if (!transactions[userId]) {
                    transactions[userId] = { credit: 0, debit: 0, total: 0 };
                }

                if (type === "credit") {
                    transactions[userId].credit += amount;
                } else if (type === "debit") {
                    transactions[userId].debit += amount;
                }
                transactions[userId].total += amount;

                if (transactions[userId].total > maxUser.total) {
                    maxUser = { userId, total: transactions[userId].total };
                }
            })
            .on('end', () => {
                resolve({
                    transactions,
                    highestSpender: maxUser
                });
                fs.unlinkSync(filePath);
            })
            .on('error', (err) => reject(err));
    });
};

module.exports = { processCSV };
