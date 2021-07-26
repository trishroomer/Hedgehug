const Discord = require("discord.js");
const {prefix} = require("../../config.json");

module.exports = {
    name: "help",
    description: "Lists all useable commands",
    execute(message) {
        const embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setTitle("Commands:")
        .setDescription("Your Hedgehug 🦔:\n```start, hedgehug, feed```\nStats:\n```balance, level, xp```\nUtilities:\n```shop, inventory```");
        message.channel.send(embed);
    }

}