const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  delay,
  nowInSeconds
} = require("../utills/timeHelpers");
const {getCreate2Address} = require("../utills/pair")
const pairBytecode = require("../artifacts/contracts/swaps/Factory.sol/Pair.json")

const MAX_UINT = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

describe("ReferalProgram", () => {
  const { provider } = ethers;

  const setup = async () => {
    const accounts = await ethers.getSigners();
    const TBT = await ethers.getContractFactory("TechBandToken");
    const techBandToken = await TBT.deploy("TechBand Token", "TBT","18", "100000000000000000000000000");
    const BUSD = await ethers.getContractFactory("BUSD")
    const busd = await BUSD.deploy("BUSD", "BUSD","18", "100000000000000000000000000")
    const Factory = await ethers.getContractFactory("Factory");
    const factory = await Factory.deploy(accounts[0].address);
    const WBNB = await ethers.getContractFactory("WBNB");
    const wbnb = await WBNB.deploy();
    const ReferralPreogramUsers = await ethers.getContractFactory("ReferralProgramUsers");
    const referralProgramUsers = await ReferralPreogramUsers.deploy(accounts[0].address);
    const RefferalProgramLogic = await ethers.getContractFactory("ReferralProgramLogic");
    const refferalLogic = await RefferalProgramLogic.deploy(referralProgramUsers.address, techBandToken.address)
    
  
    const Router = await ethers.getContractFactory("Router");
    const router = await Router.deploy(factory.address, wbnb.address);
    
    await techBandToken.transfer(refferalLogic.address, ethers.utils.parseEther("100000"))
    let balanceTBTinRef = await techBandToken.balanceOf(refferalLogic.address);
    console.log(balanceTBTinRef/10**18)
   

    // const bytecode = `${pairBytecode.bytecode}`
    // const create2Address = getCreate2Address(factory.address, [techBandToken.address, busd.address], bytecode)
    // let  b = await factory.createPair(techBandToken.address, wbnb.address);
    // const pr = await factory.getPair(techBandToken.address, wbnb.address);
    // const airCodeHash = await factory.pairCodeHash();
    // console.log(airCodeHash, 'oooooo')
    // console.log(pr, 'sddsdssdsdsd')
    // console.log(b)
    // console.log(create2Address)

    for(let i = 1; i <= 15; i++) {
      await accounts[i].sendTransaction({
        to: accounts[0].address,
        value: ethers.utils.parseEther("9000")
      });
    }

    await busd.approve(router.address, MAX_UINT)
    await techBandToken.approve(router.address, MAX_UINT)
    await factory.createPair(techBandToken.address, wbnb.address)
    const info = await router.addLiquidityBNB(
      techBandToken.address,
      ethers.utils.parseEther("400000"),
      0,
      0,
      accounts[0].address,
      (nowInSeconds() + 1000).toString(), {
        value: ethers.utils.parseEther("400")
      }
    );

    await refferalLogic.updateSwapRouter(router.address);
    await refferalLogic.u
    const userFirstID = await referralProgramUsers.registerUser(accounts[1].address, 0);
    
    await referralProgramUsers.connect(accounts[2]).register();
    const user2 = await referralProgramUsers.userIdByAddress(accounts[2].address)
    await referralProgramUsers.connect(accounts[3]).registerBySponsorId(user2);

    return {techBandToken, busd, accounts };
  };

  it("receives BNB correctly", async () => {
    const { techBandToken,busd, accounts } = await setup();
    // console.log(techBandToken)
    let bal1 = await accounts[0].getBalance();
    let tbtBal = await techBandToken.balanceOf(accounts[0].address)
    let busdBal = await busd.balanceOf(accounts[0].address)
    console.log(bal1.toString()/10**18)
    console.log(tbtBal.toString()/10**18)
    console.log(busdBal.toString()/10**18)
  });
});
