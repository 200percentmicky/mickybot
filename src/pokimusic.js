/*
 * * PokiMusic - A feature-rich music bot for Poki. Created by Micky-kun
 * Licensed under the MIT License. Please read LICENSE for more information.

/*
Here lies the messy outcome of a lazy programmer.
Either that or it's Javascript.
*/

'use strict'

// Configuring winston
const chalk = require('chalk')
const { createLogger, format, transports } = require('winston')
const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.timestamp(),
    format.label({ label: '==>' }),
    format.printf(({ timestamp, label, level, message }) => {
      return `[${timestamp}] ${label} ${level}: ${message}`
    })
  ),
  transports: [
    new transports.File({
      filename: 'console.log'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
      format.printf(({ timestamp, label, level, message }) => {
        return `${chalk.black.cyan(`[${timestamp}]`)} ${label} ${level}: ${message}`
      })
    )
  }))
}

const { version } = require('../package.json')
logger.info('    ____        __   _ __  ___           _     ')
logger.info('   / __ \\____  / /__(_)  |/  /_  _______(_)____')
logger.info('  / /_/ / __ \\/ //_/ / /|_/ / / / / ___/ / ___/')
logger.info(' / ____/ /_/ / ,< / / /  / / /_/ (__  ) / /__  ')
logger.info('/_/    \\____/_/|_/_/_/  /_/\\__,_/____/_/\\___/  ')
logger.info('                                                  ')
logger.info(`PokiMusic - Version: ${version}`)

if (process.versions.node < '14.0.0') {
  logger.error('PokiMusic requires at least Node.js v%s. You have v%s installed. Please update your existing Node installation. Aborting...', '14.0.0', process.versions.node)
  process.exit(1)
}

logger.info('Loading libraries...')
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo')
const prefix = require('discord-prefix')
const { Structures, MessageEmbed, Intents } = require('discord.js')
const Enmap = require('enmap')
const DisTube = require('distube')
const moment = require('moment')

const config = require('./config.json')
const emoji = require('./emoji.json')
const color = require('./colorcode.json')
const urlicon = require('./urlicon.json')

// Extending a few things...
Structures.extend('Message', Message => {
  class MessageStructure extends Message {
    // Universal Embed dialogs.
    say (type, description, title) {
      const embedColor = {
        ok: color.music,
        warn: color.warn,
        error: color.error,
        info: color.info,
        no: color.no
      }

      const emojiPerms = this.channel.permissionsFor(this.client.user.id).has(['USE_EXTERNAL_EMOJIS'])
      const embedEmoji = {
        ok: emojiPerms ? emoji.music : '🎵',
        warn: emojiPerms ? emoji.warn : '⚠',
        error: emojiPerms ? emoji.error : '❌',
        info: emojiPerms ? emoji.info : 'ℹ',
        no: emojiPerms ? emoji.no : '🚫'
      }

      const embedIcon = {
        ok: urlicon.ok,
        warn: urlicon.warn,
        error: urlicon.error,
        info: urlicon.info,
        no: urlicon.no
      }

      const embed = new MessageEmbed()
        .setColor(embedColor[type])

      if (title) {
        embed.setAuthor(title, embedIcon[type])
        embed.setDescription(description)
      } else {
        embed.setDescription(`${embedEmoji[type]} ${description}`)
      }

      if (this.channel.type === 'dm') {
        return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      } else {
        if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS'])) {
          return this.reply(title
            ? `${embedEmoji[type]} **${title}** | ${description}`
            : `${embedEmoji[type]} ${description}`
          , { allowedMentions: { repliedUser: false } })
        } else return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      }
    }

    // Shows the commands usage in case no arguments were provided for
    // some commands.
    usage (syntax) {
      const guildPrefix = prefix.getPrefix(this.guild.id) || config.prefix
      const embed = new MessageEmbed()
        .setColor(color.info)
        .setAuthor('Usage', urlicon.info)
        .setDescription(`\`${guildPrefix}${syntax}\``)
      this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
    }

    // Custom style embeds.
    custom (emoji, color, description, title) {
      const embed = new MessageEmbed()
        .setColor(color)

      if (title) {
        embed.setTitle(`${emoji} ${title}`)
        embed.setDescription(description)
      } else {
        embed.setDescription(`${emoji} ${description}`)
      }

      if (this.channel.type === 'dm') {
        return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      } else {
        if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS'])) {
          return this.reply(title
            ? `${emoji} **${title}** | ${description}`
            : `${emoji} ${description}`
          , { allowedMentions: { repliedUser: false } })
        } else return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      }
    }

    // Error Handling. Used to send to the support server.
    // This will not be useful if self-hosting this bot.
    async recordError (type, command, title, error) {
      // Consider replacing the channel ID for your own error reporting
      // channel until the feature is supported in the configs.
      const errorChannel = this.client.channels.cache.get('603735567733227531')
      const embed = new MessageEmbed()
        .setTimestamp()
        .addField('Server', this.channel.type === 'dm'
          ? 'Direct Message'
          : this.guild.name + '\nID: ' + this.guild.id, true
        )
        .addField('Channel', this.channel.type === 'dm'
          ? 'Direct Message'
          : this.channel.name + '\nID: ' + this.channel.id, true
        )

      if (command) {
        // I was rather lazy with this one. I'm not sure if Akairo is able to
        // provide what command is invoked. Hard coding seems to not be an issue atm...
        embed.addField('Command', command, true)
      }

      if (type === 'warning') {
        logger.warn(error)
        embed.setColor(color.warn)
        embed.setTitle(emoji.warn + title)
      }

      if (type === 'error') {
        logger.error(error)
        embed.setColor(color.error)
        embed.setTitle(emoji.error + title)
      }

      await errorChannel.send(embed)
      return errorChannel.send(error, { code: 'js', split: true })
    }
  }

  return MessageStructure
})

class PokiMusic extends AkairoClient {
  constructor () {
    super({
      ownerID: config.owner
    }, {
      disableMentions: 'true',
      // Changing the offset to a lower number than 500 will cause the
      // reactions to show faster, but it also comes with a cost of having
      // your bot rate-limited.
      restTimeOffset: 175,
      intents: new Intents(Intents.NON_PRIVILEGED, 'GUILD_MEMBERS')
    })

    // Configuration files.
    this.config = config
    this.emoji = emoji
    this.color = color

    // Packages
    this.utils = require('bot-utils')
    this.moment = moment
    this.prefix = prefix
    this.logger = logger
    this.si = require('systeminformation')
    this.player = new DisTube(this, {
      emitNewSongOnly: true,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      youtubeCookie: config.ytCookie,
      highWaterMark: 1 << 25,
      youtubeDL: true,
      updateYouTubeDL: false,
      customFilters: {
        vibrato: 'vibrato=f=7:d=1',
        demonic: 'vibrato=f=2500:d=1'
      }
    })

    this.defaults = {
      djMode: false,
      djRole: null,
      allowFreeVolume: true,
      nowPlayingAlerts: true,
      maxTime: null,
      maxQueueLimit: null
    }

    logger.info('Loading settings...')
    this.settings = new Enmap({
      name: 'settings',
      fetchAll: true
    })

    this.commands = new CommandHandler(this, {
      directory: './src/commands',
      prefix: message => message.channel.type === 'text'
        ? prefix.getPrefix(message.guild.id) || config.prefix
        : config.prefix,
      commandUtil: true,
      handleEdits: true,
      allowMention: true
    })
    this.listeners = new ListenerHandler(this, {
      directory: './src/listeners'
    })
    this.inhibitors = new InhibitorHandler(this, {
      directory: './src/inhibitors'
    })

    this.listeners.setEmitters({
      process: process,
      commandHandler: this.commands,
      player: this.player
    })

    this.commands.useInhibitorHandler(this.inhibitors)
    this.commands.useListenerHandler(this.listeners)

    this.commands.loadAll()
    this.listeners.loadAll()

    if (process.env.NODE_ENV === 'production') {
      this.inhibitors.loadAll()
    }
  }
}

module.exports = PokiMusic