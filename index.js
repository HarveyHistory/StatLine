const config = require("../config.json");
const { getPlayer } = require("./stats");

async function run() {
    console.log(`Starting ${config.app.name} v${config.app.version}`);

    try {
        const player = await getPlayer(config.defaults.uuid);

        if (!player) {
            console.log("Player not found");
            return;
        }

        console.log("Player Summary:");
        console.log(`UUID: ${player.uuid}`);
        console.log(`Level: ${player.level}`);
        console.log(`Karma: ${player.karma}`);

        if (config.features.bedwars) {
            console.log("BedWars:");
            console.log(player.bedwars);
        }

    } catch (err) {
        console.log("Error:", err);
    }
}

run();
