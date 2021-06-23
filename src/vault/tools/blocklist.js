const { Command } = require('discord-akairo')

module.exports = class CommandBlocklist extends Command {
  constructor () {
    super('blocklist', {
      aliases: ['blocklist', 'blacklist'],
      category: '💻 Core',
      description: {
        text: 'Adds users or guilds to the blocklist, preventing them from using the bot.',
        usage: '<type> <id>',
        details: '`<type>` The type to add. Either a user or a guild.\n`<id>` The ID of the user or the guild.'
      },
      ownerOnly: true
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const blocklist = this.client.blocklist

    if (!args[1]) return message.usage('blocklist <type> <id>')
    const switchType = args[1].toLowerCase()
    switch (switchType) {
      case 'user': {
        const userList = await blocklist.get('user')
        if (userList == null) await blocklist.set('user', [])
        const user = parseInt(args[2])
        if (isNaN(user)) return message.say('error', 'You must provide the user\'s ID.')
        if (userList.includes(args[2])) return message.say('error', `User ID \`${args[2]}\` is already in the blocklist retard.`)
        await blocklist.push('user', args[2])
        message.say('ok', `Added User ID \`${args[2]}\` to the blocklist.`)
        break
      }

      case 'guild': {
        const guildList = await blocklist.get('guild')
        if (guildList == null) await blocklist.set('guild', [])
        const guild = parseInt(args[2])
        if (isNaN(guild)) return message.say('error', 'You must provide the guild\'s ID.')
        if (guildList.includes(args[2])) return message.say('error', `Guild ID \`${args[2]}\` is already in the blocklist retard.`)
        await blocklist.push('guild', args[2])
        message.say('ok', `Added Guild ID \`${args[2]}\` to the blocklist.`)
        break
      }

      default: {
        message.say('error', 'Type must be a **user** or a **guild**.')
        break
      }
    }
  }
}
