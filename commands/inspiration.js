const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'inspiration',
    description: 'Posts a random image from Unsplash to help you get art inspiration',
    cooldown: 10,
    async execute(message, args){
        let inspirationurl = `https://picsum.photos/v2/list?limit=100`;
        let inspirationResponse = await fetch(inspirationurl);
        let inspirationjson = await inspirationResponse.json();
        const inspirationIndex = Math.floor(Math.random() * 100);

        const inspirationEmbed = new Discord.MessageEmbed()
            .setImage(inspirationjson[inspirationIndex].download_url)
            .setFooter("Image From Unsplash")

        message.channel.send(inspirationEmbed);
    }
};