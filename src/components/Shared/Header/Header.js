import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './Header.css'
import logo from './logo.png'
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import {Link, useHistory} from "react-router-dom";

const Header = props => {

    const history = useHistory()
    //let userToken = Cookie.get('jwt');
    let decode = jwt.decode(props.token);
    function logout(){
        Cookie.remove("jwt");
        //userToken = null;
        props.setToken(null);
        setTimeout(() => {
            history.push('/login')
        }, 2000)
    }

    return (
        <Navbar className="navbar navbar-light">
            <nav>
                <Link className="navbar-brand d-flex" to="/">
                    <img src={logo} width="40px" height="40px" alt="logo"/>
                    &nbsp;&nbsp;
                    <span className={'app-title'}>Intellectly</span>
                </Link>
            </nav>

            {props.token?
                <Nav className={"navbar-brand collapse navbar-collapse"}>
                    <Link className="navbar-brand" to="/createQuiz"> <button> Create Quiz </button> </Link>
                    <Link className="navbar-brand" to="/takeQuiz"> <button> Take Quiz </button> </Link>
                </Nav>:null
            }

            {props.token?
                <Nav>
                    <NavDropdown title={decode && decode.mail}>
                        <NavDropdown.Item onClick={logout}> Logout </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                :
                <Nav className={"navbar-brand collapse navbar-collapse justify-content-end"}>
                    <Link className="navbar-brand" to="/login"> <button> Login </button> </Link>
                    <Link className="navbar-brand" to="/signup"> <button> SignUp </button> </Link>
                </Nav>
            }
        </Navbar>
    );
};

export default Header;
