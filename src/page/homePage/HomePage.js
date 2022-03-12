import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './HomePage.scss'
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {message} from 'antd'
import HeaderLogo from '../../assets/logo/header-logo.png'
import HistoryPNG from '../../assets/others/historyPNG.png'
import {Input} from "antd";
import { useNavigate } from 'react-router-dom';
import {getRecipes} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";

const HomePage = (props) => {
  const [foodData, setFoodData] = useState([])
  const [load, setLoad] = useState(false)
  let navigate = useNavigate()

  useEffect(() => {
    getFoodData()
  }, []);

  const getFoodData = async() =>{
    setLoad(true)
    try{
      let response = await getRecipes()
      let recipeData = response.data.data
      setFoodData(recipeData)
      setLoad(false)
    }catch(e){
      message.error('Error when fetching recipes data')
      setLoad(false)
    }
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
    if(!foodData.recipes || foodData.recipes.length == 0){
      return <h2>No Recipes at the moment</h2>
    }
    return foodData.recipes.map((item,index) => {
      return <FoodCard index ={index} recipe={item}/>
    })
  }

  const renderSpinner = () =>{
    return <div style={{display:'flex',alignItems:'center', justifyContent:'center', height:'100%'}}>
      <Spinner animation="grow" />
    </div>
  }


  return (
    <div className={'homepage'}>
      <div className={'homepage-header'}>
        {renderHeader()}
      </div>
      <div style={{backgroundColor:'#E5E5E5'}}>
        <div className={'homepage-body'}>
          {load ? renderSpinner() : <div className={'homepage-body-cards'}>
            {handleRenderContent()}
          </div>}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
