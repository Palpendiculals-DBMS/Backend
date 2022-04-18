const router = require("express").Router();
const uniqid = require("uniqid");
const connection = require("../db");
const passport = require("passport");
const { ValidateToken } = require("../functions/middleware");

router.post("/form", ValidateToken, async (req, res) => {
	console.log(req.headers.origin);
	res.redirect(307, "/formsubmit/add");
});

module.exports = router;
