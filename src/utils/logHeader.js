/* Display a header for logging */

const config = require(`../config/config.js`);

const logHeader = () => {
    console.log(`\x1b[34m`, `  ___            _                   _ `);
    console.log(`\x1b[34m`, ` / _ \\          | |                 | |`);
    console.log(`\x1b[34m`, `/ /_\\ \\_ __   __| |_ __ _____      _| |`);
    console.log(`\x1b[34m`, `|  _  | '_ \\ / _\` | '__/ _ \\ \\ /\\ / / |`);
    console.log(`\x1b[34m`, `| | | | | | | (_| | | |  __/\\ V  V /|_|`);
    console.log(`\x1b[34m`, `\\_| |_/_| |_|\\__,_|_|  \\___| \\_/\\_/ (_)`);
    console.log(`\x1b[34m`, `\n By ${config.devs.tags.join(`, `)}\n`);
};

module.exports = logHeader;