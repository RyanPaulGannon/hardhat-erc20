import { run } from "hardhat"

const verify = async (address: string, args: any[]) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: address,
            constructorArguments: args,
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
