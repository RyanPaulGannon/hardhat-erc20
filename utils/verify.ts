import { run } from "hardhat"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"

const verify = async (address: string, args: any[]) => {
    console.log("Verifying contract...")
    const constructorArgs = [INITIAL_SUPPLY, "GanCoin", "GAN"]
    try {
        await run("verify:verify", {
            address: address,
            constructorArguments: constructorArgs,
            contract: "contracts/GanCoin.sol:GanCoin",
        })
    } catch (err: any) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        } else {
            console.error(err)
        }
    }
}

export default verify
