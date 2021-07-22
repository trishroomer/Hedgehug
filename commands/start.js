const Discord = require("discord.js");
const {hedgehugs, users} = require("../sequelize/database.js");

module.exports = {
    name: "start",
    description: "adds a hedgehug to a user",
    execute(message, args) {
        const name_embed = new Discord.MessageEmbed()
        .setDescription("What do you want to call your Hedgehug?")
        .setColor("#fa84a4");
        message.channel.send(name_embed);

        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, {
            max: 1,
            time: 30000
        });
        collector.on("collect", async m => {
            try {
                await hedgehugs.create({
                    owner_id: m.author.id,
                    name: m.content,
                    hunger_update: m.createdAt,
                    hygiene_update: m.createdAt,
                    happiness_update: m.createdAt
                });
                await users.create({
                    user_id: m.author.id,
                });
            } catch (e) {
                if (e.name === "SequelizeUniqueConstraintError") {
                    const own_embed = new Discord.MessageEmbed()
                    .setDescription("You already own a Hedgehug!")
                    .setColor("#fa84a4");
                    return message.channel.send(own_embed);
                } else {
                    const error_embed = new Discord.MessageEmbed()
                    .setDescription("Sorry, something went wrong!")
                    .setColor("#fa84a4");
                    return message.channel.send(error_embed);
                }
            }
            const succes_embed = new Discord.MessageEmbed()
            .setDescription("Congrats! You now own a hedgehug called " + m.content)
            .setColor("#fa84a4");
            message.channel.send(succes_embed);
        });
    }
}