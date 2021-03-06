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
const iheart = require('iheart');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandIHeartRadio extends Command {
    constructor () {
        super('iheartradio', {
            aliases: ['iheartradio', 'ihr'],
            category: '🎶 Music',
            description: {
                text: 'Play a iHeartRadio station.',
                usage: '<search>',
                details: '`<search>` The station to search for. The first result is queued.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const text = args.slice(1).join(' ');

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

        if (!text) return this.client.ui.usage(message, 'iheartradio <search>');

        const currentVc = this.client.vc.get(vc);
        if (!currentVc) {
            const permissions = vc.permissionsFor(this.client.user.id).has(Permissions.FLAGS.CONNECT);
            if (!permissions) return this.client.ui.send(message, 'MISSING_CONNECT', vc.id);

            if (vc.type === 'stage') {
                await this.client.vc.join(vc); // Must be awaited only if the VC is a Stage Channel.
                const stageMod = vc.permissionsFor(this.client.user.id).has(Permissions.STAGE_MODERATOR);
                if (!stageMod) {
                    const requestToSpeak = vc.permissionsFor(this.client.user.id).has(Permissions.FLAGS.REQUEST_TO_SPEAK);
                    if (!requestToSpeak) {
                        this.client.vc.leave(message);
                        return this.client.ui.send(message, 'MISSING_SPEAK', vc.id);
                    } else if (message.guild.me.voice.suppress) {
                        await message.guild.me.voice.setRequestToSpeak(true);
                    }
                } else {
                    await message.guild.me.voice.setSuppressed(false);
                }
            } else {
                this.client.vc.join(vc);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        message.channel.sendTyping();
        const queue = this.client.player.getQueue(message.guild.id);

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await this.client.settings.get(message.guild.id, 'maxQueueLimit');
                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        return this.client.ui.reply(message, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
                    }
                }
            }
        }

        try {
            const search = await iheart.search(text);
            const station = search.stations[0];
            const url = await iheart.streamURL(station.id);

            // To prevent overwrites, lock the command until the value is cleared.
            if (await this.client.radio.get(message.guild.id)) return this.client.ui.reply(message, 'warn', 'Request is still being processed. Please try again later.');
            await this.client.radio.set(message.guild.id, text, 10000);
            await this.client.player.play(vc, url, {
                member: message.member,
                textChannel: message.channel,
                message: message
            });
            return message.react(process.env.EMOJI_MUSIC);
        } catch (err) {
            this.client.logger.error(err.stack); // Just in case.
            return this.client.ui.reply(message, 'error', `An unknown error occured:\n\`\`\`js\n${err.name}: ${err.message}\`\`\``, 'Player Error');
        }
    }
};
