const Discord = require(`discord.js-light`);
const addToDB = require(`../../modules/addToDB.js`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `setup`,
    description: `Configure Andrew! for your server`,
    guildOnly: true,
    aliases: [`start`, `init`, `configure`, `config`],
    async execute (client, message, args) {
        // Check if message author has needed permissions
        const author = await message.guild.members.fetch(message.author.id, false);
        if (!author.hasPermission(`MANAGE_GUILD`)) return message.reply(`you must have the "Manage Server" permission to set up Andrew!`);

        // Get custom emojis
        const emojiGuild = client.guilds.forge(client.config.emojiGuild);
        const agony = await emojiGuild.emojis.fetch(client.config.emojis.agony);

        // Create Embeds
        let correctChannelEmbed = new Discord.MessageEmbed()
            .setTitle(`Set up Andrew! for your server`)
            .setDescription(`Setting up Andrew allows you to use his chatbot feature. Run this command in the channel you wish to use as his chatbot channel. **If this channel is the channel you wish to use, sect the :white_check_mark: !**`);

        let acceptEmbed = new Discord.MessageEmbed()
            .setTitle(`Accept data usage`)
            .setDescription(`By selecting :white_check_mark: , you are agreeing to have your server's ID and chatbot channel ID stored to Andrew's database. This is required as it allows Andrew to identify what channel to reply to messages in in your server. If you are unaware of what discord IDs are, they are given to every channel, user, message, etc as a way of identifying them. They do not include any information about messages, users, or other channels/servers. Andrew also *does not* save any messages.`)

        let typeEmbed = new Discord.MessageEmbed()
            .setTitle(`Select chatbot Type`)
            .setDescription(`Select the type of chatbot you wish to use`)
            .addFields({
                name: `**:speech_balloon: = Normal**`,
                value: `The normal mode talks in a civilized manor, will tell jokes, and will ask/answer questions`,
            }, {
                name: `**${agony} = Cursed**`,
                value: `The cursed will make no sense, says random stuff, and is generally hilarious`,
            });


        // Start setup
        await message.channel.send(correctChannelEmbed).then(async msg => {
            await msg.react(`✅`);
            await msg.react(`❌`);

            const filter = (reaction, user) => [`✅`, `❌`].includes(reaction.emoji.name) && user.id !== msg.author.id && user.id === message.author.id;

            msg.awaitReactions(filter, {
                max: 1,
                time: 30000,
                errors: [`time`]
            }).then(async collected => {
                const reaction = collected.first();

                // If user declines
                if (reaction.emoji.name === `❌`) {
                    message.channel.send(`Stopped setup from proceeding.`)
                    return await msg.delete();
                }

                // If user accepts continue setup
                if (reaction.emoji.name === `✅`) {
                    await msg.delete();

                    // Send accept adding to DB embed
                    await message.channel.send(acceptEmbed).then(async msgA => {
                        await msgA.react(`✅`);
                        await msgA.react(`❌`);

                        const filter = (reaction, user) => [`✅`, `❌`].includes(reaction.emoji.name) && user.id !== msgA.author.id && user.id === message.author.id;

                        msgA.awaitReactions(filter, {
                            max: 1,
                            time: 30000,
                            errors: [`time`]
                        }).then(async collected => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === `❌`) {
                                message.channel.send(`You must accept to complete Andrew's setup. Stopped setup from proceeding.`)
                                return await msgA.delete();
                            }

                            if (reaction.emoji.name === `✅`) {
                                await msgA.delete();

                                // Send select type embed
                                await message.channel.send(typeEmbed).then(async msgT => {
                                    await msgT.react(`💬`);
                                    await msgT.react(agony);

                                    const filter = (reaction, user) => [`💬`, `agony`].includes(reaction.emoji.name) && user.id !== msgA.author.id && user.id === message.author.id;

                                    msgT.awaitReactions(filter, {
                                        max: 1,
                                        time: 30000,
                                        errors: [`time`]
                                    }).then(async collected => {
                                        const reaction = collected.first();
                                        let type;

                                        if (reaction.emoji.name === `💬`) type = 0;
                                        else if (reaction.emoji.name === `agony`) type = 1;

                                        await addToDB(message, type);

                                        message.channel.send(`Success! Andrew is now set up for your server!`);
                                        return await msgT.delete();

                                    }).catch(async error => {
                                        log(error, `red`)
                                        message.channel.send(`Timed out. Stopped setup from proceeding.`)
                                        return await msgT.delete();
                                    });
                                });

                            }

                        }).catch(async error => {
                            log(error, `red`)
                            message.channel.send(`Timed out. Stopped setup from proceeding.`)
                            return await msgA.delete();
                        });
                    });
                }

            }).catch(async error => {
                message.channel.send(`Timed out. Stopped setup from proceeding.`)
                return await msg.delete();
            });;
        });
    },
}