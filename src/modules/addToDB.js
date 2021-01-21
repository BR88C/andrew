/* Function to add a guild config to the DB */

const mongoConfig = require(`../config/mongoConfig.js`);
const log = require(`../modules/log.js`);

let addToDB = async (message, type) => {
    let entry = {
        guildID: message.guild.id,
        channelID: message.channel.id,
        type: type ? type : 0
    };

    message.client.db.db(mongoConfig.dbName).collection(mongoConfig.collectionName).findOne({
        guildID: entry.guildID
    }).then(dbEntry => {
        if (dbEntry != undefined) message.client.db.db(mongoConfig.dbName).collection(mongoConfig.collectionName).deleteOne(dbEntry);
        message.client.db.db(mongoConfig.dbName).collection(mongoConfig.collectionName).insertOne(entry)
    });
};

module.exports = addToDB;