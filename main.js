const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

const {hedgehugs, users, items, user_items} = require("./sequelize/database.js");

const prefix = 'h/';

client.once("ready", () => {
    console.log("Ready!");
    hedgehugs.sync(); 
    users.sync();
    items.sync(); 
    user_items.sync();
    client.user.setPresence({activity: {name: prefix + "help | " + prefix + "start"}});
});

const config = require("./config.json");
client.login(config.token);

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("message", message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply("there was an error trying to execute that command!");
	}
});
