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
    const Staking = await ethers.getContractFactory("LockStakingFixedAPY");
    const staking = await Staking.deploy(techBandToken.address, 100, 3600 )
    const ReferralPreogramUsers = await ethers.getContractFactory("ReferralProgramUsers");
    const referralProgramUsers = await ReferralPreogramUsers.deploy(accounts[0].address);
    const RefferalProgramLogic = await ethers.getContractFactory("ReferralProgramLogic");
    const refferalLogic = await RefferalProgramLogic.deploy(referralProgramUsers.address, techBandToken.address)
    
  
    const Router = await ethers.getContractFactory("Router");
    const router = await Router.deploy(factory.address, wbnb.address);
    
    await techBandToken.transfer(refferalLogic.address, ethers.utils.parseEther("1000000"))
    await techBandToken.transfer(staking.address, ethers.utils.parseEther("100000"))
    let balanceTBTinRef = await techBandToken.balanceOf(refferalLogic.address);
    console.log(balanceTBTinRef/10**18)
    let balanceTBTinStaking = await techBandToken.balanceOf(staking.address);
    console.log(balanceTBTinStaking.toString())
   

    // const bytecode = `${pairBytecode.bytecode}`
    // const create2Address = getCreate2Address(factory.address, [techBandToken.address, busd.address], bytecode)
    // let  b = await factory.createPair(techBandToken.address, wbnb.address);
    // const pr = await factory.getPair(techBandToken.address, wbnb.address);
    // const airCodeHash = await factory.pairCodeHash();
    // console.log(airCodeHash, 'oooooo')
    // console.log(pr, 'sddsdssdsdsd')
    // console.log(b)
    // console.log(create2Address)

    for(let i = 1; i <= 19; i++) {
      await techBandToken.transfer(accounts[i].address,ethers.utils.parseEther("10000") )
      await accounts[i].sendTransaction({
        to: accounts[0].address,
        value: ethers.utils.parseEther("9000")
      });
    }

    // for(let i = 1; i <= 19; i++) {
    //   await accounts[i].sendTransaction({
    //     to: accounts[0].address,
    //     value: ethers.utils.parseEther("9000")
    //   });
    // }

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
    await refferalLogic.updateStakingPoolAdd(staking.address);
    await refferalLogic.updateSwapToken(wbnb.address);

    // await refferalLogic.u
    // const userFirstID = await referralProgramUsers.registerUser(accounts[1].address, 0);
    await referralProgramUsers.connect(accounts[1]).register();
    //first line
    await referralProgramUsers.connect(accounts[2]).registerBySponsorAddress(accounts[1].address);
    await referralProgramUsers.connect(accounts[3]).registerBySponsorAddress(accounts[1].address);
    //second line 
    await referralProgramUsers.connect(accounts[4]).registerBySponsorAddress(accounts[2].address);
    await referralProgramUsers.connect(accounts[5]).registerBySponsorAddress(accounts[2].address);
    await referralProgramUsers.connect(accounts[6]).registerBySponsorAddress(accounts[3].address);
    await referralProgramUsers.connect(accounts[7]).registerBySponsorAddress(accounts[3].address);
    // third line
    await referralProgramUsers.connect(accounts[8]).registerBySponsorAddress(accounts[4].address);
    await referralProgramUsers.connect(accounts[9]).registerBySponsorAddress(accounts[5].address);
    await referralProgramUsers.connect(accounts[10]).registerBySponsorAddress(accounts[6].address);
    await referralProgramUsers.connect(accounts[11]).registerBySponsorAddress(accounts[7].address);
    //fourth line
    await referralProgramUsers.connect(accounts[12]).registerBySponsorAddress(accounts[8].address);
    await referralProgramUsers.connect(accounts[13]).registerBySponsorAddress(accounts[9].address);
    await referralProgramUsers.connect(accounts[14]).registerBySponsorAddress(accounts[10].address);
    await referralProgramUsers.connect(accounts[15]).registerBySponsorAddress(accounts[11].address);
    // fifth line
    await referralProgramUsers.connect(accounts[16]).registerBySponsorAddress(accounts[12].address);
    await referralProgramUsers.connect(accounts[17]).registerBySponsorAddress(accounts[13].address);
    
    // sixth line 
    await referralProgramUsers.connect(accounts[18]).registerBySponsorAddress(accounts[16].address);
    await referralProgramUsers.connect(accounts[19]).registerBySponsorAddress(accounts[17].address);


    for(let i = 1; i <= 19; i++) {
      await techBandToken.connect(accounts[i]).approve(staking.address, MAX_UINT)
      await staking.connect(accounts[i]).stake(ethers.utils.parseEther("200"))
    }

    const user1 = await referralProgramUsers.userIdByAddress(accounts[1].address)
    const user2 = await referralProgramUsers.userIdByAddress(accounts[2].address)
    const user9 = await referralProgramUsers.userIdByAddress(accounts[9].address)
    const user10 = await referralProgramUsers.userIdByAddress(accounts[10].address)
    // await referralProgramUsers.connect(accounts[3]).registerBySponsorId(user2);
    const sponsor = await referralProgramUsers.userSponsor(user1);
    const refs = await referralProgramUsers.getUserReferralss(accounts[1].address)
    console.log(refs.toString() ,' refs')
    console.log(sponsor.toString())
    await refferalLogic.connect(accounts[10]).recordFee(techBandToken.address, accounts[10].address, ethers.utils.parseEther("100000")) 

    
    // for(let i = 2; i <= 19; i++) {
      // let balance
      await refferalLogic.distributeEarnedFeess(techBandToken.address, user10) 
      // 
    // }
   
    // for(let i = 1; i <= 19; i++) {
    await ethers.provider.send('evm_increaseTime', [3600]);
    let und = await refferalLogic.undistributedFees(techBandToken.address, user9)
    console.log(und.toString(), 'addddadadadadada')
    return {techBandToken, busd, accounts };
  };

  it("receives BNB correctly", async () => {
    const { techBandToken,busd, accounts } = await setup();
    // console.log(techBandToken)
    let bal1 = await accounts[0].getBalance();
    let tbtBal = await techBandToken.balanceOf(accounts[0].address)
    let busdBal = await busd.balanceOf(accounts[0].address)
    console.log(bal1.toString())
    console.log(tbtBal.toString()/10**18)
    console.log(busdBal.toString()/10**18)
  });
});
