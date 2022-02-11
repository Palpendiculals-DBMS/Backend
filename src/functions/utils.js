const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

async function generateToken(id) {
    try {
        const token = await jwt.sign({id: id}, process.env.TOKEN_SECRET);
        return token;
    } catch (error) {
        throw error;
    }

}


module.exports = {
    hashPassword,
    comparePassword,
    generateToken
};