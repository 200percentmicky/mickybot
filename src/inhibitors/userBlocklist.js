const { Inhibitor } = require('discord-akairo')

module.exports = class InhibitorUserBlocklist extends Inhibitor {
  constructor () {
    super('userBlocklist', {
      reason: 'userBlocklist',
      priority: 1
    })
  }

  async exec (message) {
    const blocklist = await this.client.blocklist.get('user')
    return blocklist.includes(message.member.user.id)
  }
}
