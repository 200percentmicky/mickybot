const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandVolume extends Command {
  constructor () {
    super('volume', {
      aliases: ['volume', 'vol'],
      category: '🎶 Player',
      description: {
        text: 'Changes the volume of the player.',
        usage: '<number>',
        details: '`<number>` The percentage of the new volume to set.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const args = message.content.split(/ +/g)

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.say('warn', 'Nothing is currently playing on this server.')

    const volume = queue.volume
    if (!args[1]) {
      const volumeEmoji = () => {
        const volumeIcon = {
          50: '🔈',
          100: '🔉',
          150: '🔊'
        }
        if (volume > 175) return '🔊😭👌'
        return volumeIcon[Math.round(volume / 50) * 50]
      }
      return message.custom(volumeEmoji(), this.client.color.info, `Current Volume: **${volume}%**`)
    }

    let newVolume = parseInt(args[1])
    if (settings.allowFreeVolume === false) newVolume = 200
    this.client.player.setVolume(message.guild.id, newVolume)

    if (newVolume >= 201) {
      const embed = new MessageEmbed()
        .setColor(this.client.color.warn)
        .setDescription(`${this.client.emoji.warn} Volume has been set to **${newVolume}%**.`)
        .setFooter('Volumes exceeding 200% may cause damage to self and equipment.')
      message.channel.send({ embed: embed, allowedMentions: { repliedUser: false } })
    } else {
      return message.say('ok', `Volume has been set to **${newVolume}%**.`)
    }
  }
}
