const client = require("../../client");

function add(interaction) {
	if (client.lastAction?.message)
		client.lastAction.message.interaction.editReply({ content: "You requested another menu.", components: [] }).catch((err) => client.err(err));

	client.subjectsMenu();

	return interaction
		.reply({ components: [client.gRow], ephemeral: true })
		.then((msg) => (client.lastAction = { message: msg, value: "add" }))
		.catch((err) => client.err(err));
}

module.exports = add;
