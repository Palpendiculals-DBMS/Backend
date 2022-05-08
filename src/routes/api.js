const router = require("express").Router();
const uniqid = require("uniqid");
const connection = require("../db");
const passport = require("passport");

router.post("/form", async (req, res) => {
	console.log(req.headers.origin);
	res.redirect(307, "/formsubmit/add");
});

module.exports = router;
