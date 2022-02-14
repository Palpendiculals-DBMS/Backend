const router = require('express').Router();
const uniqid = require('uniqid');
const connection = require('../db');

router.get('/', async (req,res) => {
    const query = "SELECT * FROM formdata";
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

router.post('/add', async (req,res) => {
    const query = "INSERT INTO formdata (id, form, userid) VALUES (?)";
    
    let id = uniqid();

    const {form, userid} = req.body;

    if(!id || !form || !userid)
    {
        res.status(400).send({
            error: "Missing Parameters"
        });
    }

    const values = [[id, JSON.stringify(form), userid]];

    connection.query(query , values ,(err, results) => {
        if(err)
            res.status(500).send(err);
        else
            res.status(200).send(results);
    });
});



module.exports = router;