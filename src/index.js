import { Blockchain } from './class/Blockchain.js'
import { Transaction } from './class/Transaction.js'
import EC from 'elliptic'

const ec = new EC.ec('secp256k1')

// Это ваш приватный ключ
const myKey = ec.keyFromPrivate('fa6a1420d76bf7b69c3acb6f791f102c4ca3db4b7b28641bc8d76c8fb97ae284')

// Исходя из этого, мы можем вычислить ваш открытый ключ (который дублирует адрес вашего кошелька).
const myWalletAddress = myKey.getPublic('hex')
console.log('Ваш публичный ключ (он же адрес кошелька)\n', myWalletAddress)

const myBlockchain = new Blockchain()
console.log(`1 Ваш баланс составляет ${myBlockchain.getBalanceOfAddress(myWalletAddress)}`)
// Майним первый блок
myBlockchain.minePendingTransactions(myWalletAddress)
console.log(`2 Ваш баланс составляет ${myBlockchain.getBalanceOfAddress(myWalletAddress)}`)

// Создаем транзакцию и подписываем её вашим приватным ключом
const tx1 = new Transaction(myWalletAddress, 'address2', 20)
tx1.signTransaction(myKey)
myBlockchain.addTransaction(tx1)
console.log(`3 Ваш баланс составляет ${myBlockchain.getBalanceOfAddress(myWalletAddress)}`)
// Майним блок
myBlockchain.minePendingTransactions(myWalletAddress)
console.log(`4 Ваш баланс составляет ${myBlockchain.getBalanceOfAddress(myWalletAddress)}`)
// Создаем вторую транзакцию
const tx2 = new Transaction(myWalletAddress, 'address1', 35)
tx2.signTransaction(myKey)
myBlockchain.addTransaction(tx2)
console.log(`5 Ваш баланс составляет ${myBlockchain.getBalanceOfAddress(myWalletAddress)}`)
// Майним блок
myBlockchain.minePendingTransactions(myWalletAddress)

console.log(`6 Ваш баланс составляет ${myBlockchain.getBalanceOfAddress(myWalletAddress)}`)
console.log('Блокчейн валидный? ', myBlockchain.isChainValid() ? 'Yes' : 'No')
console.log('Список всех транзакций по данному кошельку', myBlockchain.getAllTransactionsForWallet(myWalletAddress))
