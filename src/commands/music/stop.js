const { Command } = require('discord-akairo');

module.exports = class CommandStop extends Command
{
    constructor()
    {
        super('stop', {
            aliases: ['stop'],
            category: '🎶 Player',
            description: {
                text: 'Stops the player, and clears the queue.'
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

        this.client.player.stop(message);
        message.member.voice.channel.leave();
        return message.ok('Stopped the player and cleared the queue. ⏹');
    }
};