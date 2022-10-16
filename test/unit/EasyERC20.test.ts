import { BigNumber } from "ethers"
import { assert, expect } from "chai"
import { EasyGanCoin } from "../../typechain-types"
import { deployments, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains, INITIAL_SUPPLY } from "../../helper-hardhat-config"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("EasyGanCoin Unit Test", () => {
          const multiplier = 10 ** 18
          let ganCoin: EasyGanCoin, deployer: SignerWithAddress, user1: SignerWithAddress
          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              user1 = accounts[1]

              await deployments.fixture("easy")
              ganCoin = await ethers.getContract("EasyGanCoin", deployer)
          })
          it("Gets deployed correctly", async () => {
              assert(ganCoin.address)
          })
          describe("Constructor", () => {
              it("Should have the correct INITIAL_SUPPLY of token", async () => {
                  const totalSupply: BigNumber = await ganCoin.totalSupply()
                  assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
              })
              it("Initialises with correct name and symbol", async () => {
                  const tokenName = (await ganCoin.name()).toString()
                  assert.equal(tokenName, "EGanCoin")
                  const symbol = (await ganCoin.symbol()).toString()
                  assert.equal(symbol, "EGAN")
              })
          })
          describe("Transfers", () => {
              it("Should be able to transfer tokens successfully to an address", async () => {
                  const tokensToSend = ethers.utils.parseEther("10")
                  await ganCoin.transfer(user1.address, tokensToSend)
                  expect((await ganCoin.balanceOf(user1.address)).toString()).to.equal(tokensToSend.toString())
              })
              it("Emits an transfer event when an transfer occurs", async () => {
                  expect(await ganCoin.transfer(user1.address, (10 * multiplier).toString())).to.emit(ganCoin, "Transfer")
              })
          })
          describe("Allowances", () => {
              const amount = (20 * multiplier).toString()
              it("Should approve an other address to spend the token", async () => {
                  const tokensToSpend = ethers.utils.parseEther("5")
                  await ganCoin.approve(user1.address, tokensToSpend)
                  const ganCoin1 = await ethers.getContract("EasyGanCoin", user1)
                  await ganCoin1.transferFrom(deployer.address, user1.address, tokensToSpend)
                  expect(await ganCoin1.balanceOf(user1.address).to.equal(tokensToSpend))
              })
              it("Doesn't allow an unapproved member to make transfers", async () => {
                  const playerToken = await ethers.getContract("EasyGanCoin", user1)
                  await expect(playerToken.transferFrom(deployer, user1, amount)).to.be.revertedWith("ERC20: Insufficient Allowance")
              })
              it("Emits an approval event, when an approval occurs", async () => {
                  await expect(ganCoin.approve(user1.address, amount)).to.emit(ganCoin, "Approval")
              })
              it("The allowance being set is secure", async () => {
                  await ganCoin.approve(user1.address, amount)
                  const allowance = await ganCoin.allowance(deployer.address, user1.address)
                  assert.equal(allowance.toString(), amount)
              })
          })
      })
