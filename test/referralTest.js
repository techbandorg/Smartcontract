const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  delay,
  nowInSeconds
} = require("../utills/timeHelpers");

const MAX_UINT = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
const sevenDays = 7 * 24 * 60 * 60;

describe("ReferalProgramUsers and RefferalLockStaking Contracts", () => {
  const { provider } = ethers;

  const setup = async () => {
    const accounts = await ethers.getSigners();
    const TBT = await ethers.getContractFactory("TechBandToken");
    const techBandToken = await TBT.deploy("TechBand Token", "TBT","18", "100000000000000000000000000");
    const ReferralPreogramUsers = await ethers.getContractFactory("ReferralProgramUsers");
    const referralProgramUsers = await ReferralPreogramUsers.deploy(accounts[0].address);
  
    const ReferralStaking = await ethers.getContractFactory("ReferralLockStaking");
    const referralStaking = await ReferralStaking.deploy(
      techBandToken.address,
      referralProgramUsers.address,
      100,
      120,
      5,
      5,
      3600
    )

    await techBandToken.approve(referralStaking.address, MAX_UINT)
    await techBandToken.transfer(referralStaking.address, ethers.utils.parseEther("1000000"))

    for(let i = 1; i <= 18; i++) {
      await techBandToken.transfer(accounts[i].address,ethers.utils.parseEther("10000") )
      await accounts[i].sendTransaction({
        to: accounts[0].address,
        value: ethers.utils.parseEther("9000")
      });
    }

    return {techBandToken, referralProgramUsers,referralStaking, accounts };
  };

  it("Tests for Referral Staking and Referral Registration", async () => {
    const { techBandToken, accounts, referralProgramUsers, referralStaking } = await setup();
    const stakeAmount = ethers.utils.parseEther("1000");
    //register in referral program 
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
    await referralProgramUsers.connect(accounts[18]).registerBySponsorAddress(accounts[16].address)

    let userId1 = await referralProgramUsers.userIdByAddress(accounts[1].address)
    let userId2 = await referralProgramUsers.userIdByAddress(accounts[2].address)
    let userId3 = await referralProgramUsers.userIdByAddress(accounts[3].address)
    let userId4 = await referralProgramUsers.userIdByAddress(accounts[4].address)
    let userId5 = await referralProgramUsers.userIdByAddress(accounts[5].address)
    let userId6 = await referralProgramUsers.userIdByAddress(accounts[6].address)
    let userId7 = await referralProgramUsers.userIdByAddress(accounts[7].address)
    let userId8 = await referralProgramUsers.userIdByAddress(accounts[8].address)
    let userId9 = await referralProgramUsers.userIdByAddress(accounts[9].address)
    let userId10 = await referralProgramUsers.userIdByAddress(accounts[10].address)

    expect(++userId1).to.be.greaterThan(0)
    expect(++userId2).to.be.greaterThan(0)
    expect(++userId3).to.be.greaterThan(0)
    expect(++userId4).to.be.greaterThan(0)
    expect(++userId5).to.be.greaterThan(0)
    expect(++userId6).to.be.greaterThan(0)
    expect(++userId7).to.be.greaterThan(0)
    expect(++userId8).to.be.greaterThan(0)
    expect(++userId9).to.be.greaterThan(0)
    expect(++userId10).to.be.greaterThan(0)

    let userSponsor = await referralProgramUsers.userSponsorByAddress(accounts[4].address);
    expect(userSponsor).to.be.equal(userId1)

    //balance
    let tbtBalance1 = await techBandToken.balanceOf(accounts[1].address)
    let tbtBalance2 = await techBandToken.balanceOf(accounts[2].address)
    let tbtBalance3 = await techBandToken.balanceOf(accounts[3].address)
    let tbtBalance4 = await techBandToken.balanceOf(accounts[4].address)
    let tbtBalance5 = await techBandToken.balanceOf(accounts[5].address)
    let tbtBalance6 = await techBandToken.balanceOf(accounts[6].address)
    let tbtBalance7 = await techBandToken.balanceOf(accounts[7].address)
    let tbtBalance8 = await techBandToken.balanceOf(accounts[8].address)
    let tbtBalance9 = await techBandToken.balanceOf(accounts[9].address)
    let tbtBalance10 = await techBandToken.balanceOf(accounts[10].address)

    for(let i = 1; i <= 10; i++) {
      await techBandToken.connect(accounts[i]).approve(referralStaking.address, MAX_UINT)
      await referralStaking.connect(accounts[i]).stake(stakeAmount)
    }
    
    let tbtBalance1After = await techBandToken.balanceOf(accounts[1].address)
    let tbtBalance2After = await techBandToken.balanceOf(accounts[2].address)
    let tbtBalance3After = await techBandToken.balanceOf(accounts[3].address)
    let tbtBalance4After = await techBandToken.balanceOf(accounts[4].address)
    let tbtBalance5After = await techBandToken.balanceOf(accounts[5].address)
    let tbtBalance6After = await techBandToken.balanceOf(accounts[6].address)
    let tbtBalance7After = await techBandToken.balanceOf(accounts[7].address)
    let tbtBalance8After = await techBandToken.balanceOf(accounts[8].address)
    let tbtBalance9After = await techBandToken.balanceOf(accounts[9].address)
    let tbtBalance10After = await techBandToken.balanceOf(accounts[10].address)

    expect(++tbtBalance1).to.be.greaterThan(++tbtBalance1After);
    expect(++tbtBalance2).to.be.greaterThan(++tbtBalance2After);
    expect(++tbtBalance3).to.be.greaterThan(++tbtBalance3After);
    expect(++tbtBalance4).to.be.greaterThan(++tbtBalance4After);
    expect(++tbtBalance5).to.be.greaterThan(++tbtBalance5After);
    expect(++tbtBalance6).to.be.greaterThan(++tbtBalance6After);
    expect(++tbtBalance7).to.be.greaterThan(++tbtBalance7After);
    expect(++tbtBalance8).to.be.greaterThan(++tbtBalance8After);
    expect(++tbtBalance9).to.be.greaterThan(++tbtBalance9After);
    expect(++tbtBalance10).to.be.greaterThan(++tbtBalance10After);

    expect(++tbtBalance1After).to.be.greaterThan(tbtBalance1 - stakeAmount)
    expect(++tbtBalance2After).to.be.greaterThan(tbtBalance2 - stakeAmount)
    expect(++tbtBalance3After).to.be.greaterThan(tbtBalance3 - stakeAmount)
    expect(++tbtBalance4After).to.be.greaterThan(tbtBalance4 - stakeAmount)
    expect(++tbtBalance5After).to.be.greaterThan(tbtBalance5 - stakeAmount)
    expect(++tbtBalance6After).to.be.greaterThan(tbtBalance6 - stakeAmount)
    expect(++tbtBalance7After).to.be.greaterThan(tbtBalance7 - stakeAmount)
    expect(++tbtBalance8After).to.be.greaterThan(tbtBalance8 - stakeAmount)
    expect(++tbtBalance9After).to.be.greaterThan(tbtBalance9 - stakeAmount)
    expect(++tbtBalance10After).to.be.greaterThan(tbtBalance10 - stakeAmount)

    await ethers.provider.send('evm_increaseTime', [sevenDays]);

    let earnedAccount1 = await referralStaking.earned(accounts[1].address)
    let earnedAccount2 = await referralStaking.earned(accounts[2].address)
    let earnedAccount3 = await referralStaking.earned(accounts[3].address)
    let earnedAccount4 = await referralStaking.earned(accounts[4].address)
    let earnedAccount5 = await referralStaking.earned(accounts[5].address)
    let earnedAccount6 = await referralStaking.earned(accounts[6].address)
    let earnedAccount7 = await referralStaking.earned(accounts[7].address)
    let earnedAccount8 = await referralStaking.earned(accounts[8].address)
    let earnedAccount9 = await referralStaking.earned(accounts[9].address)
    let earnedAccount10 = await referralStaking.earned(accounts[10].address)

    expect(++earnedAccount1).to.be.greaterThan(0);
    expect(++earnedAccount2).to.be.greaterThan(0);
    expect(++earnedAccount3).to.be.greaterThan(0);
    expect(++earnedAccount4).to.be.greaterThan(0);
    expect(++earnedAccount5).to.be.greaterThan(0);
    expect(++earnedAccount6).to.be.greaterThan(0);
    expect(++earnedAccount7).to.be.greaterThan(0);
    expect(++earnedAccount8).to.be.greaterThan(0);
    expect(++earnedAccount9).to.be.greaterThan(0);
    expect(++earnedAccount10).to.be.greaterThan(0);

    const userStakingInfo1 = await referralStaking.userStakingInfo(accounts[1].address);

    const userNonce1 = await referralStaking.stakeNonces(accounts[1].address);
    const userNonce2 = await referralStaking.stakeNonces(accounts[2].address);
    const userNonce3 = await referralStaking.stakeNonces(accounts[3].address);
    const userNonce4 = await referralStaking.stakeNonces(accounts[4].address);
    const userNonce5 = await referralStaking.stakeNonces(accounts[5].address);
    const userNonce6 = await referralStaking.stakeNonces(accounts[6].address);
    const userNonce7 = await referralStaking.stakeNonces(accounts[7].address);
    const userNonce8 = await referralStaking.stakeNonces(accounts[8].address);
    const userNonce9 = await referralStaking.stakeNonces(accounts[9].address);
    const userNonce10 = await referralStaking.stakeNonces(accounts[10].address);


    for(i = 1; i <= 10; i++) {
      let userNonce = await referralStaking.stakeNonces(accounts[i].address)
      expect(userNonce).to.be.equal("1");
      await referralStaking.connect(accounts[i]).withdrawAndGetReward(0)
    }

    let tbtBalance1AfterWithdraw = await techBandToken.balanceOf(accounts[1].address)
    let tbtBalance2AfterWithdraw = await techBandToken.balanceOf(accounts[2].address)
    let tbtBalance3AfterWithdraw = await techBandToken.balanceOf(accounts[3].address)
    let tbtBalance4AfterWithdraw = await techBandToken.balanceOf(accounts[4].address)
    let tbtBalance5AfterWithdraw = await techBandToken.balanceOf(accounts[5].address)
    let tbtBalance6AfterWithdraw = await techBandToken.balanceOf(accounts[6].address)
    let tbtBalance7AfterWithdraw = await techBandToken.balanceOf(accounts[7].address)
    let tbtBalance8AfterWithdraw = await techBandToken.balanceOf(accounts[8].address)
    let tbtBalance9AfterWithdraw = await techBandToken.balanceOf(accounts[9].address)
    let tbtBalance10AfterWithdraw = await techBandToken.balanceOf(accounts[10].address)

    expect(tbtBalance1AfterWithdraw -tbtBalance1).to.be.greaterThan(0);
    expect(tbtBalance2AfterWithdraw -tbtBalance2).to.be.greaterThan(0);
    expect(tbtBalance3AfterWithdraw -tbtBalance3).to.be.greaterThan(0);
    expect(tbtBalance4AfterWithdraw -tbtBalance4).to.be.greaterThan(0);
    expect(tbtBalance5AfterWithdraw -tbtBalance5).to.be.greaterThan(0);
    expect(tbtBalance6AfterWithdraw -tbtBalance6).to.be.greaterThan(0);
    expect(tbtBalance7AfterWithdraw -tbtBalance7).to.be.greaterThan(0);
    expect(tbtBalance8AfterWithdraw -tbtBalance8).to.be.greaterThan(0);
    expect(tbtBalance9AfterWithdraw -tbtBalance9).to.be.greaterThan(0);
    expect(tbtBalance10AfterWithdraw -tbtBalance10).to.be.greaterThan(0);
  });
});
