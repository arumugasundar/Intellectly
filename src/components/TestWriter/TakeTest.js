import React, { useState, useRef, useEffect } from 'react';
import './TakeTest.css'
import axios from "axios";
import {useHistory} from "react-router-dom";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";

import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

const TakeTest = props => {

    let token = Cookie.get('jwt');
    let decode = jwt.decode(token);

    const Ref = useRef(null);
    const [timer, setTimer] = useState('00:00:00');


    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 * 60 * 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }


    const startTimer = (e) => {
        let { total, hours, minutes, seconds }
            = getTimeRemaining(e);
        if (total > 0) {
            setTimer(
                (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        } else if(total == 0){
            document.getElementById("test-submit").click();
        }
    }


    const clearTimer = (e) => {

        setTimer('00:00:00');

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }

    const getDeadTime = (minutes) => {
        let deadline = new Date();

        deadline.setSeconds(deadline.getSeconds() + parseInt((minutes*60).toString()));
        return deadline;
    }

    const getDeadTimeFreeze = () => {
        let deadline = new Date();

        deadline.setSeconds(deadline.getSeconds() + 0);
        return deadline;
    }


    const [serverResponse, setServerResponse] = useState("");
    const [open, setOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);


    const [title,setTitle] = useState('');
    const [questions,setQuestions] = useState([
        {
            question_text:'',
            option1: '',option2: '',option3: '',option4: '',
            crt_answer:'',
            mark:''
        },
    ]);
    const [answerResponse,setAnswerResponse] = useState([
        {
            question_text:'',
            marked_answer:'',
            correct_answer:''
        }
    ]);
    const [tabSwitch,setTabSwitch] = useState(0);

    const history = useHistory()

    const handleToClose = () => {
        setOpen(false);
    };

    const countTabSwitch = () => {
        console.log(document.hidden);
        //if(document.hidden) document.getElementById("test-submit").click();
        if(document.hidden) setTabSwitch(count => { return count+1});
    }

    useEffect( () => {

        window.onbeforeunload = function() {
            return "Are you sure?";
        }
        window.addEventListener("visibilitychange", countTabSwitch,true);
        if(props.location.state && props.location.state.quizTitle && props.location.state.mail && props.location.state.timeLimit){
            clearTimer(getDeadTime(props.location.state.timeLimit));
            setTitle(props.location.state.quizTitle);

            axios.post("http://localhost:4000/test/writer/fetchTestData",{mail:props.location.state.mail,title:props.location.state.quizTitle})
                .then((response) => {
                    console.log(response.data.questions,response.data.questions.length);
                    if(response.data.questions){
                        setQuestions(response.data.questions)
                        setAnswerResponse(Array(response.data.questions.length).fill({question_text:'', marked_answer:''}))
                        console.log("Answer Response :",answerResponse);
                    }
                })
                .catch(error => { console.log(error)})
        }

        return function cleanup() { window.removeEventListener("visibilitychange", countTabSwitch,true); }

    },[])


    const SubmitHandler = async e => {
        if(e) e.preventDefault();
        console.log(timer);

        let time_start = new Date();
        let time_end = new Date();
        let value_end = timer.split(':');

        let time = 0;
        if(props.location.state) time = props.location.state.timeLimit;
        time_start.setHours(Math.floor(time/60),time%60 , 0, 0)
        time_end.setHours(parseInt(value_end[0]), parseInt(value_end[1]), parseInt(value_end[2]), 0)

        console.log(time_start - time_end); // millisecond

        clearTimer(getDeadTimeFreeze());
        //console.log(hr,min,sec);
        const response = await axios.post("http://localhost:4000/test/writer/calculateScore",{
             creatorMail:props.location.state.mail,
             writerMail:decode.mail,
             timeLimit: props.location.state.timeLimit,
             timeTaken:(time_start - time_end + 1000),
             title:title,
             answers:answerResponse,
             tabSwitch:tabSwitch
        });

        //console.log("marks :",response.data)
        setServerResponse(response.data);
        setRedirect(true);
        setOpen(true);
    }

    if(redirect){
        // window.location.reload(false);
        //document.removeEventListener("visibilitychange", countTabSwitch,true);
        setTimeout(() => {
            //history.push('/TestWriter')
            history.push('/ViewResultsStudent',{quizTitle:title,creatorMail:props.location.state.mail,writerMail:decode.mail})
        }, 3000)
    }

    return (
        <div className={"take-test-container"}>
            <br />
            <div>
                <h2 className={"title-style"}>{title}</h2>
                <div className={"time-style"}>{timer}</div>
            </div>
            <form id={"tform"} name={"tform"} className={"form-group"} onSubmit={SubmitHandler}>
                {questions.map((questions,index) => (
                    <div key={index}>
                        <br /><hr />
                        {index+1}&nbsp;:&nbsp;{questions.question_text}
                        <br /><br />

                        <input type="radio" id={index +"option1"} name={index} value={questions.option1}
                               onClickCapture={() => {const e = (answerResponse[index])?answerResponse[index] = {question_text:questions.question_text, marked_answer:questions.option1}:null}}
                        />
                        <label htmlFor={index +"option1"}>{questions.option1}</label><br/>

                        <input type="radio" id={index +"option2"} name={index} value={questions.option2}
                               onClickCapture={() => {const e = (answerResponse[index])?answerResponse[index] = {question_text:questions.question_text, marked_answer:questions.option2}:null}}
                        />
                        <label htmlFor={index +"option2"}>{questions.option2}</label><br/>

                        <input type="radio" id={index +"option3"} name={index} value={questions.option3}
                               onClickCapture={() => {const e = (answerResponse[index])?answerResponse[index] = {question_text:questions.question_text, marked_answer:questions.option3}:null}}
                        />
                        <label htmlFor={index +"option3"}>{questions.option3}</label><br/>

                        <input type="radio" id={index +"option4"} name={index} value={questions.option4}
                               onClickCapture={() => {const e = (answerResponse[index])?answerResponse[index] = {question_text:questions.question_text, marked_answer:questions.option4}:null}}
                        />
                        <label htmlFor={index +"option4"}>{questions.option4}</label><br/>
                        <hr /><br/>
                    </div>
                ))}
                <Button
                    variant="contained"
                    name={"test-submit"}
                    id={"test-submit"}
                    color="primary"
                    type="submit"
                    endIcon={<Icon>send</Icon>}
                    onClick={SubmitHandler}>
                    Submit Quiz
                </Button>
                <br/><br/>
            </form>
            <br />
            <Snackbar
                anchorOrigin={{
                    horizontal: "left",
                    vertical: "top",
                }}
                open={open}
                autoHideDuration={2000}
                message={serverResponse}
                onClose={handleToClose}
            />
        </div>
    );
};

export default TakeTest;
