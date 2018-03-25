pragma solidity ^0.4.18;

import "./ECTools.sol";

contract ECToolsTest {

	function recover(bytes32 _msg, bytes sig) public view returns (address) {
		return ECTools.recover(_msg, sig);
	}

	function recoverPref(bytes32 _msg, bytes sig) public view returns (address) {
		return ECTools.prefixedRecover(_msg, sig);
	}

}