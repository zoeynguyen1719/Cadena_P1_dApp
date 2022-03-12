const hre = require("hardhat");

async function main() {

  const [owner] = await hre.ethers.getSigners();
  const WalletContractFactory = await hre.ethers.getContractFactory("wallet");
  const WalletContract = await WalletContractFactory.deploy();
  await WalletContract.deployed();

  console.log("WalletContract deployed to:", WalletContract.address);
  console.log("WalletContract owner address:", owner.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
