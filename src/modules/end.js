/* Script to run when the bot is shutting down */

const log = require(`./log.js`);

module.exports = async (client, setDND, message) => {
    if (setDND) {
        await client.user.setPresence({
            activity: {
                name: `Restarting Bot`,
                type: 'PLAYING'
            },
            status: 'dnd'
        }).catch(error => log(error, `red`));
    }

    if (client.db) {
        client.db.close();
        log(`\nDisconnected from the DB.`, `red`);
    }

    if (message) log(`\n${message}`, `red`);
    log(`\nStopped. Bot Offline.`, `red`);
    log(``, `white`);
    process.exit();
}