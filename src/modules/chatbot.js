/* Function to send a request and get a response from the chatbot api */

const fetch = require(`node-fetch`);
const config = require(`../config/config.js`);
const log = require(`../modules/log.js`);

let chatbot = async (message) => {
    let requestURL = `https://api.udit.gq/api/chatbot?message=${encodeURIComponent(message)}&name=${config.chatbot.name}&gender=${config.chatbot.gender}`;

    let res = await fetch(requestURL).catch(error => {
        log(error, `red`);
        return `An unknown error occured.`
    });

    let resJSON = await res.json().catch(error => {
        log(error, `red`);
        return `An unknown error occured.`
    });

    return resJSON.message.length === 0 ? `An unknown error occured.` : resJSON.message
};

module.exports = chatbot;