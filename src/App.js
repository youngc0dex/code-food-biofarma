import React from "react";
import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link,
} from "react-router-dom";
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './page/loginPage/login'
import './index.css'

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
        <Routes >
          <Route path='/' element={<Login/>} />
        </Routes >
    </Router>
  );
}

export default App;
