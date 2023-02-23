const { readdirSync } = require("fs");

const client = require("../client");

function events() {
	const events = readdirSync("./events");

	for (const file of events) {
		const event = require(`../events/${file}`);

		if (event.once) client.once(event.name, (...args) => event.run(...args));
		else client.on(event.name, (...args) => event.run(...args));
	}

	return true;
}

module.exports = events;
