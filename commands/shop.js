const Discord = require("discord.js");
const {items, users, user_items} = require("../sequelize/database.js");

module.exports = {
    name: "shop",
    description: "opens the shop where the user can buy items for their hedgehug",
    async execute(message, args) {
        var shop_embed = new Discord.MessageEmbed()
            .setColor("#fa84a4")
            .setTitle("Welcome to the shop!")
            .addFields(
                {
                    name: "Food",
                    value: ":apple: Apple \n:banana: Banana \n:strawberry: Strawberry \n:blueberries: Berries \n:watermelon: Watermelon \n:pizza: Pizza \n:hamburger: Burger \n:poultry_leg: Chicken \n:pancakes: Pancakes \n:cake: Cake",
                    inline: true
                },
                {
                    name: "Clothing",
                    value: ":sunglasses: Sunglasses \n:cowboy: Cowboy hat \n:tophat: Magician hat \n:mortar_board: Graduate cap \n:scarf: Scarf \n:partying_face: Party hat \n:headphones: Headset \n:cherry_blossom: Pink headset \n:cat: Cat ears \n:rabbit: Bunny ears",
                    inline: true
                }
            );
        var shop = await message.channel.send(shop_embed);

        let emojis = ["🍎", "🍌", "🍓", "🫐", "🍉",
                    "🍕", "🍔", "🍗", "🥞", "🍰",
                    "😎", "🤠", "🎩", "🎓", "🧣",
                    "🥳", "🎧", "🌸", "🐱", "🐰"];

        for (i = 0; i < emojis.length; i++) { // bot reacts to shop message with all items available
            shop.react(emojis[i]);
        }

        const filter = (reaction, user) => {
            return emojis.includes(reaction.emoji.name) && user.id === message.author.id; 
        } 

        const collector = shop.createReactionCollector(filter, {
            time: 60000
        });

        collector.on("collect", async (reaction, user) => {
            const item = await items.findOne({
                where: {
                    emoji: reaction.emoji.name
                }
            });
            const item_cost = item.get("price");
            const person = await users.findOne({
                where: {
                    user_id: message.author.id,
                }
            });
            const person_balance = person.get("balance"); 
            if (item_cost > person_balance) {
                return message.channel.send("Sorry, you do not have enough money!");
            } else {
                const new_balance = person_balance - item_cost;
                await person.update({balance: new_balance});
                
                const already_owns = await user_items.findOne({
                where: {
                    user: message.author.id, 
                    item: reaction.emoji.name}
                });
                if (already_owns) {
                    already_owns.amount += 1;
                    message.channel.send("Thank you for buying " + reaction.emoji.name + "! You can find it in your inventory.");
                    return already_owns.save();
                }

                const category = item.get("category");

                await user_items.create({
                    user: message.author.id,
                    item: reaction.emoji.name,
                    amount: 1,
                    category: category
                });

                message.channel.send("Thank you for buying " + reaction.emoji.name + "! You can find it in your inventory.");
            }
        });
    }
}