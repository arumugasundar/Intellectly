import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import Header from "./components/Shared/Header/Header";
import Home from "./components/Home/Home";
import SignUp from "./components/Auth/SignUp/SignUp"
import LogIn from "./components/Auth/LogIn/LogIn"
import TestCreator from "./components/TestCreator/TestCreator"
import TestWriter from "./components/TestWriter/TestWriter";
import Cookie from "js-cookie";
import { ProtectedRoute } from "./components/Shared/ProtectedRoute"
import { ProtectedEntryRoute } from "./components/Shared/ProtectedEntryRoute"

function App() {
    const [token, setToken] = useState('');

    useEffect(() => {
        setToken(Cookie.get('jwt'));
    },[])
    return (
        <div className={'app-background'}>
            <Router >
                <Header token={token} setToken={setToken}/>
                <Switch>
                    <Route path={"/"} exact> <Home /> </Route>
                    {/*<Route path={"/login"} exact> <LogIn token={token} setToken={setToken} /> </Route>*/}
                    {/*<Route path={"/signup"} exact> <SignUp /> </Route>*/}

                    <ProtectedEntryRoute path={"/login"} exact component={LogIn} token={token} setToken={setToken} />
                    <ProtectedEntryRoute path={"/signup"} exact component={SignUp} />

                    <ProtectedRoute path={"/createQuiz"} exact component={TestCreator} />
                    <ProtectedRoute path={"/takeQuiz"} exact component={TestWriter} />
                    <Redirect to={"/"} />
                </Switch>
            </Router>
        </div>
    );

  //   const [courseGoals,setCourseGoals] = useState([
  //           {id: 'cg1', text:'item1'},
  //           {id: 'cg2', text:'item2'},
  //           {id: 'cg3', text:'item3'}
  //       ]);
  //
  //   const addNewGoalHandler = (newGoal) => {
  //       // setCourseGoals(courseGoals.concat(newGoal));
  //       setCourseGoals(prevCourseGoals => prevCourseGoals.concat(newGoal));
  //   };
  //
  // return (
  //     <div className={"course-goals"}>
  //       <h2>Course Goals</h2>
  //         <NewGoal onAddGoal={addNewGoalHandler}/>
  //         <GoalList goals={courseGoals} />
  //     </div>
  // );
}

export default App;
