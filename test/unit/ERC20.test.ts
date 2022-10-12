import { BigNumber } from "ethers"
import { assert, expect } from "chai"
import { GanCoin } from "../../typechain-types"
import { deployments, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains, INITIAL_SUPPLY } from "../../helper-hardhat-config"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("GanCoin Unit Test", () => {
          let ganCoin: GanCoin, deployer: SignerWithAddress, user1: SignerWithAddress
          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              user1 = accounts[1]

              await deployments.fixture("all")
              ganCoin = await ethers.getContract("GanCoin", deployer)
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
                  assert.equal(tokenName, "GanCoin")
                  const symbol = (await ganCoin.symbol()).toString()
                  assert.equal(symbol, "GAN")
              })
          })
          describe("Transfers", () => {
              it("Should be able to transfer tokens successfully to an address", async function () {
                  const tokensToSend = ethers.utils.parseEther("10")
                  await ganCoin.transfer(user1.address, tokensToSend)
                  expect((await ganCoin.balanceOf(user1.address)).toString()).to.equal(tokensToSend.toString())
              })
              it("Should approve other address to spend token", async () => {
                  const tokensToSpend = ethers.utils.parseEther("5")
                  await ganCoin.approve(user1.address, tokensToSpend)
                  const ganCoin1 = await ethers.getContract("GanCoin", user1)
                  await ganCoin1.transferFrom(deployer.address, user1.address, tokensToSpend)
                  expect((await ganCoin1.balanceOf(user1.address)).toString()).to.equal(tokensToSpend.toString())
              })
          })
      })
