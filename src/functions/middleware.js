const jwt = require("jsonwebtoken");
const connection = require("../db");

async function Validate(req, res, next) {
	try {
		// console.log(req.headers);
		if (req.headers.authorization === undefined) {
			return res.status(403).send({
				message: "Unauthorized",
				status: -1,
			});
		}
		const bearer = req.headers.authorization.split(" ")[1];
		jwt.verify(bearer, process.env.TOKEN_SECRET, (err, authData) => {
			if (err) {
				console.log(err);
				res.status(403).send({
					error: err,
					message: "Forbidden",
					status: -1,
				});
			} else {
				req.authData = authData;
				next();
			}
		});
	} catch (err) {
		res.status(403).send({
			message: err.message || "Some error occurred while validating the token.",
			status: -1,
		});
	}
}

async function ValidateToken(req, res, next) {
	try {
		// console.log(req.headers);
		if (req.headers.authorization === undefined) {
			return res.status(403).send({
				message: "Unauthorized",
				status: -1,
			});
		}
		const bearer = req.headers.authorization.split(" ")[1];

		const query = "SELECT * FROM formuser where token = $1";
		const values = [bearer];

		const result = await connection.query(query, values);

		if (result.rowCount === 0) {
			return res.status(403).send({
				message: "Unauthorized",
				status: -1,
			});
		} else {
			req.user = result.rows[0];
			next();
		}
	} catch (err) {
		res.status(403).send({
			message: err.message || "Some error occurred while validating the token.",
			status: -1,
		});
	}
}

module.exports = {
	Validate,
	ValidateToken,
};
