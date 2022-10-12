import verify from "../utils/verify"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig, developmentChains, INITIAL_SUPPLY } from "../helper-hardhat-config"

const deployToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId: number = network.config.chainId!
    const args = [INITIAL_SUPPLY, "GanCoin", "GAN"]
    const ganCoin = await deploy("GanCoin", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`GanCoin deployed at ${ganCoin.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(ganCoin.address, [INITIAL_SUPPLY])
    }
}

export default deployToken
deployToken.tags = ["all"]
