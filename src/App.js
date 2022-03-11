import React from "react";
import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link,
} from "react-router-dom";
import Login from './page/loginPage/login'

function App() {
  return (
    <Router>
        <Routes >
          <Route path='/' element={<Login/>} />
        </Routes >
    </Router>
  );
}

export default App;
