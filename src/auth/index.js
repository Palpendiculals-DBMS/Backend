const router = require("express").Router();
const connection = require(`../db/index`);
const uniqid = require("uniqid");
const utils = require("../functions/utils");
const cors = require("cors");
const { AvatarGenerator } = require("random-avatar-generator");
const cloudinary = require("../functions/cloudinary");

router.use(cors());

// GET ALL USERS
router.get("/", (req, res) => {
	const query = "SELECT * FROM User";

	connection.query(query, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// POST REGISTER
router.post("/register", async (req, res) => {
	console.log(req.body);
	let { name, password, email } = req.body;

	if (!name || !password || !email)
		res.status(400).json({
			error: "Missing Parameters",
		});

	let id = uniqid();
	const avatar = new AvatarGenerator();

	const image = avatar.generateRandomAvatar();

	const query =
		"INSERT INTO formuser (id, name, email, password, avatar) VALUES ($1, $2, $3, $4, $5)";

	password = await utils.hashPassword(password);

	console.log(password);

	const values = [id, name, email, password, image];

	connection.query(query, values, async (err, results) => {
		if (err) {
			res.status(500).json(err);
		} else {
			const token = await utils.generateToken(id);
			res.status(200).json({
				user: {
					id,
					name,
					email,
				},
				token: token,
			});
		}
	});
});

router.post("/login", async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	console.log(email, password);

	if (email == "" || password == "")
		res.status(400).send({
			error: "Missing Parameters",
		});

	const query = "SELECT * FROM formuser WHERE email = $1";

	const values = [email];

	connection.query(query, values, async (err, results) => {
		if (err) {
			res.status(500).json(err);
		} else {
			if (results.rows.length === 0)
				res.status(400).json({
					error: "User not found",
				});
			else {
				const user = results.rows[0];

				const isPasswordValid = await utils.comparePassword(
					password,
					user.password
				);

				if (!isPasswordValid)
					res.status(400).json({
						error: "Invalid Password",
					});
				else {
					const token = await utils.generateToken(user.id);

					res.status(200).json({
						user: user,
						token: token,
					});
				}
			}
		}
	});
});

router.post("/profile", async (req, res) => {});

router.post("/avatar", async (req, res) => {
	const avatar = new AvatarGenerator();

	const image = avatar.generateRandomAvatar();
	console.log(image);
	// console.log(url);

	res.status(200).json({
		image: image,
	});
});

module.exports = router;
