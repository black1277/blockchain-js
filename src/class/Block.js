import crypto from 'crypto'
class Block {
  /**
     * @param {number} timestamp
     * @param {transaction[]} transactions
     * @param {string} previousHash
     */
  constructor(timestamp, transactions, previousHash = '') {
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.transactions = transactions
    this.nonce = 0
    this.hash = this.calculateHash()
  }

  /**
     * Возвращает SHA256 этого блока (путем обработки всех сохраненных данных
     * внутри этого блока)
     *
     * @returns {string}
     */
  calculateHash() {
    return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex')
  }

  /**
     * Запускает процесс майнинга на блоке. Он изменяет nonce до тех пор, пока хеш
     * блока не будет начинается с достаточного количества нулей (= difficulty)
     *
     * @param {number} difficulty
     */
  mineBlock(difficulty) {
    const zero = Array(difficulty + 1).join('0')
    while (this.hash.substring(0, difficulty) !== zero) {
      this.nonce++
      this.hash = this.calculateHash()
    }
  }

  /**
     * Проверяет все транзакции внутри этого блока (подпись + хеш) и
     * возвращает истину, если все прошло успешно. Ложь, если блок недействителен.
     *
     * @returns {boolean}
     */
  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false
      }
    }
    return true
  }
}
export { Block }
