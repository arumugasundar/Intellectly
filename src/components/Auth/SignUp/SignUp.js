import React, {useState} from 'react';
import './SignUp.css'
import face from "../face.png";
import axios from "axios";
import validator from 'validator'
import Snackbar from '@mui/material/Snackbar';
import {useHistory} from "react-router-dom";


const SignUp = props => {

    const [userData, setUserData] = useState({});
    const [serverResponse, setServerResponse] = useState("");
    const [open, setOpen] = React.useState(false);
    const [redirect, setRedirect] = useState(false);

    const history = useHistory()

    const handleToClose = () => {
        setOpen(false);
    };

    const handleChange = e => {
        setUserData({...userData,[e.target.name]:e.target.value})
    }

    // For Email Validation
    const [emailError, setEmailError] = useState(null)
    const validateEmail = (email) => {
        //var email = e.target.value

        if (validator.isEmail(email)) {
            setEmailError(null)
        } else {
            setEmailError('Enter valid Email!')
        }
    }

    // For Password Validation
    const [passwordError, setPasswordError] = useState('');
    const [passwordErrorColor, setPasswordErrorColor] = useState('yellow');

    const validatePassword = (value) => {

        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setPasswordError('Strong Password!')
            setPasswordErrorColor('lightgreen')
        } else {
            setPasswordError('Password is weak!')
            setPasswordErrorColor('yellow')
        }
    }


    const handleSubmit = async e => {
        e.preventDefault();
        const response = await axios.post("http://localhost:4000/auth/signup",{data:userData});
        if(response.data.message === "User created"){
            setServerResponse(response.data.message);
            setRedirect(true);
        }
        else
            setServerResponse(response.data.message);
        setOpen(true);
    }

    if(redirect){
        //window.location.reload(true);
        setTimeout(() => {
            history.push('/login')
        }, 2000)
    }


    return (
        <div className ={"modal-dialog text center"}>
            <div className ={"col-sm-9 main-section"}>
                <div className ={"modal-content"}>

                    <div className ={"col-12 user-img"}>
                        <img src={face} alt={"face"}/>
                    </div>

                    <div className ={"col-12 form-input"}>
                        <form onSubmit={handleSubmit} onChange={handleChange}>
                            <div className={"form-group"}><input type={"email"} className={"form-control"} placeholder={"Enter Email"} name={"mail"} onChange={e => validateEmail(e.target.value)}/>{emailError?<p style={{fontWeight: 'bold', color: passwordErrorColor}}>Invalid Email!</p>:null}</div>
                            <div className={"form-group"}>
                                <input type={"password"} className={"form-control"} placeholder={"Enter Password"} name={"password"} onChange={e => validatePassword(e.target.value)}/>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: passwordErrorColor,
                                }}>{passwordError}</span>
                                {(passwordError === "Password is weak!")?
                                    <p style={{color: 'lightgreen'}}>Minimum of 8 characters needed with atleast one character belonging to lowercase, uppercase, numbers and symbols. </p>
                                    :null
                                }
                            </div>
                            <div className={"form-group"}><input type={"password"} className={"form-control"} placeholder={"Confirm Password"} name={"confirmPassword"}/></div>
                            <button type={"submit"} className={"btn btn-success"}>SignUp</button>
                        </form>
                    </div>
                    <div className={"col-12 forgot"}> <a href={"/login"}> Existing User? </a> </div>
                    {/*<div className={"col-12 forgot"}> <a href={"/login"}> Forgot Password? </a> </div>*/}
                </div>
            </div>
            <br /><br /><br /><br />
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

export default SignUp;
