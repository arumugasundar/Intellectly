import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookie from "js-cookie";

export const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render = { props => {
                //console.log(Cookie.get('jwt'));
                if(Cookie.get('jwt')){
                    return <Component {...props} />
                }else{
                    return (
                        <Redirect to={{
                            pathname: "/",
                            state: {
                                from: props.location
                            }
                        }} />
                    );
                }
            }}
        />
    );
};
