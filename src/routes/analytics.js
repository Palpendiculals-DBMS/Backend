const router = require("express").Router();
const connection = require("../db");
const { Validate } = require("../functions/middleware");
const passport = require("passport");
router.get(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const user = req.user;
		console.log(user);

		const q_id = req.params.id;

		const q_1 = `SELECT formsubmit.form as submissions, f2.form as form from formsubmit RIGHT JOIN formdata f2 on formsubmit.formid = f2.id where formid='${q_id}'`;

		const q_2 = `SELECT form, title, description from formdata where formdata.id = '${q_id}';`;

		try {
			let submissions = await connection.query(q_1);
			submissions = submissions.rows.map((submission) => {
				return {
					...submission.submissions,
					email: submission.email,
					name: submission.name,
				};
			});
			const form = await connection.query(q_2);
			res.status(200).json({
				message: "Success",
				submissions: submissions,
				form: { ...form.rows[0] },
			});
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	}
);

module.exports = router;
