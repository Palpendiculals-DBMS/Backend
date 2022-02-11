const router = require('express').Router();
const connection = require(`../db/index`);
const uniqid = require('uniqid');

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

router.post('/register', (req, res) => {
    const {name, password, email} = req.body;

    if(!name || !password || !email)
        res.status(400).send({
            error: 'Missing Parameters'
        });

    let id = uniqid();

    const query = "INSERT INTO User (id, name, email, password) VALUES (?)";

    const values = [[id, name, email, password]];

    connection.query(query , values ,(err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });

});


module.exports = router;