const client = require("../../client");
const gradesModel = require("../../models/grades");

async function sendEmbed(interaction) {
	const gradesData = await gradesModel.findOne().catch((err) => client.err(err));

	await client.gradesEmbed(gradesData);
	const component = client.gradesComponents();

	interaction.channel
		.send({ embeds: [client.gEmbed], components: [component] })
		.then((msg) => {
			gradesModel.findOneAndUpdate({}, { $set: { message: msg } }).catch((err) => client.err(err));
			client.gradesMessage = msg;

			interaction.reply({ content: "Sent the message successfully!", ephemeral: true }).catch((err) => client.err(err));
		})
		.catch((err) => {
			interaction.reply({ content: "Failed to send message!", ephemeral: true }).catch((err) => client.err(err));
		});
}

module.exports = sendEmbed;
