const fs = require('fs');
const path = require('path');
const https = require('https');

const isDev = think.env === 'development';
let createServer = function (callback, port, hostName) {
    let option = {
        cert: fs.readFileSync(
            isDev ? './ssl/127.0.0.1+2.pem' : '/etc/nginx/conf.d/imyoyo.xyz_nginx/imyoyo.xyz_bundle.crt',
        ),
        key: fs.readFileSync(isDev ? './ssl/127.0.0.1+2-key.pem' : '/etc/nginx/conf.d/imyoyo.xyz_nginx/imyoyo.xyz.key'),
    };
    const server = https.createServer(option, callback);
    server.listen(port, hostName);
    return server;
};

let port;
const portFile = path.join(think.ROOT_PATH, 'port');
if (think.isFile(portFile)) {
    port = fs.readFileSync(portFile, 'utf8');
}

let host;
const hostFile = path.join(think.ROOT_PATH, 'host');
if (think.isFile(hostFile)) {
    host = fs.readFileSync(hostFile, 'utf8');
}

module.exports = {
    host: host || process.env.HOST || '0.0.0.0',
    port: port || process.env.PORT || 8360,

    /** disable theme editor */
    DISALLOW_FILE_EDIT: process.env.DISALLOW_FILE_EDIT || false,
    createServer: createServer,
};
