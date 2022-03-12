import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './HomePage.scss'
import {Button, Col, Container, Row} from "react-bootstrap";
import HeaderLogo from '../../assets/logo/header-logo.png'
import HistoryPNG from '../../assets/others/historyPNG.png'
import {Input} from "antd";
import { useNavigate } from 'react-router-dom';

const HomePage = (props) => {
  const [foodData, setFoodData] = useState([])
  let navigate = useNavigate()



  useEffect(() => {

  });

  const getFoodData = async() =>{

  }

  const handleNavigateToHomePage = () =>{
    navigate('/code-food-homepage')
  }

  const renderHeader = () =>{
    return <div className={'homepage-header-wrapper'}>
      <Row style={{height:'100%'}}>
        <Col style={{margin:'auto'}}>
          <div>
            <img src={HeaderLogo} data-cy={"header-logo"} onClick={() => handleNavigateToHomePage()} style={{cursor:'pointer'}}/>
          </div>
        </Col>
        <Col xs={7}  style={{margin:'auto'}}>
          <div>
            <Input style={{width:'80%'}} data-cy={"header-input-search"}/> <Button style={{padding:'.3rem 1.2rem',marginBottom:'2px', backgroundColor:'#EF5734', border:'none'}} data-cy={"header-button-search"}>Cari</Button>
          </div>
        </Col>
        <Col style={{margin:'auto'}}>
          <div>
            <img style={{border:'1px solid #EAEAEA', borderRadius:'5px', padding:'3px', cursor:'pointer'}} src={HistoryPNG} data-cy={"header-logo"}/>
          </div>
        </Col>
      </Row>
    </div>
  }

  const handleRenderContent = () =>{
    return <div>

    </div>
  }


  return (
    <div className={'homepage'}>
      <div className={'homepage-header'}>
        {renderHeader()}
      </div>
      <div className={'homepage-body'}>
      </div>
    </div>
  );
}

export default HomePage;
