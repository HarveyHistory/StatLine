```js
const config = require("../config.json");
const { getPlayer } = require("./stats");
const logger = require("./logger");

// simple startup banner
function printHeader() {
    logger.log(`Starting ${config.app.name} v${config.app.version}`);
    logger.log(`Environment: ${config.app.environment}`);
}

// validate config before running
function validateConfig() {
    if (!config.api.key || config.api.key === "YOUR_API_KEY_HERE") {
        logger.warn("API key is not set. Please update config.json");
    }

    if (!config.defaults.uuid) {
        logger.warn("No default UUID provided in config");
    }
}

// main app logic
async function run() {
    printHeader();
    validateConfig();

    try {
        const uuid = config.defaults.uuid;

        logger.log(`Fetching player data for UUID: ${uuid}`);

        const player = await getPlayer(uuid);

        if (!player) {
            logger.error("Player not found or API returned no data");
            return;
        }

        logger.log("Player data retrieved successfully");

        // output summary
        console.log("\n===== Player Summary =====");
        console.log(`UUID: ${player.uuid}`);
        console.log(`Level: ${player.level}`);
        console.log(`Karma: ${player.karma}`);

        if (config.features.bedwars) {
            console.log("\n--- BedWars Stats ---");
            console.log(`Wins: ${player.bedwars.wins}`);
            console.log(`Losses: ${player.bedwars.losses}`);
            console.log(`Kills: ${player.bedwars.kills}`);
            console.log(`Deaths: ${player.bedwars.deaths}`);
            console.log(`FKDR: ${player.bedwars.fkdr}`);
        }

        console.log("\n==========================\n");

    } catch (err) {
        logger.error(`Application error: ${err}`);
    }
}

// start app
run();
```
