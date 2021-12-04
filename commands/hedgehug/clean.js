const Discord = require("discord.js");
const {hedgehugs, users} = require("../../sequelize/database.js");

module.exports = {
    name: "clean",
    aliases: ["wash",  "bathe"],
    description: "Increases your Hedgehug's hygiene",
    async execute(message) {
        const hedgehug = await hedgehugs.findOne({
            where: {
                owner_id: message.author.id
            }
        });

        const current_hygiene = hedgehug.get("hygiene");
        if (current_hygiene === 100) {
            const clean_embed = new Discord.MessageEmbed()
            .setColor("#fa84a4")
            .setDescription("Your Hedgehug is already very clean!")
            return message.channel.send(clean_embed);
        }

        await hedgehug.update({hygiene: 100});
        await hedgehug.update({hygiene_update: message.createdAt});

        const user = await users.findOne({
            where: {
                id: message.author.id
            }
        });

        const current_xp = user.get("xp");
        const new_xp = current_xp + 10;
        
        await user.update({xp: new_xp});

        const embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setDescription("You succesfully cleaned your Hedgehug!");

        message.channel.send(embed);
    }
}
