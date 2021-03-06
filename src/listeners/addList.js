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

const { Listener } = require('discord-akairo');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = class ListenerAddList extends Listener {
    constructor () {
        super('addList', {
            emitter: 'player',
            event: 'addList'
        });
    }

    async exec (queue, playlist) {
        const channel = queue.textChannel;
        const guild = channel.guild;
        const member = channel.guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id);

        const embed = new MessageEmbed()
            .setColor(guild.me.displayColor !== 0 ? guild.me.displayColor : null)
            .setAuthor({
                name: `Playlist added to queue - ${member.voice.channel.name}`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setTitle(playlist.name)
            .setURL(playlist.url)
            .setThumbnail(playlist.thumbnail)
            .setFooter({
                text: playlist.user.tag,
                iconURL: playlist.user.avatarURL({ dynamic: true })
            });

        // Cut some or many entries if maxQueueLimit is in place.
        const djRole = this.client.settings.get(channel.guild.id, 'djRole');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
        if (!dj) {
            const maxQueueLimit = this.client.settings.get(channel.guild.id, 'maxQueueLimit');
            if (maxQueueLimit) {
                const queueLength = queue.songs.length - playlist.songs.length; // The length before the playlist was added.
                const allowedLimit = queueLength + maxQueueLimit; // The result of the added playlist if maxQueueLimit is in place.

                // The queue has the currently playing song as the first element
                // in the array, so we don't need to subtract the number to get
                // the correct element.
                queue.songs.splice(allowedLimit, playlist.songs.length - maxQueueLimit);
                embed.addField(':warning: Not everything was added!', `Due to limits set on this server, only the first ${maxQueueLimit > 1 ? `**${maxQueueLimit}** entries` : 'entry'}** out of **${playlist.songs.length}** was added to the queue.`);
                return channel.send({ embeds: [embed] });
            }
        } else {
            embed.addField('???? Number of entries', `${playlist.songs.length}`);
            channel.send({ embeds: [embed] });
        }
    }
};
