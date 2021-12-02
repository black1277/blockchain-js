import EC from 'elliptic'

const ec = new EC.ec('secp256k1')

// Создаем новую пару ключей и преобразуем их в шестнадцатеричные строки
const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const privateKey = key.getPrivate('hex')

console.log('Ваш открытый ключ (также адрес вашего кошелька, которым можно свободно делиться)\n', publicKey)

console.log('Ваш закрытый ключ (держите в секрете! Для подписания транзакций)\n', privateKey)
