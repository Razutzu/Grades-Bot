require("dotenv").config();

const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	EmbedBuilder,
	GatewayIntentBits,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} = require("discord.js");
const gradesModel = require("./models/grades");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.login(process.env.TOKEN);

client.clr = 0x03fc5a;
client.createModel = false;
client.updateCommands = false;

client.lastAction = null;
client.gradesMessage = null;

client.gEmbed;
client.gMenu;
client.gRow;

client.colors = {
	white: "\033[0m",
	red: "\033[31m",
	green: "\033[32m",
	blue: "\033[34m",
	yellow: "\033[33m",
};

client.dbSubjects = ["matematica", "fizica", "biologie", "chimie", "informatica", "romana", "rusa", "engleza", "istorie", "geografie", "optional"];

client.subjects = [
	"Matematica",
	"Fizica",
	"Biologie",
	"Chimie",
	"Informatica",
	"Limba si literatura romana",
	"Limba rusa",
	"Limba engleza",
	"Istorie",
	"Geografie",
	"Optional",
];

let time;
client.log = (color, tag, msg) => {
	time = new Date();
	console.log(`${client.colors.yellow}[ ${time.toLocaleTimeString()} ] ${client.colors[color]}[${tag}]${client.colors.white} ${msg}`);
};

client.err = (err) => client.log("red", "  Error  ", err.stack);
client.warn = (warn) => client.log("red", " Warning ", warn);
client.success = (msg) => client.log("green", " Success ", msg);
client.info = (info) => client.log("blue", "  Info.  ", info);

client.createDocument = async () => {
	if (!client.createModel) return client.info("client.createModel is on false");

	gradesModel
		.findOneAndDelete()
		.then(() => {
			client.success("Old document deleted");

			gradesModel
				.create({
					message: "none",
					matematica: [],
					fizica: [],
					biologie: [],
					chimie: [],
					informatica: [],
					romana: [],
					rusa: [],
					engleza: [],
					istorie: [],
					geografie: [],
					optional: [],
					allGrades: [],
				})
				.then(() => client.success(`New document created`))
				.catch((err) => client.err(err));
		})
		.catch((err) => client.err(err));

	return true;
};

client.gradesEmbed = async (gradesData) => {
	client.gEmbed = new EmbedBuilder().setColor(client.clr);

	let subjectGrades;
	for (let i = 0; i < client.subjects.length; i++) {
		subjectGrades = gradesData[client.dbSubjects[i]];

		let data = { name: client.subjects[i], value: "" };

		if (subjectGrades.length == 0) {
			data.value += `Toate notele: Nicio nota\nMedia: 0.00`;
		} else {
			data.value += `Toate notele: ${subjectGrades.join(", ")}\nMedia: ${(subjectGrades.reduce((partialSum, a) => partialSum + a, 0) / subjectGrades.length).toFixed(2)}`;
		}

		client.gEmbed.addFields(data);
	}

	let semesterGrade;

	if (gradesData.allGrades.length == 0) semesterGrade = 0.0;
	else semesterGrade = gradesData.allGrades.reduce((partialSum, a) => partialSum + a, 0) / gradesData.allGrades.length;

	client.gEmbed.addFields([
		{
			name: "Rezultate finale",
			value: `Semestrul I: 8.00\nSemestrul II: ${semesterGrade.toFixed(2)}\nMedia finala: ${((semesterGrade + 8) / 2).toFixed(2)}`,
		},
	]);

	return client.gEmbed;
};

client.gradesComponents = () => {
	return new ActionRowBuilder().setComponents([
		new ButtonBuilder().setCustomId("add").setStyle(ButtonStyle.Primary).setLabel("Adauga"),
		new ButtonBuilder().setCustomId("remove").setStyle(ButtonStyle.Primary).setLabel("Elimina"),
	]);
};

client.subjectsMenu = () => {
	client.gMenu = new StringSelectMenuBuilder().setCustomId("subjects").setPlaceholder("Alege o materie");
	client.gRow = new ActionRowBuilder().setComponents([client.gMenu]);

	for (let i = 0; i < client.subjects.length; i++)
		client.gMenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(client.subjects[i]).setValue(client.dbSubjects[i]));
};

client.gradesMenu = () => {
	client.gMenu = new StringSelectMenuBuilder().setCustomId("grades").setPlaceholder("Alege o nota");
	client.gRow = new ActionRowBuilder().setComponents([client.gMenu]);

	for (let i = 1; i < 11; i++) client.gMenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(`${i}`).setValue(`${i}`));
};

client.updateMenu = (content, row, value) => {
	if (!client.lastAction?.message?.interaction) return false;

	return client.lastAction.message.interaction
		.editReply({ content: content, components: [row] })
		.then(() => (client.lastAction.value = value))
		.catch((err) => client.err(err));
};

client.updateMessage = async (gradesData) => {
	if (!client.gradesMessage) return client.warn("No message, use the command /sendembed");

	await client.gradesEmbed(gradesData);

	return client.gradesMessage.edit({ embeds: [client.gEmbed], components: [client.gradesComponents()] }).then((msg) => {
		gradesData
			.updateOne({ $set: gradesData })
			.then(() => {
				client.success("Message updated");
				client.gradesMessage = msg;
			})
			.catch((err) => client.err(err));
	});
};

module.exports = client;

require("./handlers/events")();

process.on("uncaughtException", (err) => client.log("red", " U. Err. ", err.stack));
