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

module.exports = class CommandAllowFilters extends Command {
    constructor () {
        super('allowfilters', {
            aliases: ['allowfilters'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to allow members to apply filters to the player.',
                usage: '<toggle:on/off>',
                details: '`<toggle:on/off>` The toggle of the setting.'
            },
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        if (!args[1]) return this.client.ui.usage(message, 'allowfilters <toggle>');
        if (args[1] === 'OFF'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, false, 'allowFilters');
            return this.client.ui.reply(message, 'ok', 'Filters have been disabled. Only DJs will be able to apply filters.');
        } else if (args[1] === 'ON'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, true, 'allowFilters');
            return this.client.ui.reply(message, 'ok', 'Filters have been enabled.');
        } else {
            return this.client.ui.reply(message, 'error', 'Toggles must be **dj** or **all**');
        }
    }
};
