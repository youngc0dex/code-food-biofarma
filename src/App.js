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
import Homepage from './page/homePage/HomePage'
import './index.css'

function App() {
  return (
    <Router>
        <Routes basename={process.env.PUBLIC_URL}>
          <Route path='/' element={<Login/>} />
          <Route path='/code-food-homepage' element ={<Homepage/>}/>
        </Routes >
    </Router>
  );
}

export default App;
