const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();
const cronJob = require('cron').CronJob;
const { CronJob } = require('cron');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

var challenge = fs.readFileSync('prompts.txt').toString().split("\n");

client.once('ready', () => {
    console.log('Ready!');

    var job = new CronJob('0 14 * * *', function() {
        const index = Math.floor(Math.random() * challenge.length);
        var channel = client.channels.cache.get(process.env.CHANNEL_ID);
        channel.send('Hello artists! Here\'s the modelling/drawing challenge of the day: ' + challenge[index] + '.');
    }, null, true, 'America/Chicago');
    job.start();
    
    // setInterval(() => {
    //     const index = Math.floor(Math.random() * challenge.length);
    //     var channel = client.channels.cache.get(process.env.CHANNEL_ID);
    //     channel.send('Hello artists! Here\'s the modelling/drawing challenge of the day: ' + challenge[index] + '.');
    // }, 3000)
});

client.on('message', async message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if(!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    const { cooldowns } = client;

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)){
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime){
            const timeLeft =  (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.log(error);
        message.reply('There was an error trying to execute that command');
    }
});

client.login(process.env.DISCORD_TOKEN);