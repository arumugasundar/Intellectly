import React, {useEffect, useState} from 'react';
import './EditTest.css'
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import {useHistory} from "react-router-dom";
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const EditTest = props => {

    const [titleDisabled, setTitleDisabled] = useState(false);
    const [serverResponse, setServerResponse] = useState("");
    const [open, setOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);

    let token = Cookie.get('jwt');
    let decode = jwt.decode(token);
    const mail = decode.mail;

    const [title,setTitle] = useState('');
    const [questions,setQuestions] = useState([
        {
            question_text:'',
            option1: '',option2: '',option3: '',option4: '',
            crt_answer:'',
            mark:''},
    ]);
    // const [assignee,setAssignee] = useState([]);

    useEffect(() => {
        //console.log(props.location.state.quizTitle)
        if(props.location.state && props.location.state.quizTitle){
            setTitle(props.location.state.quizTitle);
            //console.log(title,props.location.state.quizTitle);
            setTitleDisabled(!titleDisabled);
            axios.post("http://localhost:4000/test/fetchTestData",{mail:mail,title:props.location.state.quizTitle})
                    .then((response) => {
                        console.log(response.data.questions);
                        if(response.data.questions) setQuestions(response.data.questions);
                    })
                    .catch(error => { console.log(error)})
        }
    },[])

    const history = useHistory()

    const handleToClose = () => {
        setOpen(false);
    };

    const ChangeHandler = (index,event) => {
        const values = [...questions];
        values[index][event.target.name] = event.target.value;
        setQuestions(values);
    }

    const SubmitHandler = async e => {
        e.preventDefault();
        //console.log(questions);
        if(props.location.state && props.location.state.quizTitle){
            const response = await axios.post("http://localhost:4000/test/update",{
                mail:mail,
                title:title,
                questions:questions,
                // assignee:assignee
            });

            setServerResponse(response.data.message);
            if (response.data.message === "Test Updated Successfully"){
                setRedirect(true);
            }
        }else{
            const response = await axios.post("http://localhost:4000/test/create",{
                mail:mail,
                title:title,
                questions:questions,
                // assignee:assignee
            });

            setServerResponse(response.data.message);
            if (response.data.message === "Test Saved Successfully"){
                setRedirect(true);
            }
        }

        setOpen(true);
    }

    if(redirect){
        setTimeout(() => {
            history.push('/TestCreator')
        }, 2000)
    }

    const handleAddQuestions = () => {
        setQuestions([...questions,{question_text:'',crt_answer:'',option1: '',option2: '',option3: '',option4: '',mark:''}])
    }

    const handleRemoveQuestions = (index) => {
        const values = [...questions];
        values.splice(index,1);
        setQuestions(values);
    }

    return (
        <div className={"edit-test-container"}>
            <form className={"form-group"} onSubmit={SubmitHandler}>
                <br />
                <TextField
                    disabled={titleDisabled}
                    name={"title"}
                    label={"Quiz Title"}
                    value={title}
                    onChange={(e)=>{setTitle(e.target.value)}}
                />
                { questions.map((questions,index) => (
                    <div key={index}>
                        <br /><hr />
                        <span>Question No : {index+1}</span><br /><br />
                        <TextField
                            className={"textfield"}
                            name={"question_text"}
                            label={"Question"}
                            value={questions.question_text}
                            onChange={event => ChangeHandler(index,event)}
                        /><br /><br />

                        <TextField
                            className={"text-input-style"}
                            name={"option1"}
                            label={"Option 1"}
                            value={questions.option1}
                            onChange={event => ChangeHandler(index,event)}
                        />&nbsp;&nbsp;
                        <TextField
                            className={"text-input-style"}
                            name={"option2"}
                            label={"Option 2"}
                            value={questions.option2}
                            onChange={event => ChangeHandler(index,event)}
                        />&nbsp;&nbsp;
                        <TextField
                            className={"text-input-style"}
                            name={"option3"}
                            label={"Option 3"}
                            value={questions.option3}
                            onChange={event => ChangeHandler(index,event)}
                        />&nbsp;&nbsp;
                        <TextField
                            className={"text-input-style"}
                            name={"option4"}
                            label={"Option 4"}
                            value={questions.option4}
                            onChange={event => ChangeHandler(index,event)}
                        />
                        <br/><br/>
                        <TextField
                            className={"text-input-style"}
                            name={"crt_answer"}
                            label={"Correct Answer"}
                            value={questions.crt_answer}
                            onChange={event => ChangeHandler(index,event)}
                        />&nbsp;&nbsp;
                        <TextField
                            className={"text-input-style"}
                            name={"mark"}
                            label={"Marks"}
                            value={questions.mark}
                            onChange={event => ChangeHandler(index,event)}
                        /><br /><br />
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            endIcon={<Icon>delete</Icon>}
                            onClick={() => handleRemoveQuestions(index)}
                        >Delete</Button>
                        <br /><hr /><br />
                    </div>
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    endIcon={<Icon>add</Icon>}
                    onClick={handleAddQuestions}
                >Add Questions</Button>&nbsp;&nbsp;
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    endIcon={<Icon>send</Icon>}
                    onClick={SubmitHandler}>
                    {(props.location.state && props.location.state.quizTitle)?<>Update Quiz</>:<>Create Quiz</>}
                </Button>
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

export default EditTest;
