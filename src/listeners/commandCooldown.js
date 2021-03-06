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

module.exports = class ListenerCooldown extends Listener {
    constructor () {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
    }

    async exec (message, command, remaining) {
        if (command) {
            const seconds = remaining / 1000.00;
            const time = Math.floor(parseFloat(seconds));
            this.client.ui.custom(message, '⌛', process.env.COLOR_NO, `You can run that command again in **${time}** seconds.`, 'Cooldown').then(sent => {
                setTimeout(() => {
                    sent.delete();
                }, 5000);
            });
        }
    }
};
