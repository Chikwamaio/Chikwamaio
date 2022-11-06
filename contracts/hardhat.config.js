require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = "0x3e23887f2b21d270d506cd242dfb46c728f995af36dba911373e6586cf1b74e3";
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://rpc.gnosischain.com`,
      accounts: [PRIVATE_KEY]
    }
  }
};
