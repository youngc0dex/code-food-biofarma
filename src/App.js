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
import RecipePage from "./page/recipePage/RecipePage";
import CookPage from "./page/cookPage/CookPage"
import RatingPage from "./page/ratingPage/RatingPage"

import './index.css'
function App(props) {
  return (
    // <Router basename={process.env.PUBLIC_URL}>
    <Router >
      <Routes>
          <Route exact path='/' element={<Homepage/>} />
          <Route path='/login' element ={<Login/>}/>
          <Route path='/recipe/:id' element ={<RecipePage/>}/>
          <Route path='/cook/:id/:nServe' element ={<CookPage/>}/>
          <Route path='/rating/:id' element ={<RatingPage/>}/>
      </Routes >
    </Router>
  );
}

export default App;
