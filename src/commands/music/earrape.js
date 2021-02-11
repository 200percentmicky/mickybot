const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { earrape } = require('../../aliases.json')

module.exports = class CommandEarrape extends Command {
  constructor () {
    super(earrape !== undefined ? earrape[0] : 'earrape', {
      aliases: earrape || ['earrape'],
      category: '🎶 Player',
      description: {
        text: 'Changes the volume of the player to 42069%.',
        details: 'The ratio that no man can withstand. Only works if Unlimited Volume is On.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) {
        return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
      }
    }

    if (settings.allowFreeVolume === false) {
      return message.say('no', 'This command cannot be used because **Unlimited Volume** is off.')
    }

    // This command should not be limited by the DJ Role. Must be a toggable setting.
    const vc = message.member.voice.channel
    if (!vc) {
      return message.say('error', 'You are not in a voice channel.')
    }

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) {
      return message.say('warn', 'Nothing is currently playing on this server.')
    }

    const earrape = 42069 // 😂👌👌💯
    const volume = this.client.player.getQueue(message).volume
    if (volume >= 5000) {
      this.client.player.setVolume(message, 100)
      return message.say('ok', 'Volume has been set to **100%** 😌😏')
    } else {
      this.client.player.setVolume(message, earrape)
      return message.channel.send(new MessageEmbed()
        .setColor(this.client.color.ok)
        .setDescription(`🔊💢💀 Volume has been set to **${earrape}%**. 😂👌👌`)
        .setFooter('Volumes exceeding 200% may cause damage to self and equipment.')
      )
    }
  }
}
