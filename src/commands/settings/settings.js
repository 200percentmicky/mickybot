const { stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { toColonNotation } = require('colon-notation')

module.exports = class CommandSettings extends Command {
  constructor () {
    super('settings', {
      aliases: ['settings'],
      category: '⚙ Settings',
      description: {
        text: 'Shows you the current settings for this server.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const settings = this.client.settings

    /* All Settings */
    const prefix = settings.get(message.guild.id, 'prefix', process.env.PREFIX) // Server Prefix
    const timezone = settings.get(message.guild.id, 'timezone', 'UTC') // Time Zone
    const djRole = settings.get(message.guild.id, 'djRole', null) // DJ Role
    const djMode = settings.get(message.guild.id, 'djMode', false) // Toggle DJ Mode
    const maxTime = settings.get(message.guild.id, 'maxTime', null) // Max Song Duration
    const maxQueueLimit = settings.get(message.guild.id, 'maxQueueLimit', null) // Max Entries in the Queue
    const allowFilters = settings.get(message.guild.id, 'allowFilters', 'all') // Allow the use of Filters
    const allowFreeVolume = settings.get(message.guild.id, 'allowFreeVolume', true) // Unlimited Volume
    const modlog = settings.get(message.guild.id, 'modlog', null) // Moderation Logs
    const taglog = settings.get(message.guild.id, 'taglog', null) // Tag Logs
    const guildMemberAdd = settings.get(message.guild.id, 'guildMemberAdd', null) // User Join
    const guildMemberRemove = settings.get(message.guild.id, 'guildMemberRemove', null) // User Leave
    const guildMemberUpdate = settings.get(message.guild.id, 'guildMemberUpdate', null) // User Update
    const messageDelete = settings.get(message.guild.id, 'messageDelete', null) // Deleted Messages
    const messageUpdate = settings.get(message.guild.id, 'messageUpdate', null) // Edited Messages
    const voiceStateUpdate = settings.get(message.guild.id, 'voiceStateUpdate', null) // User Voice State Update
    const noInvites = settings.get(message.guild.id, 'noInvites', null) // No Invite Links

    const embed = new MessageEmbed()
      .setColor(process.env.COLOR_BLOOD)
      .setAuthor(`Current Settings for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .addField('🌐 General', stripIndents`
      **Server Prefix:** \`${prefix}\`
      **Time Zone:** ${timezone}
      `)
      .addField('🎶 Music', stripIndents`
      **DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
      **DJ Mode:** ${djMode === true ? 'On' : 'Off'}
      **Max Song Time:** ${maxTime ? toColonNotation(maxTime) : 'Unlimited'}
      **Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
      **Allow Filters:** ${allowFilters === 'dj' ? 'DJ Only' : 'All'}
      **Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
      `)
      .addField('📃 Logging', stripIndents`
      **Moderation Logs:** ${modlog ? `<#${modlog}>` : 'None'}
      **Tag Logs:** ${taglog ? `<#${taglog}>` : 'None'}
      **guildMemberAdd:** ${guildMemberAdd ? `<#${guildMemberAdd}>` : 'None'}
      **guildMemberRemove:** ${guildMemberRemove ? `<#${guildMemberRemove}>` : 'None'}
      **guildMemberUpdate:** ${guildMemberUpdate ? `<#${guildMemberUpdate}>` : 'None'}
      **messageDelete:** ${messageDelete ? `<#${messageDelete}>` : 'None'}
      **messageUpdate:** ${messageUpdate ? `<#${messageUpdate}>` : 'None'}
      **voiceStateUpdate:** ${voiceStateUpdate ? `<#${voiceStateUpdate}>` : 'None'}
      `)
      .addField('🔨 Auto Moderation', stripIndents`
      **No Invites:** ${noInvites ? 'On' : 'Off'}
      `)
      /*
      .addField('🌟 Starboard', stripIndents`
      **Channel:** ${starboard ? `<#${starboard.channelID}>` : 'None'}
      **Emoji:** ${starboard ? starboard.options.emoji : 'Not configured'}
      **Threshold:** ${starboard ? starboard.options.threshold : 'Not configured'}
      **Color:** ${starboard ? starboard.options.color : 'Not configured'}
      **Post Attachments:** ${starboard
        ? starboard.options.attachment === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Resolve Image URLs:** ${starboard
        ? starboard.options.resolveImageUrl === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Self Star:** ${starboard
        ? starboard.options.selfStar === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Star Bot Messages:** ${starboard
        ? starboard.options.starBotMsg === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Star Embeds:** ${starboard
        ? starboard.options.starEmbed === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Allow NSFW:** ${starboard
        ? starboard.options.allowNsfw === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      `)
      */
      .setTimestamp()

    return message.reply({ embed: embed, allowedMentions: { repliedUser: false } })
  }
}