import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './HomePage.scss'
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {message} from 'antd'
import HeaderLogo from '../../assets/logo/header-logo.png'
import HistoryPNG from '../../assets/others/historyPNG.png'
import {Input} from "antd";
import { useNavigate } from 'react-router-dom';
import {getCategoryFood, getRecipes} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";

const HomePage = (props) => {
  const [foodData, setFoodData] = useState([])
  const [categoryFoodData, setCategoryFoodData] = useState([{
    id: 0,
    name: 'Semua',
  }])
  const [load, setLoad] = useState(false)
  const [currentSort, setCurrentSort] = useState('new')
  const [currentCategory, setCurrentCategory] = useState(0)
  let navigate = useNavigate()

  useEffect(() => {
    getFoodData()
    getCategoryFoodData()
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

  const getCategoryFoodData = async() =>{
    try{
      let response = await getCategoryFood()
      let categoryData = response.data.data
      setCategoryFoodData(categoryData)
    }catch(e){
      message.error('Error when fetching category data')
    }
  }

  const handleNavigateToHomePage = () =>{
    navigate('/code-food-homepage')
  }

  const renderHeader = () =>{
    return <div className={'homepage-header-wrapper'}>
      <Row style={{height:'65%'}}>
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
            <img style={{border:'1px solid #EAEAEA',textAlign:'center', borderRadius:'5px', padding:'3px', cursor:'pointer'}} src={HistoryPNG} data-cy={"header-logo"}/>
          </div>
        </Col>
      </Row>
      {handleRenderCategoryButton()}
    </div>
  }

  const handleRenderCategoryButton = () =>{
    return <div className={'homepage-header-category-wrapper'}>
      {categoryFoodData.map((item,index) => { return renderCategoryButton(item, index)})}
    </div>
  }

  const renderCategoryButton = (item, index) =>{
    return <div className={'homepage-header-category'}>
      <Button className={'homepage-header-category-button ' + renderStyleActiveCategoryButton(item.id)} onClick={() => handleSortCategory(item.id)}data-cy={'category-button' + index}>{item.name}</Button>
    </div>
  }

  const renderStyleActiveCategoryButton = (id) => {
    if (currentCategory == id) {
      return 'category-active'
    }
    return 'category-non-active'
  }

  const handleSortCategory =(id) =>{
    setCurrentCategory(id)
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

  const handleSort = (sortBy) =>{
    setCurrentSort(sortBy)
  }

  const renderStyleActiveSort = (code) =>{
    if(code == currentSort){
      return 'active-button-sort'
    }
    return 'not-active-button-sort'
  }

  const renderSortButton = () =>{
    let sortButton =[
      {
        name:'Terbaru',
        code:'new',
        dataCy:'button-sort-latest'
      },{
        name:'Urutkan A-Z',
        code:'asc',
        dataCy:'button-sort-az'
      },{
        name:'Urutkan Z-A',
        code:'desc',
        dataCy:'button-sort-za'
      },{
        name:'Urutkan Dari Paling Disukai',
        code:'liked',
        dataCy:'button-sort-favorite'

      },
    ]

    return sortButton.map(item => {return <Button className={renderStyleActiveSort(item.code)} style={{margin:'0 10px'}} onClick={() =>handleSort(item.code)}>
      {item.name}
    </Button>})
  }


  return (
    <div className={'homepage'}>
      <div className={'homepage-header'}>
        {renderHeader()}
      </div>
      <div style={{backgroundColor:'#E5E5E5'}}>
        <div className={'homepage-body'}>
          <div>
            <div style={{display:'flex', alignItems:'center', marginBottom:'20px'}}>
              <p style={{fontFamily:'Poppins', marginBottom:'0',fontWeight:'bold', fontSize:'16px', lineHeight:'24px'}}>Urutkan:</p>
              {renderSortButton()}
            </div>
          </div>
          {load ? renderSpinner() : <div className={'homepage-body-cards'}>
            {handleRenderContent()}
          </div>}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
