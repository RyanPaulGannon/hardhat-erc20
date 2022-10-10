import verify from "../utils/verify"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig, developmentChains, INITIAL_SUPPLY } from "../helper-hardhat-config"

const deployToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId: number = network.config.chainId!
    const GanCoin = await deploy("GanCoin", {
        from: deployer,
        args: [INITIAL_SUPPLY],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`GanCoin deployed at ${GanCoin.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(GanCoin.address, [INITIAL_SUPPLY])
    }
}

export default deployToken
deployToken.tags = ["all"]
