const { Listener } = require('discord-akairo');

module.exports = class ListenerPlayerError extends Listener
{
    constructor()
    {
        super('playerError', {
            emitter: 'player',
            event: 'error'
        });
    }

    async exec(message, error)
    {
        const args = message.content.split(/ +/g);
        const errsplit = error.message.split(/ +/g);
        if (errsplit.includes('result!')) return message.error(`No results found for \`${args.slice(1).join(' ')}\`.`, 'Track Error');
        if (errsplit.includes('Unsupported')) return message.error('That URL is not supported.', 'Track Error');
        if (errsplit.includes('416')) return message.error('Received \`Status code: 416 [Range Not Satisfiable]\`. This is a weird response. Please try again.', 'Track Error');
        if (error.name.includes('Error [VOICE_CONNECTION_TIMEOUT]')) return message.error('The connection was not established within 15 seconds. Please try again later.', 'Voice Connection Timeout')
        message.error(error.message, `Track Error \`${error.name}\``);
    }

};