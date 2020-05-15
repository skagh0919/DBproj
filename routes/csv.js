const express = require('express');
const fs = require('fs');
let models = require('../models');
let router = express.Router();

router.post("/", (req,res) => {
    let data = req.body;
    let resArray = [];
    fs.readFile(data.filePath, 'utf8', function(err, data) {
        if(err){
            res.json({"result":"Invalid path"});
            return;
        }

        let rows = data.split('\r\n');
        
        for(i = 1; i < rows.length - 1; ++i){
            let row = rows[i].split(',');
            let resData = {};
            resData["question_id"] = row[0];
            resData["key_value"] = row[1];
            resData["params"] = {};
            resData["answer"] = row[7];
            for(j = 2; j < 7; ++j){
                if(row[j] != ''){
                    resData["params"]["pr"+ (j - 1)] = parseInt(row[j]);
                }
            }
            resArray.push(resData)
        }
        for(i = 0; i < resArray.length; ++i){
            let element = resArray[i];
            models.QuestionParams.create({
                question_id: element.question_id,
                keyValue: element.key_value,
                params: element.params,
                answer: element.answer
            }).then(result => {
                console.log(result);
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })
        }
    })
    
})


module.exports = router;