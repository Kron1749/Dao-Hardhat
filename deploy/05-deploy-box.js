const { network } = require("hardhat")
const {
    developmentChains,
    QUORUM_PERCENTAGE,
    VOTING_DELAY,
    VOTING_PERIOD,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("Deploying box...")
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        blockConfirmations: 1,
    })

    log(`Box at ${box.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(box.address, [])
    }

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTx.wait(1)
    log("Ownership transfered")
}
