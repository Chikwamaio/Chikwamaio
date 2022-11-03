require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = "YOUR MAINNET PRIVATE KEY";
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://rpc.gnosischain.com`,
      accounts: [PRIVATE_KEY]
    }
  }
};
