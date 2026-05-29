const api = require("./api");

function calcLevel(exp = 0) {
    return Math.floor(Math.sqrt(exp / 100));
}

function getBedwars(data) {
    const bw = data?.stats?.Bedwars || {};

    return {
        wins: bw.wins_bedwars || 0,
        losses: bw.losses_bedwars || 0,
        kills: bw.kills_bedwars || 0,
        deaths: bw.deaths_bedwars || 0,
        fkdr: bw.final_kills_bedwars && bw.final_deaths_bedwars
            ? (bw.final_kills_bedwars / bw.final_deaths_bedwars).toFixed(2)
            : "0.00"
    };
}

async function getPlayer(uuid) {
    const res = await api.request(`/player?uuid=${uuid}`);

    if (!res.player) return null;

    const p = res.player;

    return {
        uuid: p.uuid,
        level: calcLevel(p.networkExp),
        karma: p.karma || 0,
        bedwars: getBedwars(p)
    };
}

module.exports = { getPlayer };
