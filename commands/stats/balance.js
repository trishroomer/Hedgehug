const Discord = require("discord.js");
const {users} = require("../../sequelize/database.js");

module.exports = {
    name: "balance",
    description: "Displays the amount of Hedgecoins you own",
    async execute(message) {
        const user = await users.findOne({
            where: {
                user_id: message.author.id
            }
        });
        const balance = user.get("balance");
        const embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setDescription("Your balance is " + balance + " Hedgecoins!");
        message.reply(embed);
    }
}