/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { Command } = require('discord-akairo');

module.exports = class CommandVolume extends Command {
    constructor () {
        super('volume', {
            aliases: ['volume', 'vol'],
            category: '🎶 Music',
            description: {
                text: 'Changes the volume of the player.',
                usage: '<number>',
                details: '`<number>` The percentage of the new volume to set.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    id: 'volume',
                    type: 'number'
                }
            ]
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return this.client.ui.send(message, 'NOT_PLAYING');

        const volume = queue.volume;
        if (!args.volume) {
            const volumeEmoji = () => {
                const volumeIcon = {
                    50: '🔈',
                    100: '🔉',
                    150: '🔊'
                };
                if (volume >= 175) return '🔊😭👌';
                return volumeIcon[Math.round(volume / 50) * 50];
            };
            return this.client.ui.custom(message, volumeEmoji(), process.env.COLOR_INFO, `Current Volume: **${volume}%**`);
        }

        let newVolume = parseInt(args.volume);
        const allowFreeVolume = await this.client.settings.get(message.guild.id, 'allowFreeVolume');
        if (allowFreeVolume === (false || undefined) && newVolume > 200) newVolume = 200;
        this.client.player.setVolume(message.guild.id, newVolume);

        if (newVolume >= 201) {
            return this.client.ui.reply(
                message,
                'warn',
                `Volume has been set to **${newVolume}%**.`,
                null,
                'Volumes exceeding 200% may cause damage to self and equipment.'
            );
        } else {
            return this.client.ui.reply(message, 'ok', `Volume has been set to **${newVolume}%**.`);
        }
    }
};
