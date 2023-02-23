const client = require("../client");

const { SlashCommandBuilder } = require("discord.js");

function commands() {
	if (!client.updateCommands) return client.info(`client.updateCommands is on false`);

	return client.application.commands
		.set([new SlashCommandBuilder().setName("sendembed").setDescription("Sends the grade's embed")])
		.then(() => client.success("The commands have been updated"))
		.catch((err) => client.err(err));
}

module.exports = commands;
