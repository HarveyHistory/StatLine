```js
const config = require("../config.json");
const { getPlayer } = require("./stats");
const logger = require("./logger");

// parse CLI arguments (basic but realistic)
function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {};

    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith("--")) {
            const key = args[i].replace("--", "");
            const value = args[i + 1];
            parsed[key] = value;
            i++;
        }
    }

    return parsed;
}

// display startup info
function init() {
    logger.log(`Booting ${config.app.name} v${config.app.version}`);
    logger.log(`Mode: ${config.app.environment}`);

    if (!config.api.key || config.api.key === "YOUR_API_KEY_HERE") {
        logger.warn("API key not configured");
    }
}

// graceful shutdown simulation (real apps do this)
function shutdown() {
    logger.log("Shutting down StatLine...");
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// main execution
async function main() {
    init();

    const args = parseArgs();

    const uuid = args.uuid || config.defaults.uuid;

    if (!uuid) {
        logger.error("No UUID provided. Use --uuid <value>");
        return;
    }

    logger.log(`Requesting data for UUID: ${uuid}`);

    try {
        const start = Date.now();

        const player = await getPlayer(uuid);

        const duration = Date.now() - start;

        if (!player) {
            logger.warn("No player data returned");
            return;
        }

        logger.log(`Data received in ${duration}ms`);

        // structured output
        console.log("\n========== StatLine ==========\n");

        console.log("Player Info");
        console.log("------------------------------");
        console.log(`UUID:   ${player.uuid}`);
        console.log(`Level:  ${player.level}`);
        console.log(`Karma:  ${player.karma}`);

        if (config.features.bedwars) {
            console.log("\nBedWars Stats");
            console.log("------------------------------");
            console.log(`Wins:   ${player.bedwars.wins}`);
            console.log(`Losses: ${player.bedwars.losses}`);
            console.log(`Kills:  ${player.bedwars.kills}`);
            console.log(`Deaths: ${player.bedwars.deaths}`);
            console.log(`FKDR:   ${player.bedwars.fkdr}`);
        }

        console.log("\n==============================\n");

    } catch (err) {
        logger.error(`Unhandled error: ${err}`);
    }
}

// run app
main();
```
