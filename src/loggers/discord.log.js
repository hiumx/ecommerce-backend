'use strict'

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`Logged at ${client.user.tag}`);
});

const token = 'MTIxNjI1MjUyNTUyMzYzMjE5OA.Gg38Ch.3Iqhu3ufwjis-ss7g6wkPQkcJs6UbK5QyyDhBU';

client.login(token);

client.on('messageCreate', msg => {
    if(msg.author.bot) return;

    if(msg.content === 'hello') {
        msg.reply('Hello! How can i help you today?');
    }
    if(msg.content === 'i have great day') {
        msg.reply('Great! Congratulation!');
    }
});