const Discord = require("discord.js");
const { hedgehugs } = require("../../sequelize/database");

module.exports = {
    name: "play",
    description: "Play with or let your Hedgehug play with another user's Hedgehug to increase its happiness",
    async execute(message) {
        const hedgehug = await hedgehugs.findOne({
            where: {
                owner_id: message.author.id
            }
        });

        const happiness = hedgehug.get("happiness");
        var new_happiness = happiness + 40;
        if (new_happiness > 100) {
            new_happiness = 100;
        }
        hedgehug.update({happiness: new_happiness});

        const xp = hedgehug.get("xp");
        var new_xp = xp + 10;
        if (happiness === 100) {
            new_xp = xp;
        }
        hedgehug.update({xp: new_xp});

        const mention = message.mentions.users.first();

        if (mention) {
            const mention_id = mention.id;
            const other_hedgehug = await hedgehugs.findOne({
                where: {
                    owner_id: mention_id
                }
            });
            if (other_hedgehug) {
                var other_happiness = other_hedgehug.get("happiness") + 40;
                if (other_happiness > 100) {
                    other_happiness = 100;
                }
                other_hedgehug.update({happiness: other_happiness});

                const mention_embed = new Discord.MessageEmbed()
                .setColor("#fa84a4")
                .setDescription("Your Hedgehug played with " + "@" + mention.username + "'s Hedgehug!" );

                return message.channel.send(mention_embed);
            } else {
                const null_embed = new Discord.MessageEmbed()
                .setColor("#fa84a4")
                .setDescription("That user doesn't have a Hedgehug!");
                return message.channel.send(null_embed);
            }
        }
        const alone_embed = new Discord.MessageEmbed()
        .setColor("#fa84a4")
        .setDescription("You played with your Hedgehug!");
        
        message.channel.send(alone_embed);
    }
}