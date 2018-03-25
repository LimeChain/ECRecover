const ethers = require('ethers');
const providers = ethers.providers;
const Wallet = ethers.Wallet;
const utils = ethers.utils;
const contractABI = require('../build/contracts/ECToolsTest.json').abi;

var provider;

(async function () {

	if (process.argv.length < 5) {
		throw new Error('Invalid arguments');
	}

	const privateKey = process.argv[2];
	const message = process.argv[3];
	const contractAddress = process.argv[4];

	const localNodeProvider = new providers.JsonRpcProvider('http://localhost:8545', providers.networks.unspecified);
	provider = new providers.FallbackProvider([
		localNodeProvider
	]);

	const wallet = new Wallet('0x' + privateKey);

	wallet.provider = provider;

	var utf8bytesMessage = utils.toUtf8Bytes(message);

	const hashMsg = utils.sha256(utf8bytesMessage);

	const sig = wallet.signMessage(hashMsg);
	console.log(sig);

	const testContract = new ethers.Contract(contractAddress, contractABI, wallet);

	const result = await testContract.recover(hashMsg, sig);

	console.log('local verify: ', Wallet.verifyMessage(utils.toUtf8Bytes(hashMsg), sig));

	console.log('remote verify: ', result);

})()