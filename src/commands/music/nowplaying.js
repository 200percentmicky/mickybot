const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandNowPlaying extends Command
{
    constructor()
    {
        super('nowplaying', {
            aliases: ['nowplaying', 'now', 'np'],
            category: '🎶 Player',
            description: {
                text: 'Shows the currently playing song.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message)
    {
        const vc = message.member.voice.channel;
        if (!vc) return message.error('You are not in a voice channel.');

        const currentVc = this.client.voice.connections.get(message.guild.id);
        if (!this.client.player.isPlaying(message) || !currentVc) return message.warn('Nothing is currently playing in this server.');
        else if (vc.id !== currentVc.channel.id) return message.error('You must be in the same voice channel that I\'m in to use that command.');

        const queue = this.client.player.getQueue(message);
        const song = queue.songs[0];
        return message.channel.send(new MessageEmbed()
            .setColor(this.client.utils.randColor())
            .setAuthor(`Currently playing in ${message.guild.name} - ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .addField('Duration', song.formattedDuration, true)
            .addField('Requested by', song.user, true)
            .addField('Volume', queue.volume, true)
            .addField('Current Filter', queue.filter != null ? queue.filter : 'None')
            .setTimestamp()
        )
    }
};