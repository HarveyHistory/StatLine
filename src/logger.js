const config = require("../config.json");

function formatTime() {
    return new Date().toISOString();
}

function log(message) {
    if (!config.logging.enabled) return;
    console.log(`[${formatTime()}] [INFO] ${message}`);
}

function warn(message) {
    if (!config.logging.enabled) return;
    console.warn(`[${formatTime()}] [WARN] ${message}`);
}

function error(message) {
    console.error(`[${formatTime()}] [ERROR] ${message}`);
}

module.exports = {
    log,
    warn,
    error
};
