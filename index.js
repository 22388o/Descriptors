const { ECPairFactory } = require('ecpair')
const bitcoin = require('bitcoinjs-lib')
const ecurve = require('ecurve')
const secp256k1 = ecurve.getCurveByName('secp256k1')
const schnorr = require('bip-schnorr')
const { bech32, bech32m } = require('bech32')

const bip38 = require('bip38')
const wif = require('wif')

const tinysecp = require('tiny-secp256k1')
const ECPair = ECPairFactory(tinysecp);

function getP2TRAddress(keyPair, network) {
  const pubKey = ecurve.Point.decodeFrom(secp256k1, keyPair.publicKey)
  const taprootPubkey = schnorr.taproot.taprootConstruct(pubKey)
  const words = bech32.toWords(taprootPubkey)
  words.unshift(1)
  return bech32m.encode('bc', words)
}

var myWifString = '5KN7MzqK5wt2TP1fQCYyHBtDrXdJuXbUzm4A9rKAteGu3Qi5CVR'

const keyPair = new ECPair.fromWIF(myWifString)

console.log(getP2TRAddress(keyPair))

var password = 'TestingOneTwoThree'
var decoded = new ECPair.fromWIF(myWifString)

var encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, password)
console.log('encryptedKey', encryptedKey)

var encryptedKey = '6PRVWUbkzzsbcVac2qwfssoUJAN1Xhrg6bNk8J7Nzm5H7kxEbn2Nh2ZoGg'
var decryptedKey = bip38.decrypt(encryptedKey, password, function (status) {
  //console.log(status.percent) // will print the percent every time current increases by 1000
})

console.log('decryptedKey', wif.encode(0x80, decryptedKey.privateKey, decryptedKey.compressed))