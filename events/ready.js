const client = require("../client");
const gradesModel = require("../models/grades");

const { ActivityType } = require("discord.js");

async function ready() {
	await require("../handlers/databse")();
	await client.createDocument();
	require("../handlers/commands")();

	const gradesData = await gradesModel.findOne().catch((err) => client.err(err));

	if (!gradesData) return client.warn("Please restart the bot");

	const channel = client.channels.cache.get(process.env.CHANNEL_ID);
	if (!channel) return client.warn("The CHANNEL_ID is wrong!");

	if (gradesData.message == "none") client.info("The value message is none, use the command /sendembed");
	else {
		const message = await channel.messages.fetch(gradesData.message).catch(() => {});

		if (!message) client.warn("No message, use the command /sendembed");
		else {
			await client.gradesEmbed(gradesData);
			const components = client.gradesComponents();

			message.edit({ embeds: [client.gEmbed], components: [components] }).then((msg) => {
				gradesData
					.updateOne({ $set: { message: msg } })
					.then(() => {
						client.success("Message updated");
						client.gradesMessage = msg;
					})
					.catch((err) => client.err(err));
			});
		}
	}

	client.user.setActivity("grades", { type: ActivityType.Watching });

	return client.success(`${client.user.tag} is ready`);
}

module.exports = {
	name: "ready",
	once: true,
	run: ready,
};
