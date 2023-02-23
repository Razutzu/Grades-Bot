const client = require("../../client");

function subject(interaction) {
	client.gradesMenu();

	if (!client.lastAction?.message) return;

	interaction.deferUpdate();
	client.lastAction.message.interaction
		.editReply({ components: [client.gRow] })
		.then(() => (client.lastAction.value = `${interaction.values[0]}_${client.lastAction.value}`))
		.catch((err) => client.err(err));
}
module.exports = subject;
