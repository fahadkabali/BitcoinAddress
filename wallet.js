const bitcoin = require('bitcoinjs-lib')
const ECPairFactory = require('ecpair').default
const ecc = require('tiny-secp256k1')
const ECPair = ECPairFactory(ecc)
const network = bitcoin.networks.testnet
let keyPair;


async function createP2PKHwallet() {
    try {
        keyPair = ECPair.makeRandom({ network })
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
        const privateKey = keyPair.toWIF()
        console.log(`| Public Address | ${address} |`)
        console.log(`| Private Key     | ${privateKey}  |`)
    } catch (error) {
        console.error(error)
    }
}

createP2PKHwallet()

const outputNumber = 2
const txid = '87b8de75a774de78d2d4422cade09e44c8f7523582ec3e4fcda163558221d9f7'
const amount = 0.00096896
const txHex = '02000000000101a5b8352ad24bb6da875865d55f509bf8db19119e6024cc6e248fe6285d5bb0970000000000fdffffff02a2beb4f6000000001976a914be6f790a7ae331f90b0547db5c640b90ec6ae17688ac807a0100000000001976a91485b34bd47a915901ea6878fb91d7d79bfaea51de88ac0247304402206d514a6055940254afbe3960e080f68502a8a4536b62379f32703acab2527020022004a17e9bbc735419c5873cdf0ef27539158291ee9eb10e0404b36fee71f4c3af01210347f0ba160b1ac0b417344c7eb5ff6da1a76528fa0a887a1251039ab90ae0ea9b25502700'

const tx = bitcoin.Transaction.fromHex(txHex)

const txb = new bitcoin.TransactionBuilder(network)
txb.addInput(txid, outputNumber)
const destinationAddress = 'mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB'
const minerFee = 10000

const outputAmount = amount * 1e8 - minerFee

txb.addOutput(destinationAddress, outputAmount)
txb.sign(0, keyPair)
const finalTxHex = txb.build().toHex()

console.log(`Final Transaction Hex: ${finalTxHex}`)



// const bitcoin = require('bitcoinjs-lib')
// const ECPairFactory = require('ecpair').default
// const ecc = require('tiny-secp256k1')
// const ECPair = ECPairFactory(ecc)
// const network = bitcoin.networks.testnet
// let keyPair;


// function generate_address() {
//     const ECPair = ECP.ECPairFactory(ecc);
//     const network = bitcoin.networks.testnet
//     const keypair = ECPair.makeRandom({ network })
//     const pubkey = keypair.publicKey
//     const addressObject = bitcoin.payments.p2pkh({ pubkey, network })
    
//     const public_Key = keypair.publicKey.toString('hex');
//     const private_Key = keypair.privateKey.toString('hex');

//     console.log('address:',addressObject.address)
//     console.log('keypair-private:',private_Key)
//     console.log('keypair-public:',public_Key)
// }

// function initiate_transaction(private_key) {
//     const ECPair = ECP.ECPairFactory(ecc);
//     const network = bitcoin.networks.testnet;
//     var privateKey = Buffer.from(private_key, 'hex');
//     var keyPair = ECPair.fromPrivateKey(privateKey, { network: network });

//     const outputNumber = 0;
//     const txid = '9eac156e418ed1ca5ec4dbb539bc750a73a075dcb4a286bfc8e40b1cef40607d';
//     const amount = 0.00090502;

//     const psbt = new bitcoin.Psbt({network: network});
//     const minerFee = 10000;
//     const destinationAddress = 'mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB';
//     const outputAmount = amount*1e8 - minerFee;
//     const fullRawTransactionHex = '02000000000101c2add7b5dbe86fd8dd4fa8c420676c507bfa8a67b8423659209ade2b30140f170000000000fdffffff0286610100000000001976a9143d7c73abba50011192a02a618a46331d9288132388ac0ad04b2f000000001976a91484b860e19d5cd588a411fba64cda6909e97fb7f488ac0247304402200b19e0aba6e2e76c1de10ed0ce98198657b9caae984d96bf9ab847cd705d6e02022020dc0681db51c12aa83390672be4c716bfed7127a26778a70a838a537314c942012102b7194da20e99fb57a28f3affa5fd2f9c8b0ece1f5220aac040bb7696f8afb7955c4d2700'

//     psbt.addInput({hash: txid, index: outputNumber, nonWitnessUtxo: Buffer.from(fullRawTransactionHex, 'hex')});
//     psbt.addOutput({address: destinationAddress, value: outputAmount});
//     psbt.signInput(outputNumber, keyPair);
//     psbt.finalizeInput(0);
//     const rawTransaction = psbt.extractTransaction().toHex();

//     console.log(rawTransaction);
     
//     }