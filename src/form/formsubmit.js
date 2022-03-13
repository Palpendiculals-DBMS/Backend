const router = require('express').Router();
const uniqid = require('uniqid');
const { Validate } = require('../functions/middleware');
const connection = require('../db');

// Display all Form Submissions
router.get('/', async (req, res) => {
    const query = "SELECT * FROM formsubmit";
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// Insert new form submit
router.post('/add', Validate, async (req, res) => {
    const query = "INSERT INTO formsubmit (id, form, formid, userid) VALUES ($1,$2,$3,$4)";

    let id = uniqid();
    const userid = req.authData.id;
    const { form, formid } = req.body;

    if (!id || !form || !userid || !formid) {
        res.status(400).send({
            error: "Missing Parameters"
        });
        return;
    }

    const values = [id, JSON.stringify(form), formid, userid];

    connection.query(query, values, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({
                status: 1,
                message: "Form added successfully"
            });
        }
    });
});

// Get Form By Id
router.get('/f/:id', async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM formdata WHERE id = '${id}'`;

    if (!id) {
        res.status(400).send({
            error: "Missing Parameters"
        });
    }

    console.log(query);

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            const rows = results.rows;
            if (rows.length === 0) {
                res.status(404).send({
                    error: "Form not found"
                });
            } else {
                res.status(200).send(rows[0]);
            }
        }
    });

});


module.exports = router;