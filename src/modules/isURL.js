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

/**
 * Checks whether the song provided is a URL.
 * @param {string} song
 */
function isURL (song) {
    const urlPattern = /(mailto|news|tel(net)?|urn|ldap|ftp|https?):\+?(\/\/)?\[?([a-zA-Z0-9]\]?.{0,})/gmi;
    const urlRegex = new RegExp(urlPattern);
    return song.match(urlRegex);
}

module.exports = { isURL };
