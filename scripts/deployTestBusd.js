const { ethers } = require("hardhat");
const {verifyContract}  = require("../utills/verifyContract");

const busdTokenConfig = {
  name: "BUSD",
  symbol: "BUSD",
  decimals: "18",
  totalSupply: "100000000000000000000000000"
}

async function main() {
  const BUSD = await ethers.getContractFactory("contracts/tokens/Busd.sol:BUSD");

  console.log("deploy BUSD token")
  const busd = await BUSD.deploy(
    busdTokenConfig.name,
    busdTokenConfig.symbol,
    busdTokenConfig.decimals,
    busdTokenConfig.totalSupply,
  );
  await busd.deployed();
  
  console.log("BUSD:", busd.address);

  // await verifyContract(busd.address, [
  //   busdTokenConfig.name,
  //   busdTokenConfig.symbol,
  //   busdTokenConfig.decimals,
  //   busdTokenConfig.totalSupply,
  // ]);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });