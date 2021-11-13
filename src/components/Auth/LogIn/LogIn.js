import React, {useState} from 'react';
import './LogIn.css'
import face from "../face.png";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Cookie from "js-cookie";
import {useHistory} from "react-router-dom";

const LogIn = props => {
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

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await axios.post("http://localhost:4000/auth/login",{data:userData});
        setServerResponse(response.data.message);
        if (response.data.token){
            Cookie.set('jwt',response.data.token);
            props.setToken(response.data.token);
            console.log(response.data.token);
            setRedirect(true);
        }

        // const headers = {
        //     authorization: `Bearer ${Cookie.get('jwt')}`
        // };
        //
        // const response1 = await axios.get(
        //     "http://localhost:4000/auth/protected",
        //     {headers}
        //     );
        // console.log(response1.data);
        setOpen(true);
    }

    if(redirect){
        setTimeout(() => {
            history.push('/')
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
                            <div className={"form-group"}><input type={"email"} className={"form-control"} placeholder={"Enter Email"} name={"mail"}/></div>
                            <div className={"form-group"}><input type={"password"} className={"form-control"} placeholder={"Enter Password"} name={"password"}/></div>
                            <button type={"submit"} className={"btn btn-success"}>LogIn</button>
                        </form>
                    </div>
                    <div className={"col-12 forgot"}> <a href={"/signup"}> New User? </a> </div>
                    {/*<div className={"col-12 forgot"}> <a href={"#"}> Forgot Password? </a> </div>*/}
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

export default LogIn;
