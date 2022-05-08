const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();

var morgan = require("morgan");
const db = require("./db/index");
const cors = require("cors");
require("./auth/auth");
app.use(cors());
app.use(morgan("tiny"));
app.use(function (req, res, next) {
	setTimeout(next, 1000);
});
const authRouter = require("./routes/auth");
const formdataRouter = require("./routes/data");
const formsubmitRouter = require("./routes/submit");
const FormAnalytics = require("./routes/analytics");
const FormAPI = require("./routes/api");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
	db.query("SELECT * FROM formdata", (err, result) => {
		if (err) {
			console.log(err.stack);
		} else {
			res.json(result.rows);
		}
	});
});

app.use("/auth", authRouter);
app.use("/formdata", formdataRouter);
app.use("/formsubmit", formsubmitRouter);
app.use("/analytics", FormAnalytics);
app.use("/api", FormAPI);

app.listen(PORT, (req, res) => {
	console.log(`Listening index.js on Port ${PORT}`);
});
