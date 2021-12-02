import {Block} from "./Block.js"
import {Transaction} from "./Transaction.js"

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 85
    }

    /**
     * @returns {Block}
     */
    createGenesisBlock() {
        return new Block(Date.parse('2021-11-01'), [], '0')
    }

    /**
     * Возвращает последний блок в нашей цепочке. Полезно, когда вы хотите создать
     * новый блок, и вам нужен хеш предыдущего блока.
     *
     * @returns {Block}
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    /**
     * Принимает все ожидающие транзакции, помещает их в блок и запускает
     * процесс добычи. Также добавляет транзакцию для отправки вознаграждения за майнинг на
     * указанный адрес.
     *
     * @param {string} miningRewardAddress
     */
    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward)
        this.pendingTransactions.push(rewardTx)

        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)

        this.chain.push(block)

        this.pendingTransactions = []
    }

    /**
     * Добавить новую транзакцию в список ожидающих транзакций (будет добавлено
     * при следующем запуске процесса майнинга). Это подтверждает, что данная
     * транзакция правильно подписана.
     *
     * @param {Transaction} transaction
     */
    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error(`Транзакция должна включать адреса отправителя (${transaction.fromAddress})
             и получателя(${transaction.toAddress})!`)
        }

        // Верификация транзакции
        if (!transaction.isValid()) {
            throw new Error('Невозможно добавить недействительную транзакцию в цепочку!')
        }

        if (transaction.amount <= 0) {
            throw new Error('Сумма транзакции должна быть больше 0')
        }

        // Убедимся, что отправленная сумма не превышает существующий баланс
        if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
            throw new Error('Недостаточно баланса')
        }

        this.pendingTransactions.push(transaction)
    }

    /**
     * Возвращает баланс указанного адреса кошелька.
     *
     * @param {string} address
     * @returns {number} The balance of the wallet
     */
    getBalanceOfAddress(address) {
        let balance = 0

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount
                }

                if (trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }
        return balance
    }

    /**
     * Возвращает список всех произошедших транзакций
     * на указанный адрес кошелька и обратно.
     *
     * @param  {string} address
     * @return {Transaction[]}
     */
    getAllTransactionsForWallet(address) {
        const txs = []

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx)
                }
            }
        }

        return txs
    }

    /**
     * Перебирает все блоки в цепочке и проверяет правильность их расположения
     * связанность и целостность хешей внутри. Проверяет также подписи
     * внутри транзакций
     *
     * @returns {boolean}
     */
    isChainValid() {
        // Проверим, не был ли блок Genesis подделан, сравнив
        // вывод createGenesisBlock с первым блоком в нашей цепочке
        const realGenesis = JSON.stringify(this.createGenesisBlock())

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false
        }

        // Проверим оставшиеся блоки в цепочке, чтобы увидеть, есть ли хеши и
        // все подписи верны
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (previousBlock.hash !== currentBlock.previousHash) {
                return false
            }

            if (!currentBlock.hasValidTransactions()) {
                return false
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }
        }
        return true
    }
}
export { Blockchain }