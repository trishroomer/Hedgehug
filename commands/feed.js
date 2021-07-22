const Discord = require("discord.js");
const {hedgehugs, user_items, items} = require("../sequelize/database.js");
const Jimp = require("jimp");

module.exports = {
    name: "feed",
    description: "feeds your hedgehug",
    async execute(message, args) {
        const inventory = await user_items.findAll({ // fetch all food items (emojis) in user's inventory
            attributes: ["item"],
            where: {
                user: message.author.id,
                category: "Food"
            }
        });

        const itemlist = inventory.map(i => i.item); // returns an array with fetched food emojis
        if (itemlist.length == 0) { // array is empty
            const empty_embed = new Discord.MessageEmbed()
            .setColor("#fa84a4")
            .setDescription("You do not own any food items!");
            return message.channel.send(empty_embed);
        }
        
        var embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setDescription("What do you want to feed your Hedgehug?");

        const msg = await message.channel.send(embed);

        for (i = 0; i < itemlist.length; i++) { // bot reacts to msg with fetched food emojis
            msg.react(itemlist[i]);
        }

        const filter = (reaction, user) => {
            return user.id === message.author.id; // user that reacted has to be the same one that wrote the command
        }

        const collector = msg.createReactionCollector(filter, {
            time: 60000
        });

        collector.on("collect", async (reaction, user) => {
            const react = await items.findOne({ // finds item (emoji) that user reacted with
                where: {
                    emoji: reaction.emoji.name
                }
            });

            if (react === null) {
                const null_embed = new Discord.MessageEmbed()
                .setColor("#fa84a4")
                .setDescription("That's not a food item!");
                return message.channel.send(null_embed);
            }

            const hedgehug = await hedgehugs.findOne({ // finds user's hedgehug
                where: {
                    owner_id: message.author.id
                }
            });
    
            const current_hunger = hedgehug.get("hunger");
            const current_xp = hedgehug.get("xp");
            const price = react.get("price");

            if (price === 2) { // price determines 'calories' of food
                var new_hunger = current_hunger + 20;
            } else {
                var new_hunger = current_hunger + 50;
            }

            if (new_hunger > 100) { // hedgehug is already full
                new_hunger = 100;
            }

            if (current_hunger === 100) {
                const full_embed = new Discord.MessageEmbed()
                .setColor("#fa84a4")
                .setDescription("Your hedgehug is full!");
                return message.channel.send(full_embed); // prevents xp abuse
            } else {
                var new_xp = current_xp + 5;
            }

            await hedgehug.update({hunger:new_hunger});
            await hedgehug.update({xp: new_xp});
            await hedgehug.update({hunger_update: message.createdAt});

            var embed = new Discord.MessageEmbed()
            .setColor("fa84a4")
            .setDescription("You fed your Hedgehug " + reaction.emoji.name + "!");

            
            const inventory_item = await user_items.findOne({
                where: {
                    user: message.author.id, 
                    item: reaction.emoji.name,
                }
            });
            if (inventory_item.amount > 1) { // user owns item more than once so amount column value is decremented
                const new_amount = inventory_item.amount -= 1; 
                await inventory_item.update({amount: new_amount}); 
                return message.channel.send(embed);
            } else { // safe to destroy tag because user doesn't have any of this item left
                await inventory_item.destroy();
                message.channel.send(embed);
            }
        });
    }
}