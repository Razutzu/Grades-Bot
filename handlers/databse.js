const client = require("../client");

const { connect, set } = require("mongoose");

function database() {
	set("strictQuery", false);

	return connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.then(async () => client.success("Database connected"))
		.catch((err) => client.err(err));
}

module.exports = database;
