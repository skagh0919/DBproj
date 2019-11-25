const express = require('express');
let models = require('../models');
let router = express.Router();

router.post("/", (req, res) => {
    let data = req.body;
    let createMember = (id, pw) => {
        models.Member.create({
            loginId: id,
            password: pw
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }

    if(!data.id || !data.pw || !data.is_teacher ||
        data.id.length < 4 || data.pw.length < 4) {
        console.log(data);
        res.json({"result": "short"});
        return;
    }

    models.Member.findOne({     // 같은 아이디가 있는지 확인 
        where: {
            loginId: data.id
        }
    }).then(result => {
        if(!result) {  // 없다는 뜻
            createMember(data.id, data.pw);
        } else {
            res.json({"result": "occupied"});
        }
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

module.exports = router;