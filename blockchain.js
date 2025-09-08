const crypto = require('crypto');

// Block Class
class Block {
    /**
     * @param {number} index
     * @param {string} timestamp
     * @param {Array} transactions - Array of transaction objects
     * @param {string} previousHash
     */
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;  // Transaction array
        this.previousHash = previousHash;
        this.nonce = 0;  // used for mining (Proof of Work)
        this.hash = this.calculateHash();
    }

    /** Compute SHA-256 over the block’s contents */
    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                String(this.index) +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.previousHash +
                String(this.nonce)
            )
            .digest('hex');
    }

    /** Proof-of-Work: find a hash starting with N leading zeros */
    mineBlock(difficulty) {
        const target = '0'.repeat(Math.max(difficulty, 3));  // Ensure difficulty is at least 3
        let attempts = 0;
        while (this.hash.substring(0, target.length) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
            attempts++;
        }
        console.log(`Block mined (idx=${this.index}): ${this.hash}`);
        console.log(`Attempts to mine: ${attempts}`);
    }
}

// Blockchain Class
class Blockchain {
    constructor(difficulty = 3) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = Math.max(difficulty, 3);  // Set minimum difficulty to 3
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        const genesisTransactions = [
            { from: 'Genesis', to: 'Nobody', amount: 0 }
        ];
        return new Block(0, Date.now().toString(), genesisTransactions, '');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /** Add a new block to the chain */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    /** Add a transaction to the pool */
    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    /** Create and add a block with the current pending transactions */
    minePendingTransactions() {
        const newBlock = new Block(
            this.chain.length,
            Date.now().toString(),
            this.pendingTransactions
        );
        this.addBlock(newBlock);
        this.pendingTransactions = [];  // Reset pending transactions after mining
    }

    /** Verify the integrity of the blockchain */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            // Recalculate the current hash and check if it matches
            if (current.hash !== current.calculateHash()) {
                return false;
            }

            // Check if the previous hash is correct
            if (current.previousHash !== previous.hash) {
                return false;
            }
        }
    }
}

module.exports = { Blockchain, Block };