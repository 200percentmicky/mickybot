const { Command } = require('discord-akairo')

module.exports = class CommandAllowExplicit extends Command {
  constructor () {
    super('allowexplicit', {
      aliases: ['allowexplicit'],
      category: '⚙ Settings',
      description: {
        text: 'Toggles the ability to allow age restricted content in the queue.',
        usage: '<toggle:on/off>',
        details: `\`<toggle:on/off>\` The toggle of the setting.\n${process.env.EMOJI_WARN} This setting only applies to videos on YouTube. All pornographic websites are blocked regardless if this setting is on or not.`
      },
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    if (!args[1]) return message.usage('allowexplicit <toggle:on/off>')

    const settings = this.client.settings
    switch (args[1]) {
      case 'on': {
        await settings.set(message.guild.id, 'allowAgeRestricted', true)
        message.say('ok', 'Age restricted content can now be added to the queue.')
        break
      }
      case 'off': {
        await settings.set(message.guild.id, 'allowAgeRestricted', false)
        message.say('ok', 'Age restricted content can no longer be added to the queue.')
        break
      }
      default: {
        message.say('error', 'Toggle must be **on** or **off**.')
        break
      }
    }
  }
}