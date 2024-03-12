'use strict'

const { Client, GatewayIntentBits } = require('discord.js');

require('dotenv').config();

const {
    CHANNEL_ID_DISCORD,
    TOKEN_DISCORD
} = process.env;

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.channelId = CHANNEL_ID_DISCORD;

        this.client.on('ready', () => {
            console.log(`Logged at ${this.client.user.tag}`);
        });

        this.client.login(TOKEN_DISCORD);
    }

    sendToFormatCode(logData) {
        const {code, message = 'This is some additional information about the code', title = 'Code example'} = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00'),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ] 
        }
        this.sendToMessage(codeMessage);
    }

    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId);
        if(!channel) {
            console.log(`Can not found channel: ${this.channelId}`);
            return;
        }

        channel.send(message).catch(e => console.log(e));
    }
}

module.exports = new LoggerService();