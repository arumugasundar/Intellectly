import React, {useEffect, useState} from 'react';
import './TestCreator.css'
import {Link} from "react-router-dom";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";

const TestCreator = props => {

    const [serverResponse, setServerResponse] = useState("");
    const [open, setOpen] = useState(false);

    let token = Cookie.get('jwt');
    let decode = jwt.decode(token);
    const mail = decode.mail;

    const history = useHistory()

    let [quizList,setQuizList] = useState([
        {_id:'',title:''},
    ]);

    useEffect(()=>{

        axios.post("http://localhost:4000/test/creator/fetchTestTitles",{mail:mail})
            .then((response)=>{
                setQuizList([...response.data]);
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])

    const EditQuizHandler = (title) => {
        setTimeout(() => {
            history.push('/EditTest',{quizTitle:title})
        }, 500)
    }

    const DeleteQuizHandler = async (title,index) => {

        const response = await axios.post("http://localhost:4000/test/creator/delete",{
            mail:mail,
            title:title,
        });
        setServerResponse(response.data.message);
        setOpen(true);

        const values = [...quizList];
        values.splice(index,1);
        setQuizList(values);
    }

    const ViewQuizResultsHandler = (title,creatorMail) => {
        setTimeout(() => {
            history.push('/ViewResultsTeacher',{quizTitle:title,creatorMail:creatorMail})
        }, 500)
    }

    const handleToClose = () => {
        setOpen(false);
    };

    return (
        <div className={"test-creater-container"}>
            {/*<h2>TestCreator Works!</h2>*/}
            {/*<button className={"button-75"}> New Quiz</button>*/}
            <Link to="/EditTest"><button className={"button-75"}> New Quiz</button></Link>
            <br/><br/><br/><br/>
            <hr />
            { quizList.map((quizList,index) => (
                <div key={index} className={"quiz-item"}>
                    {quizList.title}
                    <Button
                        className={"button-style"}
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => {EditQuizHandler(quizList.title)}}
                    >Edit</Button>
                    <Button
                        className={"button-style"}
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => DeleteQuizHandler(quizList.title,index)}
                    >Delete</Button>
                    <Button
                        className={"button-style"}
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => ViewQuizResultsHandler(quizList.title,mail)}
                    >View Results</Button>
                </div>
            ))}
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

export default TestCreator;
