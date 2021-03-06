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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { pushFormatFilter } = require('../../modules/pushFormatFilter');

module.exports = class CommandReverse extends Command {
    constructor () {
        super('reverse', {
            aliases: ['reverse'],
            category: '📢 Filter',
            description: {
                text: 'Plays the music in reverse.',
                usage: '[off]',
                details: stripIndents`
        \`[off]\` Turns off reverse if its active.
        `
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
        const dj = message.member.roles.cache.has(djRole) ||
      message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);

        if (djMode) {
            if (!dj) {
                return this.client.ui.send(message, 'DJ_MODE');
            }
        }

        if (allowFilters === 'dj') {
            if (!dj) {
                return this.client.ui.send(message, 'FILTERS_NOT_ALLOWED');
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return this.client.ui.send(message, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (args[1] === 'OFF'.toLowerCase()) {
                try {
                    await this.client.player.setFilter(message.guild.id, 'reverse', false);
                    pushFormatFilter(queue, 'Reverse', 'Off');
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Reverse** Off');
                } catch (err) {
                    return this.client.ui.send(message, 'FILTER_NOT_APPLIED', 'Reverse');
                }
            } else {
                await this.client.player.setFilter(message.guild.id, 'reverse', 'areverse');
                pushFormatFilter(queue, 'Reverse', 'Enabled');
                return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Reverse** On');
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
