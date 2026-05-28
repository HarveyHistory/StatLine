const https = require("https");
const config = require("../config.json");

class APIClient {
    constructor() {
        this.cache = new Map();
        this.requests = 0;

        setInterval(() => {
            this.requests = 0;
        }, 60000);
    }

    async request(endpoint) {
        return new Promise((resolve, reject) => {
            const { api, cache, rateLimit, logging } = config;

            // Rate limiting
            if (rateLimit.enabled && this.requests >= rateLimit.requestsPerMinute) {
                return reject("Rate limit exceeded (local)");
            }

            this.requests++;

            if (rateLimit.enabled && this.requests >= rateLimit.warnThreshold) {
                console.log("[RateLimit] Approaching limit...");
            }

            // Cache
            if (cache.enabled && this.cache.has(endpoint)) {
                return resolve(this.cache.get(endpoint));
            }

            const url = `${api.baseUrl}${endpoint}&key=${api.key}`;
            const start = Date.now();

            const req = https.get(url, (res) => {
                let data = "";

                res.on("data", chunk => data += chunk);

                res.on("end", () => {
                    const time = Date.now() - start;

                    try {
                        const json = JSON.parse(data);

                        if (!json.success) {
                            return reject("API error");
                        }

                        if (logging.logRequests) {
                            console.log(`[API] ${endpoint} - ${time}ms`);
                        }

                        if (cache.enabled) {
                            this.cache.set(endpoint, json);

                            if (this.cache.size > cache.maxEntries) {
                                const firstKey = this.cache.keys().next().value;
                                this.cache.delete(firstKey);
                            }

                            setTimeout(() => {
                                this.cache.delete(endpoint);
                            }, cache.ttl);
                        }

                        resolve(json);

                    } catch {
                        reject("Invalid JSON");
                    }
                });
            });

            req.on("error", reject);
            req.setTimeout(api.timeout, () => {
                req.destroy();
                reject("Request timeout");
            });
        });
    }
}

module.exports = new APIClient();
