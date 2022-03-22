const router = require("express").Router();
const connection = require(`../db/index`);
const uniqid = require("uniqid");
const utils = require("../functions/utils");
const cors = require("cors");
const { AvatarGenerator } = require("random-avatar-generator");
const passport = require("passport");

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
router.post(
	"/register",
	passport.authenticate("signup", { session: false }),
	async (req, res) => {
		const user = req.user;

		res.status(200).json(user);
	}
);

// router.post("/login", async (req, res) => {
// 	const email = req.body.email;
// 	const password = req.body.password;

// 	console.log(email, password);

// 	if (email == "" || password == "")
// 		res.status(400).send({
// 			error: "Missing Parameters",
// 		});

// 	const query = "SELECT * FROM formuser WHERE email = $1";

// 	const values = [email];

// 	connection.query(query, values, async (err, results) => {
// 		if (err) {
// 			res.status(500).json(err);
// 		} else {
// 			if (results.rows.length === 0)
// 				res.status(400).json({
// 					error: "User not found",
// 				});
// 			else {
// 				const user = results.rows[0];

// 				const isPasswordValid = await utils.comparePassword(
// 					password,
// 					user.password
// 				);

// 				if (!isPasswordValid)
// 					res.status(400).json({
// 						error: "Invalid Password",
// 					});
// 				else {
// 					const token = await utils.generateToken(user.id);

// 					res.status(200).json({
// 						user: user,
// 						token: token,
// 					});
// 				}
// 			}
// 		}
// 	});
// });

router.post(
	"/login",
	passport.authenticate("login", { session: false }),
	async (req, res) => {
		const user = req.user;
		res.status(200).json(user);
	}
);

router.post(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const user = req.user;
		res.status(200).json(user);
	}
);

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
