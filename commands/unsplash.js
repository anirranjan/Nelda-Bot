const fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config
const querystring = require('querystring');

module.exports = {
    name: 'unsplash',
    description: 'Searches Unsplash\'s page for a specific image',
    cooldown: 60,
    async execute(message, args){
        if(!args.length){
            return message.channel.send('You need to supply a search term');
        }

        const query = querystring.stringify({ term: args.join(' ')});

        let url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.UNSPLASH_TOKEN}`;
        let response = await fetch(url);
        let json = await response.json();

        if(!json.results.length){
            return message.channel.send(`No results found for **${args.join(' ')}**.`);
        }

        const unsplashIndex = Math.floor(Math.random() * 10);

        const unsplashEmbed = new Discord.MessageEmbed()
            .setImage(json.results[unsplashIndex].urls.regular)
            .setFooter("Photo by " + json.results[unsplashIndex].user.name + " from Unsplash")

        message.channel.send(unsplashEmbed);
    }
}