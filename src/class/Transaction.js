import crypto from 'crypto'
import EC from 'elliptic'

const ec = new EC.ec('secp256k1')

class Transaction {
    /**
     * @param {string|null} fromAddress
     * @param {string} toAddress
     * @param {number} amount
     */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = Date.now()
    }

    /**
     * Создает хэш транзакции SHA256
     *
     * @returns {string}
     */
    calculateHash() {
        return crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount + this.timestamp).digest('hex')
    }

    /**
     * Подписывает транзакцию с помощью данного ключа подписи (который представляет
     * собой эллиптическую пару ключей - объект, содержащий закрытый ключ).
     * Затем подпись сохраняется внутри объекта транзакции, а затем хранится в цепочке блоков.
     *
     * @param {string} signingKey
     */
    signTransaction(signingKey) {
        // Вы можете отправить транзакцию только с того кошелька, который связан с вашим ключом
        // здесь мы проверяем, соответствует ли fromAddress вашему publicKey
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('Вы не можете подписывать транзакции для других кошельков!');
        }
        // Вычисляем хеш этой транзакции, подписываем ее ключом
        // и сохраняем внутри объекта транзакции
        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature = sig.toDER('hex')
    }

    /**
     * Проверяет, действительна ли подпись.
     * используем fromAddress в качестве открытого ключа.
     *
     * @returns {boolean}
     */
    isValid() {
        // Если у транзакции нет адреса отправителя, мы предполагаем, что это
        // награда за майнинг и что она действительна.
        // Или проверять в специальном поле инстанса
        if (this.fromAddress === null) return true
        if (!this.signature || this.signature.length === 0) {
            throw new Error('Нет подписи в этой транзакции!')
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}
export { Transaction }