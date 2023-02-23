const client = require("../../client");
const gradesModel = require("../../models/grades");

async function subject(interaction) {
	const grade = Number(interaction.values[0]);
	const gradesData = await gradesModel.findOne().catch((err) => client.err(err));

	const subject = client.lastAction.value.split("_")[0];
	const action = client.lastAction.value.split("_")[1];

	client.subjectsMenu();

	if (!client.lastAction) return;

	interaction.deferUpdate();

	if (action == "add") {
		gradesData[subject].push(grade);
		gradesData.allGrades.push(grade);
	} else {
		if (!gradesData[subject].includes(grade)) return client.updateMenu(`Nu ai nicio nota de ${grade} la ${subject}.`, client.gRow, subject);

		gradesData[subject].splice(gradesData[subject].indexOf(grade), 1);
		gradesData.allGrades.splice(gradesData.allGrades.indexOf(grade), 1);
	}

	client.updateMessage(gradesData);

	client.updateMenu(null, client.gRow, action);
}
module.exports = subject;
