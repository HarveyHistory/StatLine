const https = require("https");
const config = require("../config.json");
const logger = require("./logger");

class APIClient {
    constructor() {
        this.cache = new Map();
        this.requests = 0;

        setInterval(() => {
            this.requests = 0;
        }, 60000);
    }

    request(endpoint) {
        return new Promise((resolve, reject) => {
            if (config.rateLimit.enabled && this.requests >= config.rateLimit.requestsPerMinute) {
                return reject("Rate limit reached");
            }

            this.requests++;

            if (config.cache.enabled && this.cache.has(endpoint)) {
                return resolve(this.cache.get(endpoint));
            }

            const url = `${config.api.baseUrl}${endpoint}&key=${config.api.key}`;
            const start = Date.now();

            const req = https.get(url, (res) => {
                let data = "";

                res.on("data", chunk => data += chunk);

                res.on("end", () => {
                    const duration = Date.now() - start;

                    try {
                        const json = JSON.parse(data);

                        if (!json.success) {
                            logger.warn(`API error (${duration}ms)`);
                            return reject("API failed");
                        }

                        logger.log(`Request ${endpoint} (${duration}ms)`);

                        if (config.cache.enabled) {
                            this.cache.set(endpoint, json);
                            setTimeout(() => this.cache.delete(endpoint), config.cache.ttl);
                        }

                        resolve(json);

                    } catch {
                        reject("Invalid response");
                    }
                });
            });

            req.on("error", reject);
            req.setTimeout(config.api.timeout, () => {
                req.destroy();
                reject("Timeout");
            });
        });
    }
}

module.exports = new APIClient();
