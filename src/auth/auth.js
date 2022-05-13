const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const utils = require("../functions/utils");
const connection = require("../db/index");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const uniqid = require("uniqid");
const { AvatarGenerator } = require("random-avatar-generator");
const avatar = new AvatarGenerator();
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

passport.use(
	"signup",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const hashedPassword = await utils.hashPassword(password);
				const { name } = req.body;
				console.log(email, password, hashedPassword);
				const id = uniqid();
				const avatarUrl = avatar.generateRandomAvatar();
				const token = jwt.sign(
					{
						id,
						email,
						date: new Date(),
					},
					process.env.TOKEN_SECRET,
					{
						expiresIn: "365d",
					}
				);
				const new_token = uuid.v4().replace(/-/g, "");
				const query = `INSERT INTO formuser (id, name, email, password, avatar,token) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`;
				const values = [id, name, email, hashedPassword, avatarUrl, new_token];
				const res = await connection.query(query, values);

				return done(null, {
					user: res.rows[0],
					token,
				});
			} catch (error) {
				done(error);
			}
		}
	)
);

// ...

passport.use(
	"login",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const query = `SELECT * FROM formuser WHERE email = $1`;

				let user = await connection.query(query, [email]);
				user = user.rows[0];

				if (!user) {
					return done(null, false, { message: "User not found" });
				}

				const validate = await utils.comparePassword(password, user.password);

				if (!validate) {
					return done(null, false, { message: "Wrong Password" });
				}

				const token = jwt.sign(
					{
						id: user.id,
						email: user.email,
						date: new Date(),
					},
					process.env.TOKEN_SECRET,
					{
						expiresIn: "365d",
					}
				);

				return done(
					null,
					{
						user: user,
						token,
					},
					{ message: "Logged in Successfully" }
				);
			} catch (error) {
				return done(error);
			}
		}
	)
);

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

passport.use(
	new JWTstrategy(opts, async function (jwt_payload, done) {
		console.log(jwt_payload);
		const id = jwt_payload.id;
		try {
			const query = `SELECT * FROM formuser WHERE id = $1`;
			const res = await connection.query(query, [id]);
			const user = res.rows[0];
			if (!user) {
				return done(null, false);
			} else {
				return done(null, user);
			}
		} catch (error) {
			return done(error, false);
		}
	})
);
