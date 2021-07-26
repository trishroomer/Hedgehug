const Discord = require("discord.js");
const {users} = require("../../sequelize/database.js");

module.exports = {
    name: "money",
    description: "Adds 10 Hedgecoins to a user (for testing purposes)",
    async execute(message) {
        const user = await users.findOne({
            where: {
                user_id: message.author.id
            }
        });
        const balance = user.get("balance");
        const new_balance = balance + 10;
        await users.update({balance: new_balance}, {
            where: {
                user_id: message.author.id
            }
        });
        const embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setDescription("You got 10 Hedgecoins, you now have " + new_balance + " Hedgecoins!");
        message.channel.send(embed);
    }
}