const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res, next) => {
    const flash = req.session.flash;
    console.log(flash);
    req.session.flash = null;
    await pool
        .promise()
        .query('SELECT * FROM meeps ORDER BY updated_at DESC')
        .then(([rows, fields]) => {
            res.render('meeps.njk', {
                flash: flash,
                meeps: rows,
                title: 'Meeps',
                layout: 'layout.njk',
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: 'Error getting SELECT ORDER meeps',
                },
            });
        });
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        res.status(400).json({
            meep: {
                error: 'Bad request',
            },
        });
    }
    await pool
        .promise()
        .query('SELECT * FROM meeps WHERE id = ?', [id])
        .then(([rows, fields]) => {
            res.json({
                meep: {
                    data: rows,
                },
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                meep: {
                    error: 'Error getting SELECT WHERE meeps',
                },
            });
        });
});
// copy GET :id route, edit SQL och response
router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        return res.status(400).json({
            meep: {
                error: 'Bad request',
            },
        });
    }
    await pool
        .promise()
        .query('DELETE FROM meeps WHERE id = ?', [id])
        .then((response) => {
            if (response[0].affectedRows === 1) {
                req.session.flash = 'Meep deleted';
                res.redirect('/meeps');
            } else {
                req.session.flash = 'Meep not found';
                res.status(400).redirect('/meeps');
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                meep: {
                    error: 'Error getting DELETE meeps',
                },
            });
        });
});

router.post('/', async (req, res, next) => {
    const meep = req.body.meep;

    if (meep.length < 3) {
        res.status(400).json({
            meep: {
                error: 'A meep must have at least 3 characters',
            },
        });
    }

    await pool
        .promise()
        .query('INSERT INTO meeps (meep) VALUES (?)', [meep])
        .then((response) => {
            if (response[0].affectedRows === 1) {
                req.session.flash = "Successfully added meep";
                res.redirect('/meeps');
            } else {
                res.status(400).json({
                    meep: {
                        error: 'Invalid meep',
                    },
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                meep: {
                    error: 'Error getting INSERT INTO meeps',
                },
            });
        });

    // res.json(req.body);
});

router.post('/:id/complete', async (req, res, next) => {
    const id = req.params.id;

    await pool
    .promise()
    .query('UPDATE meeps SET completed = !completed WHERE id = ?', [id])
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
})

module.exports = router;