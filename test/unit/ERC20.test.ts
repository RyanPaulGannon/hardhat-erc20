import { assert, expect } from "chai"
import { GanCoin } from "../../typechain-types"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains, INITIAL_SUPPLY } from "../../helper-hardhat-config"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("GanCoin Unit Test", () => {
          const multiplier: number = 10 ** 18
          let ganCoin: GanCoin
          let deployer //: SignerWithAddress
          let user1
          beforeEach(async () => {
              const accounts = await getNamedAccounts()
              deployer = accounts.deployer
              user1 = accounts.user1

              await deployments.fixture("all")
              ganCoin = await ethers.getContractAt("GanCoin", deployer)
          })
          it("Gets deployed correctly", () => {
              assert(ganCoin.address)
          })
      })
describe("Constructor", async () => {})
