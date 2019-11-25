const express = require('express');
let models = require('../models');
let router = express.Router();

router.post("/", (req, res) => {
    let data = req.body;
    let createMember = (em, pw, utype) => {
        models.Users.create({
            email: em,
            password: pw,
            type: utype
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }

    if(!data.em || !data.pw || !data.utype) {
        console.log(data);
        res.json({"result": "short"});
        return;
    }

    models.Member.findOne({     // 같은 아이디가 있는지 확인 
        where: {
            email: data.em
        }
    }).then(result => {
        if(!result) {  // 없다는 뜻
            createMember(data.em, data.pw, data.utype);
        } else {
            res.json({"result": "occupied"});
        }
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

module.exports = router;