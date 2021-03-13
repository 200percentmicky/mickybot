const { Listener } = require('discord-akairo')
const { bruh } = require('./bruh.json')

// This is just a test to see if listeners can only have one file per event.
// If this works, I would like to have multiple files listening to the 'message' event.
module.exports = class ListenerTriggers extends Listener {
  constructor () {
    super('triggers', {
      emitter: 'client',
      event: 'message'
    })
  }

  async exec (message) {
    if (message.author.bot) return // Glitched to hell lmao

    const phrases = {
      ayy: 'lmao',
      bruh: bruh[Math.floor(Math.random() * bruh.length)],
      senpai: `${message.author.toString()}-senpai! <3`
    }

    if (phrases[message.content.toLowerCase()]) {
      message.channel.send(phrases[message.content.toLowerCase()])
    }
  }
}
