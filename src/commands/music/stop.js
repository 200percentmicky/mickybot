/**
 *  Micky-bot
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
const { Permissions } = require('discord.js');
const { stop } = require('../../aliases.json');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandStop extends Command {
    constructor () {
        super(stop !== undefined ? stop[0] : 'stop', {
            aliases: stop || ['stop'],
            category: '🎶 Music',
            description: {
                text: 'Stops the player, and clears the queue.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
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

        const currentVc = this.client.vc.get(vc);
        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

        if (vc.members.size <= 2 || dj) {
            this.client.player.stop(message);
            this.client.vc.leave(message);
            return this.client.ui.custom(message, '⏹', process.env.COLOR_INFO, 'Stopped the player and cleared the queue.');
        } else {
            return this.client.ui.send(message, 'NOT_ALONE');
        }
    }
};
