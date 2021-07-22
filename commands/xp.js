const Discord = require("discord.js");
const {hedgehugs} = require("../sequelize/database.js");

module.exports = {
    name: "xp",
    description: "displays xp",
    async execute(message, args) {
        const hedgehug = await hedgehugs.findOne({
            where: {
                owner_id: message.author.id
            }
        });
        const xp = hedgehug.get("xp");
        const embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setDescription("You have " + xp + " xp!"); 
        message.channel.send(embed);
    }
}