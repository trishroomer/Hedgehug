const Discord = require("discord.js");
const {hedgehugs} = require("../../sequelize/database.js");

module.exports = {
    name: "level",
    description: "Displays the level of your Hedgehug",
    async execute(message) {
        const hedgehug = await hedgehugs.findOne({
            where: {
                owner_id: message.author.id
            }
        });
        const embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setDescription("You are at level " + hedgehug.get("level") + "!");
        message.channel.send(embed);
    }
}