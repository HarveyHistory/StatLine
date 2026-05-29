function getTime() {
    return new Date().toISOString();
}

function log(msg) {
    console.log(`[${getTime()}] [INFO] ${msg}`);
}

function warn(msg) {
    console.warn(`[${getTime()}] [WARN] ${msg}`);
}

function error(msg) {
    console.error(`[${getTime()}] [ERROR] ${msg}`);
}

module.exports = { log, warn, error };
