const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

const {hedgehugs, users, items, user_items} = require("./sequelize/database.js");

client.once("ready", () => {
    console.log("Ready!");
    hedgehugs.sync().then(users.sync()).then(items.sync()).then(user_items.sync());
    client.user.setPresence({activity: {name: prefix + "help | " + prefix + "start"}});
});

const config = require("./config.json");
client.login(config.token);

const prefix = config.prefix;

client.commands = new Discord.Collection();
const commands_folder = fs.readdirSync("./commands")

for (const folder of commands_folder) {
	const command_files = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of command_files) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
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
