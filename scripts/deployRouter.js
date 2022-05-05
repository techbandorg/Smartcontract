const { ethers } = require("hardhat");
const {verifyContract}  = require("../utills/verifyContract");

const factoryConfig = {
  feeToSetter: "0xF94AeE7BD5bdfc249746edF0C6Fc0F5E3c1DA226"
}

async function main() {
  const Factory = await ethers.getContractFactory("contracts/swaps/Factory.sol:Factory");
  const WBNB = await ethers.getContractFactory("contracts/swaps/WBNB.sol:WBNB");
  const SwapRouter = await ethers.getContractFactory("contracts/swaps/SwapRouter.sol:Router");

  console.log("deploy factory contract")
  const factory = await Factory.deploy(factoryConfig.feeToSetter);
  await factory.deployed();
  
  console.log("deploy wbnb contract")
  const wbnb = await WBNB.deploy();
  await wbnb.deployed();
  
  console.log("deploy router contract")
  const router = await SwapRouter.deploy(factory.address, wbnb.address);
  await router.deployed();
  
  console.log("Factory:", factory.address);
  console.log("WBNB:", wbnb.address);
  console.log("Router:", router.address);

  await verifyContract(factory.address, [factoryConfig.feeToSetter]);
  // await verifyContract(wbnb.address, []);
  await verifyContract(router.address, [factory.address, wbnb.address]);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });