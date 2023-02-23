const { Schema, model } = require("mongoose");

const grades = new Schema({
	message: String,
	matematica: Array,
	fizica: Array,
	biologie: Array,
	chimie: Array,
	informatica: Array,
	romana: Array,
	rusa: Array,
	engleza: Array,
	istorie: Array,
	geografie: Array,
	optional: Array,
	allGrades: Array,
});

module.exports = model("grades", grades);
