const Discord = require("discord.js");
const {user_items} = require('../../sequelize/database.js');

module.exports = {
    name: "inventory",
    description: "After buying items, they will be displayed here, paired with their amounts",
    async execute(message) {
        const inventory = await user_items.findAll({
            attributes: ["item", "amount"],
            where: {
                user: message.author.id
            }
        });
        const items = inventory.map(i => i.item);
        const amount = inventory.map(i => i.amount);
        if (items.length === 0) {
            const no_items_embed = new Discord.MessageEmbed()
            .setColor("#fa84a4")
            .setDescription("You don't own anything!");
            return message.channel.send(no_items_embed);
        }
        for (i = 0; i < items.length, i < amount.length; i++) {
            message.channel.send(amount[i] + "x " + items[i]);
        }
    }
}