import React, {useEffect, useState} from 'react';
import './ViewResults.css'
import {useHistory} from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";

const ViewResults = props => {
    const history = useHistory();

    let [quizList,setQuizList] = useState([
        {_id:'',title:'',time:'',timeLimit:'',creatorMail:''},
    ]);

    useEffect(() => {
        axios.post("http://localhost:4000/test/writer/fetchTestAttemptDetails",
            {
                creatorMail:props.location.state.creatorMail,
                writerMail:props.location.state.writerMail,
                title:props.location.state.quizTitle
            })
            .then((response)=>{
                // console.log(response.data);
                setQuizList([...response.data]);
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])

    const ViewResultsHandler = (id) => {
        setTimeout(() => {
            history.push('/ViewIndividualTestResults',{_id:id})
        }, 500)
    }

    return (
        <div className={"view-results-container"}>
            <div className={"title-style"}><h1>Test Attempts</h1></div>
            <hr />
            { quizList.map((quizList,index) => (
                <div key={index} className={"quiz-item"}>

                    {quizList.title} <br />
                    Author&nbsp;:&nbsp;{quizList.creatorMail} <br />
                    Date&nbsp;:&nbsp;
                    {new Date(quizList.timestamp).getDate()}-
                    {new Date(quizList.timestamp).getMonth()}-
                    {new Date(quizList.timestamp).getFullYear()} <br />
                    Time&nbsp;:&nbsp;
                    {new Date(quizList.timestamp).getHours()}:
                    {new Date(quizList.timestamp).getMinutes()}:
                    {new Date(quizList.timestamp).getSeconds()}
                    <br />
                    Time Limit&nbsp;:&nbsp;{quizList.timeLimit}&nbsp;minutes

                    <Button
                        className={"button-style"}
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => {ViewResultsHandler(quizList._id)}}
                    >View Results</Button>
                </div>
            ))}
            <br />
        </div>
    );
};

export default ViewResults;
