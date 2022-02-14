const router = require('express').Router();
const connection = require(`../db/index`);
const uniqid = require('uniqid');
const utils = require('../functions/utils');
// GET ALL USERS
router.get('/', (req, res) => {

    const query = "SELECT * FROM User";

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

router.post('/register', async (req, res) => {
    let {name, password, email} = req.body;

    if(!name || !password || !email)
        res.status(400).send({
            error: 'Missing Parameters'
        });

    let id = uniqid();

    const query = "INSERT INTO User (id, name, email, password) VALUES (?)";

    password = await utils.hashPassword(password);

    console.log(password);

    const values = [[id, name, email, password]];

    connection.query(query , values ,(err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
    
});

router.post('/login', async (req, res) => {
    let {email, password} = req.body;

    if(!email || !password)
        res.status(400).send({
            error: 'Missing Parameters'
        });

    const query = "SELECT * FROM User WHERE email = ?";

    const values = [email];

    connection.query(query , values ,async (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if(results.length === 0)
                res.status(400).send({
                    error: 'User not found'
                });
            else {
                const user = results[0];
                console.log(user);
                const isPasswordValid = await utils.comparePassword(password, user.password);

                if(!isPasswordValid)
                    res.status(400).send({
                        error: 'Invalid Password'
                    });
                else {
                    const token = await utils.generateToken(user.id);

                    res.status(200).send({
                        user: user,
                        token: token
                    });
                }
            }
        }
    });

});

module.exports = router;