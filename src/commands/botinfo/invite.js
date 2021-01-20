const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `invite`,
    description: `Returns Andrew's invite link`,
    aliases: [`invitelink`, `addbot`],
    async execute (client, message, args) {
        let inviteEmbed = new Discord.MessageEmbed()
            .setColor(0x5eff97)
            .setTitle(`Andrew's Invite link:`)
            .setDescription(client.config.links.invite);

        return message.channel.send(inviteEmbed)
    },
}