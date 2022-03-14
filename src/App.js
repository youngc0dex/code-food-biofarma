import React from "react";
import {
  BrowserRouter as Router,
  HashRouter,
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
import HistoryPage from "./page/historyPage/HistoryPage";
function App(props) {
  return (
    <HashRouter>
    {/*<Router >*/}
      <Routes>
          <Route exact path='/' element={<Homepage/>} />
          <Route path='/login' element ={<Login/>}/>
          <Route path='/recipe/:id' element ={<RecipePage/>}/>
          <Route path='/cook/:id/:nServe' element ={<CookPage/>}/>
          <Route path='/rating/:id' element ={<RatingPage/>}/>
         <Route path='/history' element ={<HistoryPage/>}/>
         <Route path='/cook/:id/:nServe/:serveId' element ={<CookPage/>}/>
         <Route path='/recipe/:id/:nServe' element ={<RecipePage/>}/>

      </Routes >
    </HashRouter>
  );
}

export default App;
