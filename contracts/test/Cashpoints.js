const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, assert } = require("chai");

describe("Cashpoints", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCashpointsContract() {
    
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const initialSupply = 10000;
    const Cashpoints = await ethers.getContractFactory("CashPoints");
    const cashpoints = await Cashpoints.deploy();

    return { cashpoints, owner, otherAccount, initialSupply };

  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { cashpoints, owner } = await loadFixture(deployCashpointsContract);
      expect(await cashpoints.Owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply of tokens to the owner", async function () {
      
      const { cashpoints, owner } = await loadFixture(deployCashpointsContract);
      const ownerBalance = await cashpoints.balanceOf(owner.address);
      expect(await cashpoints.totalSupply()).to.equal(ownerBalance);
    });

  
  });

  describe("Transactions", function () {

    it("Should fail if a holder tries to withdraw when there is no value in contract", async function () {
      const { cashpoints, owner, otherAccount } = await loadFixture(deployCashpointsContract);
      await expect(cashpoints.connect(owner).withdraw(20)).to.be.revertedWith('There is no value in this contract');
    })

    it("Should fail if a non-holder tries to withdraw", async function () {
      const { cashpoints, otherAccount } = await loadFixture(deployCashpointsContract);
      await expect(cashpoints.connect(otherAccount).withdraw(20)).to.be.revertedWith('Not holder');
    })

    it("Should emit event when funds received", async function () {
      const { cashpoints, owner, otherAccount } = await loadFixture(deployCashpointsContract);
      await expect(
      otherAccount.sendTransaction({ to: cashpoints.address, value: 1000 })
      ).to.emit(cashpoints, "Received")
    })

    it("Should receive funds", async function () {
      const { cashpoints, owner, otherAccount } = await loadFixture(deployCashpointsContract);

      await expect(
      otherAccount.sendTransaction({ to: cashpoints.address, value: 1000 })
      ).to.changeEtherBalance(cashpoints.address, 1000);
    })

    it("Should fail to setPrice if there are no funds in the contract", async function () {
      const { cashpoints, owner, otherAccount } = await loadFixture(deployCashpointsContract);;
      await expect(cashpoints.setPrice()).to.be.revertedWith('There is no value in this contract');
    })

    it('Should set the price correctly', async function () {
      const { cashpoints, owner, otherAccount, initialSupply } = await loadFixture(deployCashpointsContract);
      const amount = ethers.utils.parseUnits("0.5", "ether");
      
      await otherAccount.sendTransaction({ to: cashpoints.address, value: amount });
      
      await cashpoints.setPrice();
      const newPrice = await cashpoints.PRICE_PER_TOKEN();
      const price = amount/initialSupply;
      assert.equal(newPrice,price);
    })

    it('Allow only holder to withdraw all funds', async function () {
      const { cashpoints, owner, otherAccount } = await loadFixture(deployCashpointsContract);
      const amount = ethers.utils.parseUnits("10", "ether");
      
      await otherAccount.sendTransaction({ to: cashpoints.address, value: amount });
      
      await expect(cashpoints.connect(owner).withdraw(amount)).to.changeEtherBalance(cashpoints.address, ethers.utils.parseUnits("-10", "ether"));
      expect(await cashpoints.totalSupply()).to.equal(0);

    })

    it('Should fail if holder tries to withdraw more than their stake', async function () {
      const { cashpoints, owner, otherAccount } = await loadFixture(deployCashpointsContract);
      const amount = ethers.utils.parseUnits("2", "ether");
      
      await otherAccount.sendTransaction({ to: cashpoints.address, value: amount });
      await expect(cashpoints.connect(owner).withdraw(ethers.utils.parseUnits("2.1", "ether"))).to.be.revertedWith('You are trying to withdraw more than your stake');
    })


    it("Should fail user tries to send the wrong amount for tokens", async function () {
      const { cashpoints, owner, otherAccount } = await loadFixture(deployCashpointsContract);
      const amount = ethers.utils.parseUnits("2", "ether");
      await otherAccount.sendTransaction({ to: cashpoints.address, value: amount });
      await expect(cashpoints.connect(otherAccount).buyTokens(20, { value: ethers.utils.parseUnits("2", "ether")})).to.be.revertedWith('You are sending the wrong amount to this contract');
    })

    it("Should let user buy tokens if there is value in the contract", async function () {
      const { cashpoints, owner, otherAccount, initialSupply } = await loadFixture(deployCashpointsContract);
      const newtokens = 90000;
      const amount = ethers.utils.parseUnits("10", "ether");
      
      await otherAccount.sendTransaction({ to: cashpoints.address, value: amount });
      
      await cashpoints.setPrice();
      const newPrice = await cashpoints.PRICE_PER_TOKEN();
      let cost = ethers.utils.formatEther(newPrice) * newtokens;
      const buyTokens = cashpoints.connect(otherAccount).buyTokens(newtokens, { value: ethers.utils.parseUnits(cost.toString(), "ether")});
      await expect(buyTokens).to.changeTokenBalance(
        cashpoints,
        otherAccount,
        newtokens
      );
      const totalSupply = await cashpoints.totalSupply();
      const contractBalance = await ethers.provider.getBalance(cashpoints.address);
      assert.equal( totalSupply, initialSupply + newtokens);
      assert.equal(ethers.utils.formatEther(contractBalance), parseInt(ethers.utils.formatEther(amount)) + cost);
    });



  })
});
