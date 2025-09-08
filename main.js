const { Blockchain, Block } = require('./blockchain');

/* ---------------------- DEMO / WALKTHROUGH ---------------------- */
function main() {
    // 1) Create a new blockchain with a difficulty of 3
    const demoCoin = new Blockchain(3);

    // 2) Add blocks with multiple transactions
    console.log('Mining block #1...');
    demoCoin.addTransaction({ from: 'Alice', to: 'Bob', amount: 50 });
    demoCoin.addTransaction({ from: 'Bob', to: 'Charlie', amount: 30 });
    demoCoin.minePendingTransactions();  // Let blockchain handle block creation and mining

    console.log('Mining block #2...');
    demoCoin.addTransaction({ from: 'Charlie', to: 'Dana', amount: 75 });
    demoCoin.addTransaction({ from: 'Dana', to: 'Eve', amount: 10 });
    demoCoin.minePendingTransactions();

    console.log('Mining block #3...');
    demoCoin.addTransaction({ from: 'Eve', to: 'Frank', amount: 20 });
    demoCoin.addTransaction({ from: 'Gina', to: 'Hank', amount: 10 });
    demoCoin.minePendingTransactions();

    console.log('Mining block #4...');
    demoCoin.addTransaction({ from: 'Alice', to: 'Charlie', amount: 25 });
    demoCoin.addTransaction({ from: 'Bob', to: 'David', amount: 5 });
    demoCoin.minePendingTransactions();

    // 3) Show the full blockchain
    console.log('\nFull Blockchain:');
    demoCoin.chain.forEach((block, index) => {
        console.log(`Block #${index}:`);
        console.log(JSON.stringify(block, null, 2));
    });

    // 4) Check if the blockchain is valid (untampered)
    console.log('\nIs the chain valid? ', demoCoin.isChainValid() ? 'Yes' : 'No');

    // 5) Tamper with the blockchain (change transaction data)
    console.log('\nTampering with block #2 data...');
    demoCoin.chain[2].transactions[0].amount = 9999; // Modify a transaction in block #2
    console.log('Is the chain valid after tampering? ', demoCoin.isChainValid() ? 'Yes' : 'No');

    // 6) Check the validity again after modifying data in block #2
    console.log('\nTrying to fix the tampered block...');
    demoCoin.chain[2].transactions[0].amount = 75; // Revert the tampering
    console.log('Is the chain valid after fixing the tampered block? ', demoCoin.isChainValid() ? 'Yes' : 'No');

    // 7) Try mining another block after tampering fix
    console.log('Mining block #5...');
    demoCoin.addTransaction({ from: 'Charlie', to: 'Alice', amount: 100 });
    demoCoin.minePendingTransactions();

    // 8) Show the updated chain after the new block is added
    console.log('\nUpdated Blockchain:');
    demoCoin.chain.forEach((block, index) => {
        console.log(`Block #${index}:`);
        console.log(JSON.stringify(block, null, 2));
    });

    // 9) Final blockchain validation
    console.log('\nFinal Chain Validation:', demoCoin.isChainValid() ? 'Valid' : 'Invalid');
}

// Call the main function
main();
