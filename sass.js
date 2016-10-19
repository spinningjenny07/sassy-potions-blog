/* jshint esversion:6 */
var express = require("express");

var app = express();

var mongoose = require("mongoose");

const PORT = process.env.port || 8000;

mongoose.connect("mongodb://localhost");

var SassyCommentConstructor = require("./SassyComment.js");
var SassyComment = SassyCommentConstructor(mongoose);

var SassyPotionConstructor = require("./SassyPotion.js");
var SassyPotion = SassyPotionConstructor(mongoose, SassyComment);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// GET /
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

// GET /api/potions
app.get("/api/potions", (req, res) => {
	SassyPotion.find({}).sort('-sass').exec((err, sassyPotions) =>{
		if (err) {
			res.status(500);
			res.send({status: "error", message: "sass overload"});
			return;
		}
		res.send(sassyPotions);
	});
});

// POST /api/potions
app.post("/api/potion", (req, res) => {
	//todo validate input
	var newPotion = new SassyPotion({
		sass: req.body.sass,
		ingredients: req.body.ingredients.split(","),
		crystals: Math.random() > 0.5,
		name: req.body.name,
		gpa: 100 - req.body.sass
	});

	newPotion.save((err) => {
		if (err) {
			res.status(500);
			res.send({status: "error", message: "sass overload"});
			return;
		}
		res.send(newPotion);
	});

});

app.post('/api/potion/edit', (req, res) => {
	SassyPotion.findOneAndUpdate(
		{_id : req.body._id },
		{
			name: req.body.name,
			sass: req.body.sass,
			ingredients: req.body.ingredients.split(","),
			crystals: !!req.body.crystals,
			gpa: 100 - req.body.sass,
		},
		{
			new: true
		},
		(err, data) => {
			if (err) {
				res.status(500);
				res.send({status: "error", message: "sass overload"});
				return;
			}
			res.send(data);
		}
	);
});

app.use((req, res, next) => {
	res.status(404);
	res.send("File not found. Perhaps you weren't sassy enough.");
});

app.use((err, req, res, next) => {
	res.status(500);
	res.send("500 Error: Too much sass");
});

app.listen(PORT, () => {
	console.log("Sassy Server on Sassy Port: " + PORT);
});
