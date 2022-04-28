const { ethers } = require("hardhat");
const {verifyContract}  = require("../utills/verifyContract");

const stakingConfig = {
  token: "0x5f20559235479F5B6abb40dFC6f55185b74E7b55",
  rewardRate: 100,
}

async function main() {
  const Staking = await ethers.getContractFactory("contracts/staking/StakingFixedAPY.sol:StakingFixedAPY");

  console.log("deploy StakingFixedAPY contract")
  const staking = await Staking.deploy(
    stakingConfig.token, 
    stakingConfig.rewardRate
  );
  await staking.deployed();
  
  console.log("StakingFixedAPY:", staking.address);

  await verifyContract(staking.address, [
    stakingConfig.token, 
    stakingConfig.rewardRate
  ]);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });