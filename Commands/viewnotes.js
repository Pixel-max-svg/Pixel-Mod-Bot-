const Discord = require('discord.js');
const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);

module.exports = {
    name: 'viewnotes',
    description: `Views all notes linked to an account.`,
    usage: 'viewnotes `username`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}viewnotes [username]`);
            return message.react('❌');
        }
        let member = message.guild.members.cache.find(user => user.user.username === `${args[0]}` || user.nickname === `${args[0]}`)  || message.mentions.members.first();
        if (!member) {
            message.channel.send(`Couldn't find ${args[0]}.`);
            return message.react('❌');
        }
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            message.channel.send('You need the Kick Members permission in order to run this command.');
            return message.react('❌');
        }
        let notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
        message.channel.send('Check your inbox.');
        if (!notes)
            message.author.send(`There are no notes linked to ${member.username}.`);
        else {
            let viewnotesembed = new Discord.MessageEmbed()
                .setColor('#00ffbb')
                .setTitle(`${member.user.username}'s notes`)
                .setDescription(notes)
                .setTimestamp();
            message.author.send(viewnotesembed);
        }
    }
}