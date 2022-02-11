const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

async function Validate(req, res, next) {
    try {
        console.log(req.headers);
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


module.exports = {
    hashPassword,
    comparePassword,
    Validate,
};