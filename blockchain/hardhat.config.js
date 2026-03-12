require("@nomicfoundation/hardhat-toolbox");
const { subtask } = require("hardhat/config");
const { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } = require("hardhat/builtin-tasks/task-names");
const fs = require("fs");
const path = require("path");
const solc = require("solc");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8");
    for (const line of envFile.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const separatorIndex = trimmed.indexOf("=");
        if (separatorIndex === -1) continue;

        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim();

        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD).setAction(
    async ({ solcVersion }, hre, runSuper) => {
        if (solcVersion === "0.8.20") {
            return {
                compilerPath: require.resolve("solc/soljson.js"),
                isSolcJs: true,
                version: solcVersion,
                longVersion: solc.version(),
            };
        }

        return runSuper();
    }
);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        ganache: {
            url: "http://127.0.0.1:7545",
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        }
    }
};
