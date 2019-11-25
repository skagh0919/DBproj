const express = require('express');
let models = require('../models');
let router = express.Router();

router.post("/", (req, res) => {
    let data = req.body;

    if(!data.id || !data.pw) {
        console.log(data);
        res.json({"result": "short"});
        return;
    }

    models.Member.findOne({
        where: {
            loginId: data.id,
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