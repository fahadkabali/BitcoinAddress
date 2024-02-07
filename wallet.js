const bitcoin = require('bitcoinjs-lib')
const ECPairFactory = require('ecpair').default
const ecc = require('tiny-secp256k1')
const ECPair = ECPairFactory(ecc)
const network = bitcoin.networks.testnet

async function createP2PKHwallet() {
    try {
        const keyPair = ECPair.makeRandom({ network })
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
        const privateKey = keyPair.toWIF()
        console.log(`| Public Address | ${address} |`)
        console.log(`| Private Key     | ${privateKey}  |`)
        return keyPair
    } catch (error) {
        console.error(error)
    }
}


async function createAndSignTransaction() {
    const keyPair = await createP2PKHwallet();

    const outputNumber = 1
    const txid = '87b8de75a774de78d2d4422cade09e44c8f7523582ec3e4fcda163558221d9f7';
    const amount = 0.00096896;
    const txHex = '02000000000101a5b8352ad24bb6da875865d55f509bf8db19119e6024cc6e248fe6285d5bb0970000000000fdffffff02a2beb4f6000000001976a914be6f790a7ae331f90b0547db5c640b90ec6ae17688ac807a0100000000001976a91485b34bd47a915901ea6878fb91d7d79bfaea51de88ac0247304402206d514a6055940254afbe3960e080f68502a8a4536b62379f32703acab2527020022004a17e9bbc735419c5873cdf0ef27539158291ee9eb10e0404b36fee71f4c3af01210347f0ba160b1ac0b417344c7eb5ff6da1a76528fa0a887a1251039ab90ae0ea9b25502700';

    const tx = bitcoin.Transaction.fromHex(txHex);

    const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });

    const pubkey = keyPair.publicKey;
    const p2pkh = bitcoin.payments.p2pkh({ pubkey });
    const address = p2pkh.address;
	
    psbt.addInput({
        hash: txid,
        index: outputNumber,
        nonWitnessUtxo: Buffer.from(txHex, 'hex')
    });

    const destinationAddress = 'mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB';
    const minerFee = 10000;
    const outputAmount = Math.floor(amount * 1e8) - minerFee;

    psbt.addOutput({
        address: destinationAddress,
        value: outputAmount
    });

    psbt.signInput(0, keyPair);

    psbt.finalizeAllInputs();

    const finalTxHex = psbt.extractTransaction().toHex();
    console.log(`Final Transaction Hex: ${finalTxHex}`);
}

createAndSignTransaction();




