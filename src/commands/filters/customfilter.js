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

module.exports = class CommandCustomFilter extends Command {
    constructor () {
        super('customfilter', {
            aliases: ['customfilter', 'cfilter', 'cf'],
            category: '📢 Filter',
            description: {
                text: 'Allows you to add a custom FFMPEG filter to the player.',
                usage: 'customfilter <argument:str>',
                details: stripIndents`
        \`<argument:str>\` The argument to provide to FFMPEG.
        ⚠ If the argument is invalid or not supported by FFMPEG, the stream will end.
        `
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ownerOnly: true
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) ||
      message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);

        if (djMode) {
            if (!dj) {
                return this.client.ui.send(message, 'DJ_MODE');
            }
        }

        if (!args[1]) return this.client.ui.usage(message, 'customfilter <argument:str>');

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return this.client.ui.send(message, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (args[1] === 'OFF'.toLowerCase()) {
                try {
                    await this.client.player.setFilter(message.guild.id, 'custom', false);
                    pushFormatFilter(queue, 'Custom Filter', 'Off');
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Custom Filter** Removed');
                } catch (err) {
                    return this.client.ui.reply(message, 'error', 'No custom filters are applied to the player.');
                }
            } else {
                const custom = args[1];
                await this.client.player.setFilter(message.guild.id, 'custom', custom);
                pushFormatFilter(queue, 'Custom Filter', custom);
                return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Custom Filter** Argument: \`${custom}\``);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
