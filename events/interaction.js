const client = require("../client");

function interactionCreate(interaction) {
	let path = "../interactions/";

	if (interaction.isChatInputCommand()) path += `commands/${interaction.commandName}`;
	else if (interaction.isButton()) path += `buttons/${interaction.customId}`;
	else if (interaction.isStringSelectMenu()) path += `menues/${interaction.customId}`;

	try {
		require(path)(interaction);
	} catch (err) {
		client.err(err);
	}

	return client.info(`${client.colors.yellow}${path}${client.colors.white} was executed by ${interaction.user.tag}`);
}

module.exports = {
	name: "interactionCreate",
	once: false,
	run: interactionCreate,
};
