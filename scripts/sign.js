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

	const hashMsg = utils.solidityKeccak256(['string'], [message]);
	var hashData = ethers.utils.arrayify(hashMsg);
	const signature = wallet.signMessage(hashData);

	const testContract = new ethers.Contract(contractAddress, contractABI, wallet);
	const result = await testContract.recover(hashMsg, signature);

	console.log('local verify: ', Wallet.verifyMessage(hashData, signature));
	console.log('remote verify: ', result);

})()