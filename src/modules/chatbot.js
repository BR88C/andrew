/* Function to send a request and get a response from the chatbot api */

const fetch = require(`node-fetch`);
const Markov = require(`markov-strings`).default
const markovData = require(`../config/markovData.js`);
const config = require(`../config/config.js`);
const log = require(`./log.js`);
const randomInt = require(`../utils/randomInt.js`);
const shuffleArray = require(`../utils/shuffleArray.js`);

let chatbot = async (message, type) => {
    if (type === 0) {
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
    } else if (type === 1) {
        let trainingData = shuffleArray(markovData);
        trainingData.push(message.content);

        let markov = new Markov({
            stateSize: randomInt(1, 2)
        })

        markov.addData(trainingData);

        let options = {
            maxTries: 15,
            prng: Math.random,
            filter: (result) => {
                return result.string.length >= randomInt(39, 40)
            }
        };

        let generateString = () => {
            let res = ``;
            try {
                res = markov.generate(options).string;
            } catch (error) {
                return generateString();
            }
            return res;
        }

        let res = generateString();

        return res.length === 0 ? `An unknown error occured.` : res;
    }
};

module.exports = chatbot;