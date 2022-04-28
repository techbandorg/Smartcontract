const { ethers } = require("hardhat");
const {verifyContract}  = require("../utills/verifyContract");

const lockStakingConfig = {
  token: "0x5f20559235479F5B6abb40dFC6f55185b74E7b55",
  rewardRate: 100,
  lockDuration: 3600
}

async function main() {
  const LockStaking = await ethers.getContractFactory("contracts/staking/LockStakingFixedAPY.sol:LockStakingFixedAPY");


  console.log("deploy LockStakingFixedAPY contract")
  const lockStaking = await LockStaking.deploy(
    lockStakingConfig.token, 
    lockStakingConfig.rewardRate, 
    lockStakingConfig.lockDuration
  );
  await lockStaking.deployed();
  
  
  console.log("LockStakingFixedAPY:", lockStaking.address);
  

  await verifyContract(lockStaking.address, [
    lockStakingConfig.token, 
    lockStakingConfig.rewardRate, 
    lockStakingConfig.lockDuration
  ]);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });