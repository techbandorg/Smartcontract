const { ethers } = require("hardhat");
const {verifyContract}  = require("../utills/verifyContract");

const techBandTokenConfig = {
  name: "TechBand Token",
  symbol: "TBT",
  decimals: "18",
  totalSupply: "100000000000000000000000000"
}

async function main() {
  const TBT = await ethers.getContractFactory("contracts/tokens/Tbt.sol:TechBandToken");

  console.log("deploy TechBandToken contract")
  const tbt = await TBT.deploy(
    techBandTokenConfig.name,
    techBandTokenConfig.symbol,
    techBandTokenConfig.decimals,
    techBandTokenConfig.totalSupply,
  );
  await tbt.deployed();
  
  console.log("TechBandToken:", tbt.address);

  // await verifyContract(tbt.address, [
  //   techBandTokenConfig.name,
  //   techBandTokenConfig.symbol,
  //   techBandTokenConfig.decimals,
  //   techBandTokenConfig.totalSupply,
  // ]);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });