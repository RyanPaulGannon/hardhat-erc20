import { BigNumber } from "ethers"
import { assert, expect } from "chai"
import { GanCoin } from "../../typechain-types"
import { deployments, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains, INITIAL_SUPPLY } from "../../helper-hardhat-config"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("GanCoin Unit Test", () => {
          const multiplier = 10 ** 18
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
              it("Should be able to transfer tokens successfully to an address", async () => {
                  const tokensToSend = ethers.utils.parseEther("10")
                  await ganCoin.transfer(user1.address, tokensToSend)
                  expect((await ganCoin.balanceOf(user1.address)).toString()).to.equal(tokensToSend.toString())
              })
              it("Emits an transfer event when an transfer occurs", async () => {
                  expect(await ganCoin.transfer(user1.address, (10 * multiplier).toString())).to.emit(ganCoin, "Transfer")
              })
          })
          //   describe("Allowances", () => {
          //       const amount = (10 * multiplier).toString()
          //       beforeEach(async () => {
          //           const playerToken = await ethers.getContract("GanCoin", user1)
          //       })
          //       it("Should approve an other address to spend the token", async () => {
          //           const tokensToSpend = ethers.utils.parseEther("5")
          //           await ganCoin.approve(user1, tokensToSpend)
          //           const ganCoin1 = await ethers.getContract("GanCoin", user1)
          //           await ganCoin1.transferFrom(deployer, user1, tokensToSpend)
          //           console.log(tokensToSpend)
          //           expect(await ganCoin1.balanceOf(user1).to.equal(tokensToSpend))
          //       })
          //   })
      })
