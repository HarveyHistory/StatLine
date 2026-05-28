const https = require("https");

const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.hypixel.net";

// simple in-memory cache to avoid spamming requests
const cache = new Map();

function fetchData(endpoint) {
    return new Promise((resolve, reject) => {
        if (cache.has(endpoint)) {
            return resolve(cache.get(endpoint));
        }

        const url = `${BASE_URL}${endpoint}&key=${API_KEY}`;

        https.get(url, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const json = JSON.parse(data);

                    if (!json.success) {
                        return reject("API request failed");
                    }

                    cache.set(endpoint, json);
                    resolve(json);
                } catch (err) {
                    reject("Invalid JSON response");
                }
            });
        }).on("error", (err) => {
            reject(err.message);
        });
    });
}

// example function to get player stats
async function getPlayerStats(uuid) {
    try {
        const data = await fetchData(`/player?uuid=${uuid}`);

        if (!data.player) {
            console.log("Player not found");
            return;
        }

        const player = data.player;

        console.log("Player Info:");
        console.log("UUID:", player.uuid);
        console.log("Network EXP:", player.networkExp);

        if (player.stats && player.stats.Bedwars) {
            const bw = player.stats.Bedwars;
            console.log("BedWars Wins:", bw.wins_bedwars || 0);
            console.log("BedWars Losses:", bw.losses_bedwars || 0);
        }

    } catch (err) {
        console.log("Error:", err);
    }
}

// simple rate limit awareness (basic)
let requests = 0;
setInterval(() => {
    requests = 0;
}, 60 * 1000);

function safeRequest(fn) {
    if (requests >= 60) {
        console.log("Rate limit safeguard hit");
        return;
    }
    requests++;
    fn();
}

// run example
safeRequest(() => {
    getPlayerStats("example-uuid");
});
