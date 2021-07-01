require('dotenv').config();

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    cooldown: 5,
    execute(message, args){
        const data = [];
        const { commands } = message.client;

        if(!args.length){
            data.push('Here\'s a list of all my commands:\n');
            data.push(commands.map(command => command.name).join('\n'));
            data.push(`\nYou can send \`${process.env.PREFIX}help [command name]\` to get info on a specific command!`);

            return message.channel.send(data, {split: true});
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if(!command){
            return message.reply('That\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);
        data.push(`**Description:** ${command.description}`);
        data.push(`**Usage:** ${process.env.PREFIX}${command.name}`);
        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, {split: true});
    }
};