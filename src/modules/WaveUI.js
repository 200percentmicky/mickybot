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

/* eslint-disable no-multi-spaces */
/* eslint-disable no-unused-vars */

const {
    Message,
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    ColorResolvable,
    EmojiResolvable,
    BaseGuildTextChannel,
    GuildMember
} = require('discord.js');
const { CommandContext, Member } = require('slash-create');

let baseEmbed = {};
/**
 * The overall structured embed to use for the UI.
 *
 * @param {ColorResolvable} color The color of the embed.
 * @param {EmojiResolvable} emoji The emoji to add to the message.
 * @param {string} title The title of the embed.
 * @param {GuildMember|Member} author The author of the embed. Usually the member of a guild.
 * @param {string} desc The description of the embed.
 * @param {string} footer The footer of the embed.
 * @returns The object used to construct an embed.
 */
const embedUI = (color, emoji, title, author, desc, footer) => {
    baseEmbed = {
        color: parseInt(color),
        title: null,
        description: `${emoji} ${desc}`
    };

    if (title) {
        baseEmbed.title = `${emoji} ${title}`;
        baseEmbed.description = `${desc}`;
    }

    if (footer) {
        baseEmbed.footer = {
            text: `${footer}`
        };
    }

    return baseEmbed;
};

/**
 * The overall structured message to use for the UI.
 * Should be used if the bot doesn't have permission to embed links.
 *
 * @param {EmojiResolvable} emoji The emoji to use in the message.
 * @param {string} title The title of the message.
 * @param {GuildMember} author The author of the embed. Usually the member of a guild.
 * @param {string} desc The description of the message.
 * @returns The constructed message.
 */
const stringUI = (emoji, title, author, desc) => {
    let msgString = `\`${author.user.tag}\` ${emoji} ${desc}`;
    if (title) msgString = `\`${author.user.tag}\` ${emoji} **${title}**\n${desc}`;
    return msgString;
};

// Embed colors
const embedColor = {
    ok: process.env.COLOR_OK,
    warn: process.env.COLOR_WARN,
    error: process.env.COLOR_ERROR,
    info: process.env.COLOR_INFO,
    no: process.env.COLOR_NO
};

/**
 * Allows you to create a window alert style UI utilizing `Discord.MessageEmbed`, or a standard text message if the bot doesn't have the **Embed Links** permission.
 *
 * @param {Message} msg A MessageResolvable
 * @param {string} type The type of interface to provide. Supported are `ok` for success, `warn` for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Message} The message to send in the channel.
 */
const say = (msg, type, description, title, footer, buttons) => {
    if (!(msg instanceof Message)) throw new TypeError('Parameter "channel" must be an instance of "BaseGuildTextChannel".');

    /* The emoji of the embed */
    // If the bot doesn't have permission to use external emojis, then the default emojis will be used.
    const emojiPerms = msg.channel.permissionsFor(msg.channel.client.user.id).has(['USE_EXTERNAL_EMOJIS']);
    const embedEmoji = {
        ok: emojiPerms ? process.env.EMOJI_OK : '???',
        warn: emojiPerms ? process.env.EMOJI_WARN : '???',
        error: emojiPerms ? process.env.EMOJI_ERROR : '???',
        info: emojiPerms ? process.env.EMOJI_INFO : '???',
        no: emojiPerms ? process.env.EMOJI_NO : '????'
    };

    /* No embed */
    // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
    const embed = embedUI(embedColor[type], embedEmoji[type], title || null, msg.member, description || null, footer || null);
    if (msg.channel.type === 'dm') { /* DMs will always have embed links. */
        return msg.channel.send({
            embeds: [embed],
            components: buttons || []
        });
    } else {
        if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
            return msg.channel.send({
                content: stringUI(embedEmoji[type], title || null, msg.member, description || null),
                components: buttons || []
            });
        } else {
            return msg.channel.send({
                embeds: [embed],
                components: buttons || []
            });
        }
    }
};

/**
 * Similar to `Message.say()` but replies to the user instead.
 *
 * @param {Message} msg A MessageResolvable
 * @param {string} type The type of interface to provide. Supported are `ok` for success, `warn` for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Message} The message to send in the channel.
 */
const reply = (msg, type, description, title, footer, buttons) => {
    if (!(msg instanceof Message)) throw new TypeError('Parameter "msg" must be an instance of "Message".');

    /* The emoji of the embed */
    // If the bot doesn't have permission to use external emojis, then the default emojis will be used.
    const emojiPerms = msg.channel.permissionsFor(msg.channel.client.user.id).has(['USE_EXTERNAL_EMOJIS']);
    const embedEmoji = {
        ok: emojiPerms ? process.env.EMOJI_OK : '???',
        warn: emojiPerms ? process.env.EMOJI_WARN : '???',
        error: emojiPerms ? process.env.EMOJI_ERROR : '???',
        info: emojiPerms ? process.env.EMOJI_INFO : '???',
        no: emojiPerms ? process.env.EMOJI_NO : '????'
    };

    /* No embed */
    // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
    const embed = embedUI(embedColor[type], embedEmoji[type], title || null, msg.member, description || null, footer || null);
    if (msg.channel.type === 'dm') { /* DMs will always have embed links. */
        return msg.reply({
            embeds: [embed],
            components: buttons || [],
            allowedMentions: {
                repliedUser: true
            }
        });
    } else {
        if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
            return msg.reply({
                content: stringUI(embedEmoji[type], title || null, msg.member, description || null),
                components: buttons || [],
                allowedMentions: {
                    repliedUser: false
                }
            });
        } else {
            return msg.reply({
                embeds: [embed],
                components: buttons || [],
                allowedMentions: {
                    repliedUser: false
                }
            });
        }
    }
};

/**
 * A UI element that returns the overall usage of the command if no arguments were provided.
 *
 * @example this.client.ui.usage(message, message, 'play <url|search>');
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} syntax The usage of the command
 * @returns {Message} The embed containg the usage of the command.
 */
const usage = (msg, syntax) => {
    if (!(msg instanceof Message)) throw new TypeError('Parameter "msg" must be an instance of "Message".');

    const guildPrefix = msg.channel.client.settings.get(msg.guild.id, 'prefix') ?? process.env.PREFIX;
    const embed = new MessageEmbed()
        .setColor(process.env.COLOR_INFO)
        .setTitle(`${process.env.EMOJI_INFO} Usage`)
        .setDescription(`\`${guildPrefix}${syntax}\``);
    if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
        return msg.reply(`${process.env.EMOJI_INFO} **Usage** | \`${guildPrefix}${syntax}\``);
    } else {
        return msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};

/**
 * A custom varient of `<Message>.say()` that allows you to input a custom emoji. If the bot has the **Embed Links** permission, a custom color can be provided to the embed.
 *
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} emoji The emoji of the message.
 * @param {number} color [Optional] The color of the embed, if the bot has the **Embed Links** permission.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the message.
 * @param {string} footer [Optional] The footer of the message.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Message} The message to reply to the user.
 */
const custom = (msg, emoji, color, description, title, footer, buttons) => {
    if (!(msg instanceof Message)) throw new TypeError('Parameter "msg" must be an instance of "Message".');

    const embed = embedUI(color, emoji || null, title || null, msg.member, description || null, footer || null);
    if (msg.channel.type === 'dm') {
        return msg.reply({
            embeds: [embed],
            allowedMentions: {
                repliedUser: false
            }
        });
    } else {
        if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
            return msg.reply(stringUI(emoji || null, title || null, msg.member, description || null)
                , { allowedMentions: { repliedUser: false } });
        } else {
            return msg.reply({
                embeds: [embed],
                components: buttons || [],
                allowedMentions: {
                    repliedUser: false
                }
            });
        }
    }
};

/**
 * Allows you to create a window alert style UI utilizing `Discord.MessageEmbed`, or a standard text message if the bot doesn't have the **Embed Links** permission.
 *
 * @param {CommandContext} interaction The incoming interaction.
 * @param {BaseGuildTextChannel} channel The text channel of the interaction.
 * @param {string} type The type of interface to provide. Supported are `ok` for success, `warn` for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {boolean} ephemeral Whether the response should be sent as an ephemeral message.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Message} The message to send in the channel.
 */
const ctx = (interaction, type, description, title, footer, ephemeral, buttons) => {
    /* The emoji of the embed */
    const embedEmoji = {
        ok: process.env.EMOJI_OK ?? '???',
        warn: process.env.EMOJI_WARN ?? '???',
        error: process.env.EMOJI_ERROR ?? '???',
        info: process.env.EMOJI_INFO ?? '???',
        no: process.env.EMOJI_NO ?? '????'
    };

    /* No embed */
    // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
    const embed = embedUI(embedColor[type], embedEmoji[type], title || null, interaction.member, description || null, footer || null);
    return interaction.send({
        embeds: [embed],
        components: buttons || [],
        ephemeral: ephemeral
    });
};

/**
 * A custom varient of `<Message>.say()` that allows you to input a custom emoji. If the bot has the **Embed Links** permission, a custom color can be provided to the embed.
 *
 * @param {CommandInteraction} interaction The incoming interaction.
 * @param {string} emoji The emoji of the message.
 * @param {number} color [Optional] The color of the embed, if the bot has the **Embed Links** permission.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the message.
 * @param {string} footer [Optional] The footer of the message.
 * @param {boolean} ephemeral Whether the response should be sent as an ephemeral message.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Message} The message to reply to the user.
 */
const ctxCustom = (interaction, emoji, color, description, title, footer, ephemeral, buttons) => { // Temp name.
    const embed = embedUI(color, emoji || null, title || null, interaction.member, description || null, footer || null);
    return interaction.send({
        embeds: [embed],
        components: buttons || [],
        ephemeral: ephemeral
    });
};

/**
 * Pre-configured messages for common prompts throughout the bot.
 *
 * DJ_MODE, NO_DJ, FILTER_NOT_APPLIED, FILTERS_NOT_ALLOWED, NOT_ALONE, NOT_PLAYING, NOT_IN_VC, ALREADY_SUMMONED_ELSEWHERE, MISSING_CONNECT, MISSING_SPEAK, WRONG_TEXT_CHANNEL_MUSIC, OWNER_ONLY, NSFW_ONLY
 *
 * @param {Message|CommandContext} msg The overall message, or an interaction.
 * @param {string} prompt The prompt to provide in the message.
 * @param {any} extra Any extra variables to provide to the prompt.
 */
const send = (msg, prompt, extra) => {
    const promptMessage = {
        DJ_MODE: 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.',
        NO_DJ: 'You must be a DJ or have the **Manage Channels** permission to use that.',
        FILTER_NOT_APPLIED: `**${extra}** is not applied to the player.`,
        FILTERS_NOT_ALLOWED: 'Filters can only be applied by DJs on this server.',
        NOT_ALONE: 'You must be a DJ or have the **Manage Channels** permission to use that. However, being alone with me in the voice channel will work.',
        NOT_PLAYING: 'Nothing is currently playing on this server.',
        NOT_IN_VC: 'You\'re not in a voice channel.',
        ALREADY_SUMMONED_ELSEWHERE: 'You must be in the same voice channel that I\'m in to do that.',
        MISSING_CONNECT: `Missing **Connect** permission for <#${extra}>`,
        MISSING_SPEAK: `Missing **Request to Speak** permission for <#${extra}>.`,
        MISSING_CLIENT_PERMISSIONS: `Missing **${extra}** permission(s) to run that command.`,
        MISSING_PERMISSIONS: `You need the **${extra}** permission(s) to use that command.`,
        WRONG_TEXT_CHANNEL_MUSIC: `Music commands must be used in <#${extra}>`,
        OWNER_ONLY: 'This command can only be used by the bot owner.',
        NSFW_ONLY: 'This command must be used in NSFW channels.'
    };

    const promptColor = {
        DJ_MODE: process.env.COLOR_NO,
        NO_DJ: process.env.COLOR_NO,
        FILTER_NOT_APPLIED: process.env.COLOR_ERROR,
        FILTERS_NOT_ALLOWED: process.env.COLOR_NO,
        NOT_ALONE: process.env.COLOR_NO,
        NOT_PLAYING: process.env.COLOR_WARN,
        NOT_IN_VC: process.env.COLOR_ERROR,
        ALREADY_SUMMONED_ELSEWHERE: process.env.COLOR_ERROR,
        MISSING_CONNECT: process.env.COLOR_NO,
        MISSING_SPEAK: process.env.COLOR_NO,
        MISSING_CLIENT_PERMISSIONS: process.env.COLOR_WARN,
        MISSING_PERMISSIONS: process.env.COLOR_NO,
        WRONG_TEXT_CHANNEL_MUSIC: process.env.COLOR_NO,
        OWNER_ONLY: process.env.COLOR_NO,
        NSFW_ONLY: process.env.COLOR_NO
    };

    const promptEmoji = {
        DJ_MODE: process.env.EMOJI_NO ?? '????',
        NO_DJ: process.env.EMOJI_NO ?? '????',
        FILTER_NOT_APPLIED: process.env.EMOJI_ERROR ?? '???',
        FILTERS_NOT_ALLOWED: process.env.EMOJI_NO ?? '????',
        NOT_ALONE: process.env.EMOJI_NO ?? '????',
        NOT_PLAYING: process.env.EMOJI_WARN ?? '???',
        NOT_IN_VC: process.env.EMOJI_ERROR ?? '???',
        ALREADY_SUMMONED_ELSEWHERE: process.env.EMOJI_ERROR ?? '???',
        MISSING_CONNECT: process.env.EMOJI_NO ?? '????',
        MISSING_SPEAK: process.env.EMOJI_NO ?? '????',
        MISSING_CLIENT_PERMISSIONS: process.env.EMOJI_WARN ?? '???',
        MISSING_PERMISSIONS: process.envEMOJI_NO ?? '????',
        WRONG_TEXT_CHANNEL_MUSIC: process.env.EMOJI_NO ?? '????',
        OWNER_ONLY: process.env.EMOJI_NO ?? '????',
        NSFW_ONLY: '????'
    };

    if ((msg instanceof Message)) {
        /* No embed */
        // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
        const embed = embedUI(promptColor[prompt], promptEmoji[prompt], null, msg.member, promptMessage[prompt], null);
        if (msg.channel.type === 'dm') { /* DMs will always have embed links. */
            return msg.reply({
                embeds: [embed]
            });
        } else {
            if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
                return msg.reply({
                    content: stringUI(promptEmoji[prompt], null, msg.member, promptMessage[prompt])
                });
            } else {
                return msg.reply({
                    embeds: [embed]
                });
            }
        }
    } else { // Slash commands.
        const embed = embedUI(promptColor[prompt], promptEmoji[prompt], null, msg.member, promptMessage[prompt], null);
        return msg.send({
            embeds: [embed]
        });
    }
};

/**
 * A function that sends an error report to the given bug reports channel, if one was provided in the `.env` file.
 *
 * @param {Client} client An instance of `Discord.Client`
 * @param {string} command [Optional] The command of the bug report.
 * @param {string} title The title of the bug report.
 * @param {string} error The error of the bug report. It's recommended to provide `<err>.stack` in this parameter.
 * @returns {Message} The overall bug report.
 */
const recordError = async (client, command, title, error) => { // TODO: Remove 'type'.
    const errorChannel = client.channels.cache.get(process.env.BUG_CHANNEL);
    if (!errorChannel) return;

    return errorChannel.send({ content: `**${title}**${command ? ` in \`${command}\`` : ''}\n\`\`\`js\n${error}\`\`\`` });
};

module.exports = { say, reply, usage, custom, send, ctx, ctxCustom, recordError };
