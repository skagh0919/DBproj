const express = require('express');
let models = require('../models');
let router = express.Router();

router.post("/", (req, res) => {
    let data = req.body;

    if(!data.email || !data.pw) {
        console.log(data);
        res.json({"result": "short"});
        return;
    }

    models.Users.findOne({
        where: {
            email: data.email,
            password: data.pw
        }
    }).then(result => {
        if(res) {
            res.json(result);
        } else {
            res.json({"result": "incorrect"});
        }
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

module.exports = router;