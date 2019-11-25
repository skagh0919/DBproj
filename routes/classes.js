const express = require('express');
let models = require('../models');
let router = express.Router();

router.get("/", (req, res) => {
    
    models.Classes.findAll().then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

module.exports = router;