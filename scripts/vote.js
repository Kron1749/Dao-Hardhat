const { ethers, network } = require("hardhat")
const { moveBlocks, sleep } = require("../utils/move-blocks")
const {
    proposalsFile,
    developmentChains,
    VOTING_PERIOD,
} = require("../helper-hardhat-config")
const fs = require("fs")

const index = 0

async function main(proposalIndex) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId][index]
    // 0 = no 1 = yes 2 = abstain
    const voteWay = 1
    const governor = await ethers.getContract("GovernorContract")
    const reason = "Test thing"
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxResponse.wait(1)
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    console.log("Voted! Ready to go")
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
