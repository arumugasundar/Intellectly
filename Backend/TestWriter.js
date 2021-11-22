const express = require('express');
const router = express.Router();
const TestModel = require('./TestModel');
const TestAttemptModel = require('./TestAttemptModel');

router.post('/fetchTestDetails', async (req, res) => {
    TestModel.find({},{"title":1,"mail":1,"timeLimit":1}).then(response => {
        //console.log("fetchTestTitles response :",response);
        return res.json(response);
    })
})

router.post('/fetchTestAttemptDetails', async (req, res) => {
    // console.log(req.body);
    TestAttemptModel.find(
        {
                creatorMail:req.body.creatorMail,
                writerMail:req.body.writerMail,
                title:req.body.title
            },
        {"title":1,"creatorMail":1,"timeLimit":1,"timestamp":1}).then(response => {
        // console.log("fetchTestAttemptDetails response :",response);
        return res.json(response);
    })
})

router.post('/fetchIndividualTestAttempt', async (req, res) => {
    // console.log(req.body);
    TestAttemptModel.findOne({_id:req.body._id}).then(response => {
        console.log("fetchIndividualTestAttempt response :",response);
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

router.post('/calculateScore', async (req,res) => {
    TestModel.findOne({"mail":req.body.creatorMail,"title":req.body.title})
        .then(response => {
            const actual_answers = response.questions;
            const marked_answers = req.body.answers;
            //console.log(actual_answers,marked_answers);
            let count = 0, total = 0;
            for(let i = 0; i < marked_answers.length; i++){
                let f  = 0;
                for(let j = 0; j < actual_answers.length; j++){
                    if(marked_answers[i].question_text === actual_answers[j].question_text && marked_answers[i].marked_answer === actual_answers[j].crt_answer){
                        count = count + parseInt(actual_answers[j].mark,10);
                        total = total +  parseInt(actual_answers[j].mark,10);
                        marked_answers[i].correct_answer = marked_answers[i].marked_answer;
                        f = 1;
                    }else if(marked_answers[i].question_text === actual_answers[j].question_text){
                        marked_answers[i].correct_answer = actual_answers[j].crt_answer;
                        total = total +  parseInt(actual_answers[j].mark,10);
                        f = 1;
                    }

                    if(f == 1) break;
                }
            }

            const testEntry = new TestAttemptModel({
                timestamp:new Date(),
                creatorMail:req.body.creatorMail,
                writerMail:req.body.writerMail,
                title:req.body.title,
                answerResponse:marked_answers,
                timeLimit:req.body.timeLimit,
                timeTaken:req.body.timeTaken,
                tabSwitch:req.body.tabSwitch,
                marks:count.toString(),
                totalMarks:total.toString()
            });
            testEntry
                .save()
                .then(() => {
                    return res.json("You have scored " + count.toString() + " marks!");
                })
                .catch(err => { console.log("Error in calculateScore and storing test entry :",err)})

            // const res_text = "You have scored " + count.toString() + " marks!";
            // return res.json(res_text);

        })
        .catch((error) => { console.log("Error in finding test details :",error)});
});

module.exports = router;
