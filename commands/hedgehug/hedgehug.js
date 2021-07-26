const Discord = require("discord.js");
const {hedgehugs} = require("../../sequelize/database.js");

module.exports = {
    name: "hedgehug",
    description: "Displays your Hedgehug with its name, level, appearance, and needs",
    async execute(message) {
        const hedgehug = await hedgehugs.findOne({
            where: {
                owner_id: message.author.id
            }
        });

        const embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setTitle(hedgehug.get("name") + "\nLevel: " + hedgehug.get("level"))
        .setThumbnail("https://media4.giphy.com/media/MdizRL0P1myvwsuP5B/giphy.gif?cid=790b76110c53f13c278f1425c5447817113890bc621d4d23&rid=giphy.gif&ct=s")
        .addFields(
            {
                name: "Hunger",
                value: hedgehug.get("hunger"),
                inline: true
            },
            {
                name: "Hygiene",
                value: hedgehug.get("hygiene"),
                inline: true
            },
            {
                name: "Happiness",
                value: hedgehug.get("happiness"),
                inline: true
            }
        );
        
        message.channel.send(embed);
    }
}