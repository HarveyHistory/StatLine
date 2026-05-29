const config = require("../config.json");
const logger = require("./logger");

function start() {
    logger.log(`Starting ${config.app.name} v${config.app.version}`);

    if (config.discord.enabled) {
        logger.log("Launching Discord bot...");
        require("./bot");
    } else {
        logger.warn("No runtime mode enabled");
    }
}

start();
