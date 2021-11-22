import React, {useEffect, useState} from 'react';
import './TestWriter.css'
import {useHistory} from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";

const TestWriter = props => {
    const history = useHistory();

    let token = Cookie.get('jwt');
    let decode = jwt.decode(token);

    let [quizList,setQuizList] = useState([
        {_id:'',title:'',mail:'',timeLimit:''},
    ]);

    useEffect(()=>{

        axios.post("http://localhost:4000/test/writer/fetchTestDetails")
            .then((response)=>{
                setQuizList([...response.data]);
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])

    const StartQuizHandler = (title,mail,timeLimit) => {
        setTimeout(() => {
            history.push('/TakeTest',{quizTitle:title,mail:mail,timeLimit:timeLimit})
        }, 500)
    }

    const ViewResultsHandler = (title,creatorMail) => {
        setTimeout(() => {
            history.push('/ViewResultsStudent',{quizTitle:title,creatorMail:creatorMail,writerMail:decode.mail})
        }, 500)
    }

    return (
        <div className={"test-writer-container"}>
            <br />
            <hr />
            { quizList.map((quizList,index) => (
                <div key={index} className={"quiz-item"}>

                    <div>
                        {quizList.title} <br />
                        Author&nbsp;:&nbsp;{quizList.mail} <br />
                        Time Limit&nbsp;:&nbsp;{quizList.timeLimit}&nbsp;mins
                    </div>

                    <br />
                    <div>
                        <Button
                            className={"button-style"}
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={() => {StartQuizHandler(quizList.title,quizList.mail,quizList.timeLimit)}}
                        >Start</Button><br />&nbsp;<br />
                        <Button
                            className={"button-style"}
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={() => {ViewResultsHandler(quizList.title,quizList.mail)}}
                        >View Results</Button>
                    </div>
                </div>
            ))}
            <br /><br />
        </div>
    );
};

export default TestWriter;
