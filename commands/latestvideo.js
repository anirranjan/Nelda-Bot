const fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config();

module.exports = {
    name: 'latestvideo',
    description: 'Get the latest video uploaded to the Rainbow River Youtube Channel, aka Rainbow River HQ',
    cooldown: 10,
    async execute(message, args){
        let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCK5-o9Z2nP9tNOZ5AckXzPQ&order=date&type=video&key=${process.env.YOUTUBE_TOKEN}`;
        let response = await fetch(url);
        let json = await response.json();

        const embed = new Discord.MessageEmbed()
            .setTitle(json.items[0].snippet.title)
            .setURL("https://www.youtube.com/watch?v=" + json.items[0].id.videoId)
            .setImage(json.items[0].snippet.thumbnails.high.url)

        message.channel.send(embed);
    }
};  