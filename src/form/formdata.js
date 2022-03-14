const router = require("express").Router();
const uniqid = require("uniqid");
const { Validate } = require("../functions/middleware");
const connection = require("../db");

router.get("/", async (req, res) => {
	const query = "SELECT * FROM formdata";
	connection.query(query, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

router.post("/update", Validate, async (req, res) => {
	const { id, title, description, form } = req.body;
	const query = `UPDATE formdata SET title = '${title}', description = '${description}',form = '${JSON.stringify(
		form
	)}' WHERE id = '${id}' AND userid='${req.authData.id}'`;
	connection.query(query, (err, results) => {
		console.log(results);
		if (err) {
			res.status(500).send({
				message: err,
			});
		} else {
			res.status(200).send({
				message: "Form Updated",
				data: results.rows,
				status: 1,
			});
		}
	});
});

router.delete("/delete/:id", Validate, (req, res) => {
	const { id } = req.params;
	const query = `DELETE FROM formdata WHERE id = '${id}' AND userid='${req.authData.id}'`;
	connection.query(query, (err, results) => {
		if (err) {
			console.log(err);
			res.status(500).send({
				message: err,
			});
		} else {
			res.status(200).send({
				message: "Form Deleted",
				data: results.rows,
				status: 1,
			});
		}
	});
});

router.post("/add", Validate, async (req, res) => {
	const query =
		"INSERT INTO formdata (id, form, title, description, userid, createdon) VALUES ($1,$2,$3,$4,$5,$6)";

	let id = uniqid();

	const { form, title, description } = req.body;
	const userid = req.authData.id;

	if (!id || !form || !userid || !title || !description) {
		res.status(400).send({
			error: "Missing Parameters",
		});
	}
	const createdon = Math.floor(new Date().getTime() / 1000);

	const values = [
		id,
		JSON.stringify(form),
		title,
		description,
		userid,
		createdon,
	];

	connection.query(query, values, (err, results) => {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			console.log(results);
			res.status(200).send({
				status: 1,
				message: "Form added successfully",
				id: id,
			});
		}
	});
});

router.get("/recent", Validate, async (req, res) => {
	const userid = req.authData.id;

	if (!userid) {
		res.status(400).send({
			error: "Missing Parameters",
		});
	}

	const query = `SELECT id,title,description FROM formdata WHERE userid='${userid}' order by createdon`;

	connection.query(query, (err, results) => {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else
			res.status(200).send({
				data: results.rows,
				status: 1,
			});
	});
});

router.get("/recent/:count", Validate, async (req, res) => {
	const userid = req.authData.id;
	const count = req.params.count;
	if (!userid || !count) {
		res.status(400).send({
			error: "Missing Parameters",
		});
	}
	const query = `select id,title,description,userid from formdata where userid = '${userid}' limit ${count}`;

	connection.query(query, (err, results) => {
		if (err) {
			// console.log(err);
			res.status(500).send(err);
		} else {
			res.status(200).send({
				data: results.rows,
				status: 1,
			});
		}
	});
});

router.get("/getbyid/:id", Validate, async (req, res) => {
	const id = req.params.id;
	console.log(id);
	if (!id) {
		res.status(400).send({
			error: "Missing Parameters",
		});
	}
	const query = `SELECT * FROM formdata WHERE id='${id}' AND userid='${req.authData.id}'`;
	console.log(query);
	connection.query(query, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send({
				data: results.rows,
				status: 1,
			});
		}
	});
});

module.exports = router;
