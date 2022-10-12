import "dotenv/config"
import "hardhat-deploy"
import "solidity-coverage"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import { HardhatUserConfig } from "hardhat/config"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY!
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL!
const MAINNET_RPC_URL = ""

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: "0.8.17",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 1,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
        player: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY!,
        },
    },
    mocha: {
        timeout: 200000,
    },
}

export default config
