const express = require('express');
const router = express.Router();
const TestModel = require('./TestModel');

router.post('/create', async(req,res) => {

    //console.log("Create Request :",req.body);

    const testExists = await TestModel.findOne({ mail: req.body.mail,title: req.body.title});
    if(testExists)
        return res.json({message:"Test title already exists... try with new title"});

    const test = new TestModel({
        mail:req.body.mail,
        title:req.body.title,
        questions:req.body.questions
    });

    test.save((error,response) => {
        if(error){
            return res.json({message: error});
        }
        console.log(response);
        return res.json({message: "Test Saved Successfully"});
    })
})

router.post('/update', async(req,res) => {
    //console.log("Update Request :",req.body)
    TestModel.findOneAndUpdate({mail:req.body.mail,title:req.body.title},{questions:req.body.questions})
        .then(() =>{ return res.json({message: "Test Updated Successfully"});})
        .catch((error) => { return res.json({message: error});})
})

router.post('/fetchTestTitles', async(req,res) => {
    const mail = req.body.mail;
    TestModel.find({"mail":mail},{"title":1}).then(response => {
        //console.log("fetchTestTitles response :",response);
        return res.json(response);
    })
})

router.post('/fetchTestData', async(req,res) => {
    const mail = req.body.mail;
    const title = req.body.title;
    //console.log(mail,title);
    TestModel.findOne({"mail":mail,"title":title})
        .then(response => {
        //console.log("fetchTestData response :",response)
        return res.json(response);
        })
        .catch((error) => { console.log("Error in fetchTestData :",error)})
})

router.post('/delete', async(req,res) => {
    console.log("Delete Request :",req.body);

    TestModel.deleteOne({"mail":req.body.mail,"title":req.body.title})
        .then(() => {
            return res.json({message: "Quiz Deleted Successfully"});
        })
        .catch((error) =>{ return res.json({message: error});})
})

module.exports = router;
