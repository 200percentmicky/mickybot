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
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = class ListenerClientCommandError extends Listener {
    constructor () {
        super('clientCommandError', {
            emitter: 'commandHandler',
            event: 'error'
        });
    }

    async exec (error, message, command) {
        let guru = '💢 **Bruh Moment**\nSomething bad happened. Please report this to the developer.';

        if (process.env.BUG_CHANNEL) {
            guru += ' The owner of this application has also received a full error report.\n';
        }

        guru += `\`\`\`js\n${error.name}: ${error.message}\`\`\``;

        const urlGithub = new MessageButton()
            .setStyle('LINK')
            .setURL('https://github.com/200percentmicky/mickybot')
            .setLabel('GitHub');

        const support = new MessageButton()
            .setStyle('LINK')
            .setURL('https://discord.com/invite/qQuJ9YQ')
            .setLabel('Support Server');

        const actionRow = new MessageActionRow()
            .addComponents([urlGithub, support]);

        message.reply({ content: guru, components: [actionRow], allowedMentions: { repliedUser: true } });
        this.client.ui.recordError(this.client, command, '❌ Command Error', error.stack);
        this.client.logger.error('[Client] Error in command "%s": %s', command, error.stack);
    }
};
