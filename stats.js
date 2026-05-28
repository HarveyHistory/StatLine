const api = require("./api");

function calculateLevel(exp = 0) {
    return Math.floor(Math.sqrt(exp / 100));
}

function getBedwarsStats(data) {
    const bw = data?.stats?.Bedwars || {};

    return {
        wins: bw.wins_bedwars || 0,
        losses: bw.losses_bedwars || 0,
        kills: bw.kills_bedwars || 0,
        deaths: bw.deaths_bedwars || 0,
        fkdr: bw.final_kills_bedwars && bw.final_deaths_bedwars
            ? (bw.final_kills_bedwars / bw.final_deaths_bedwars).toFixed(2)
            : 0
    };
}

async function getPlayer(uuid) {
    const data = await api.request(`/player?uuid=${uuid}`);

    if (!data.player) return null;

    const player = data.player;

    return {
        uuid: player.uuid,
        level: calculateLevel(player.networkExp),
        karma: player.karma || 0,
        achievements: player.achievements || {},
        bedwars: getBedwarsStats(player)
    };
}

module.exports = { getPlayer };
