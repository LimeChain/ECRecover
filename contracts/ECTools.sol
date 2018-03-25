pragma solidity ^0.4.18;

library ECTools {
  

  /**
   * @dev Recover signer address from a message by using his signature
   * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
   * @param sig bytes signature, the signature is generated using web3.eth.sign()
   */
  function recover(bytes32 hash, bytes sig) public view returns (address) {
    bytes32 r;
    bytes32 s;
    uint8 v;

    //Check the signature length
    if (sig.length != 65) {
      return (address(0));
    }

    // Divide the signature in r, s and v variables
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      return ecrecover(hash, v, r, s);
    }
  }

  // @dev Hashes the signed message
  function toEthereumSignedMessage(bytes32 _msg) public view returns (bytes32) {
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    return keccak256(prefix, _msg);
  }

  // @dev Converts a uint in a string
  function uintToString(uint _uint) public view returns (string str) {
    uint len = 0;
    uint m = _uint + 0;
    while (m != 0) {
      len++;
      m /= 10;
    }
    bytes memory b = new bytes(len);
    uint i = len - 1;
    while (_uint != 0) {
      uint remainder = _uint % 10;
      _uint = _uint / 10;
      b[i--] = byte(48 + remainder);
    }
    str = string(b);
  }

  function prefixedRecover(bytes32 _msg, bytes sig) public view returns (address) {
    bytes32 ethSignedMsg = toEthereumSignedMessage(_msg);
    return recover(ethSignedMsg, sig);
  }
}