const { Client, GatewayIntentBits, Events } = require("discord.js");
const config = require("../config.json");
const { getPlayer } = require("./stats");
const logger = require("./logger");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, () => {
    logger.log(`Bot ready as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "stats") {
        const uuid = interaction.options.getString("uuid");

        await interaction.deferReply();

        try {
            const player = await getPlayer(uuid);

            if (!player) {
                return interaction.editReply("Player not found");
            }

            const msg = `
UUID: ${player.uuid}
Level: ${player.level}
Karma: ${player.karma}

BedWars:
Wins: ${player.bedwars.wins}
Losses: ${player.bedwars.losses}
FKDR: ${player.bedwars.fkdr}
`;

            interaction.editReply(msg);

        } catch (err) {
            logger.error(err);
            interaction.editReply("Error fetching stats");
        }
    }
});

client.login(config.discord.token);
