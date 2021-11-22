import React, {useEffect, useRef, useState} from 'react';
import './ViewIndividualTestResults.css'
import {useHistory} from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";

const ViewResults = props => {
    const history = useHistory();

    const [answerResponse,setAnswerResponse] = useState([{
        question_text:'',
        marked_answer:'',
        correct_answer:''
    }])
    const [creatorMail,setCreatorMail] = useState('');
    const [tabSwitch,setTabSwitch] = useState('');
    const [timeLimit,setTimeLimit] = useState('');
    const [timeTaken,setTimeTaken] = useState('');
    const [timestamp,setTimestamp] = useState('');
    const [title,setTitle] = useState('');
    const [writerMail,setWriterMail] = useState('');
    const [marks,setMarks] = useState('');
    const [totalMarks,setTotalMarks] = useState('');

    useEffect(() => {
        axios.post("http://localhost:4000/test/writer/fetchIndividualTestAttempt",
            {_id:props.location.state._id})
            .then((response)=>{
                console.log(response.data);
                setAnswerResponse([...response.data.answerResponse]);
                setCreatorMail(response.data.creatorMail);
                setTabSwitch(response.data.tabSwitch);
                setTimeLimit(response.data.timeLimit);
                setTimeTaken(response.data.timeTaken);
                setTimestamp(response.data.timestamp);
                setTitle(response.data.title);
                setWriterMail(response.data.writerMail);
                setMarks(response.data.marks);
                setTotalMarks(response.data.totalMarks);
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])

    // const PrintHandler = useReactToPrint({
    //
    // });
    const PrintHandler = () => {
        window.print();
    }

    return (
        <div className={"view-results-container"}>
            <div className={"title-style"}>
                <h1>Test Performance Report</h1>
            </div>
            <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={() => {PrintHandler()}}
            >Download Results</Button>
            <br /><br /><hr />
            Test Title&nbsp;:&nbsp;{title}<br />
            Author&nbsp;:&nbsp;{creatorMail}<br />
            Writer&nbsp;:&nbsp;{writerMail}<br />
            Date&nbsp;:&nbsp;
            {new Date(timestamp).getDate()}-
            {new Date(timestamp).getMonth()}-
            {new Date(timestamp).getFullYear()} <br />
            Time&nbsp;:&nbsp;
            {new Date(timestamp).getHours()}:
            {new Date(timestamp).getMinutes()}:
            {new Date(timestamp).getSeconds()} <br />
            {/*Test Title&nbsp;:&nbsp;{answerResponse[0].question_text}<br />*/}
            Test Duration&nbsp;:&nbsp;{timeLimit} minutes<br />
            Completed In&nbsp;:&nbsp;{Math.floor((timeTaken/1000)/60)} minutes {(timeTaken/1000)%60} seconds<br />
            Number of Tab Switches&nbsp;:&nbsp;{tabSwitch}<br />
            Marks Scored&nbsp;:&nbsp;{marks} out of {totalMarks}
            <br />

            { answerResponse.map((question,index) => (
                <div key={index} className={"quiz-item"}>
                    <div>{question.question_text}</div>
                    {(question.correct_answer===question.marked_answer)?
                        <div className={"correct-answer"}>&#10004;{question.marked_answer}</div>:
                        <div>
                            <div className={"wrong-answer"}>&#215;{question.marked_answer}</div>
                            Correct Answer is <div className={"correct-answer"}>&#10004;{question.correct_answer}.</div>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
};

export default ViewResults;
