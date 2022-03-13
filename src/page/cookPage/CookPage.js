import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './CookPage.scss'
import {Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import {message} from 'antd'
import HeaderLogo from '../../assets/logo/header-logo.png'
import HistoryPNG from '../../assets/others/historyPNG.png'
import empty from '../../assets/others/empty.png'
import clear from '../../assets/others/x-button.png'
import Cek from '../../assets/others/cek.png'

import {Input} from "antd";
import { useNavigate,useParams } from 'react-router-dom';
import {
  getCategoryFood,
  getFilteredRecipes,
  getRecipes,
  getSearchedRecipe, getSearchedRecipeByCateogry,
  getSortedRecipeDataBySortName,
  getRecipeCookSteps
} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";
import { Steps } from 'antd';

const { Step } = Steps;

const CookPage = (props) => {
  const [foodData, setFoodData] = useState([])
  const [masterFoodData, setMasterFoodData] = useState([])
  const [categoryFoodData, setCategoryFoodData] = useState([])
  const [load, setLoad] = useState(false)
  const [currentSort, setCurrentSort] = useState('new')
  const [currentCategory, setCurrentCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestion, setSuggestion] = useState([])
  const recipeId = useParams().id
  const [recipeCook, setRecipeCook] =useState([])
  let navigate = useNavigate()

  useEffect(() => {
    getFoodData()
    getCategoryFoodData()
    getRecipeStepsData()
  }, []);


  const getFoodData = async() =>{
    setLoad(true)
    try{
      let response = await getRecipes()
      let recipeData = response.data.data
      setFoodData(recipeData)
      setMasterFoodData(recipeData)
      setLoad(false)
    }catch(e){
      message.error('Error when fetching recipes data')
      setLoad(false)
    }
  }

  const handleSearchRecipe =async() =>{
    try{
      let response = await getSearchedRecipe(searchQuery)
      let responseData = response.data.data
      setFoodData(responseData)
      setSuggestion([])
    }catch(e){
      message.error('Error when fetching searched recipe')
    }
  }

  const getCategoryFoodData = async() =>{
    try{
      let response = await getCategoryFood()
      let categoryData = response.data.data
      let allData = [{
        id: 0,
        name: 'Semua',
      }]
      let newArray = allData.concat(categoryData)
      setCategoryFoodData(newArray)
    }catch(e){
      message.error('Error when fetching category data')
    }
  }

  const getRecipeStepsData = async() =>{
    try{
      let response = await getRecipeCookSteps(recipeId)
      let recipeData = response.data.data
      recipeData.map(item => item.done = false)
      setRecipeCook(recipeData)
    }catch(e){
      message.error('Error fetching steps data')
    }
  }

  const handleClearQuery = () =>{
    setSearchQuery('')
    setSuggestion([])
    getFoodData()
  }

  const handleNavigateLogin = () =>{
    navigate('/login')
  }

  const handleClickSuggestion = (item) =>{
    navigate('/recipe/' +item.id)
  }

  const handleNavigateHistory = () =>{
    let foodToken = localStorage.getItem('Food-Token')
    if(!foodToken){
      navigate('/login')
    }
  }

  const renderSuggestionBox = () =>{
    if(suggestion.length > 0){
      return <div className={'suggestion-box'} data-cy={'search-suggestion-container'}>
        {suggestion.map(item =>{
          return <div style={{padding: '0.5em', cursor:'pointer'}} onClick={() =>handleClickSuggestion(item)}>
            <p style={{marginBottom:'0'}}>{item.name}</p>
          </div>})}
      </div>
    }
    return
  }

  const renderHeader = () =>{
    return <div className={'cookpage-header-wrapper'}>
      <Row style={{height:'65%'}}>
        <Col style={{margin:'auto'}}>
          <div>
            <img data-cy='header-logo' src={HeaderLogo} style={{cursor:'pointer'}} onClick={() => navigate('/')}/>
          </div>
        </Col>
        <Col xs={7}  style={{margin:'auto'}}>
          <div>
            <Input style={{width:'80%'}} value={searchQuery} data-cy="header-input-search" onChange={(e) => handleInputSearch(e.target.value)}/>
            {searchQuery ? <img src={clear} data-cy='header-button-clear' style={{position: 'absolute',transform: 'translate(-25px, 3px)', cursor:'pointer'}} onClick={() =>handleClearQuery()}/>
              : ''}<Button style={{padding:'.3rem 1.2rem',marginBottom:'2px', backgroundColor:'#EF5734', border:'none'}} onClick={() => handleSearchRecipe()}  data-cy="header-button-search">Cari</Button>
            {renderSuggestionBox()}
          </div>
        </Col>
        <Col style={{margin:'auto'}}>
          <div>
            <img style={{border:'1px solid #EAEAEA',textAlign:'center', borderRadius:'5px', padding:'3px', cursor:'pointer'}} src={HistoryPNG} data-cy={"header-button-history"} onClick={() =>handleNavigateHistory()}/>
          </div>
        </Col>
      </Row>
      <div style={{width:'100%', height:'35%'}}>
        {handleRenderCategoryButton()}
      </div>
    </div>
  }

  const handleRenderCategoryButton = () =>{
    return <div className={'cookpage-header-category-wrapper'}>
      {categoryFoodData.map((item,index) => { return renderCategoryButton(item, index)})}
    </div>
  }

  const renderCategoryButton = (item, index) =>{
    return <div className={'cookpage-header-category'}>
      <Button data-cy={"category-button-"+index} className={'cookpage-header-category-button ' + renderStyleActiveCategoryButton(item.id)} onClick={() => handleSortCategory(item.id)}>{item.name}</Button>
    </div>
  }

  const renderStyleActiveCategoryButton = (id) => {
    if (currentCategory == id) {
      return 'category-active'
    }
    return 'category-non-active'
  }

  const handleSearchRecipeByCategory = async(id) =>{
    setLoad(true)
    try{
      let response = await getSearchedRecipeByCateogry(searchQuery, id)
      let responseData = response.data.data
      setFoodData(responseData)
      setLoad(false)
    }catch(e){
      message.error('Error when fetching data recipe by category')
      setLoad(false)
    }
  }

  const handleSortCategory =async(id) =>{
    setCurrentCategory(id)
    setCurrentSort('new')
    if(searchQuery){
      if(id == 0){
        handleSearchRecipe()
        return
      }
      handleSearchRecipeByCategory(id)
      return
    }
    setLoad(true)
    try{
      let response = await getFilteredRecipes(id)
      let foodData = response.data.data
      setFoodData(foodData)
      setLoad(false)
    }catch(e){
      message.error('Error fetching filter data')
      setLoad(false)
    }
  }

  const handleNavigateToRecipeDetail = (id) =>{
    navigate('/recipe/'+id)
  }

  const handleRenderContent = () =>{
    let current = recipeCook.findIndex(item => item.done == false)

    return <Card>
      <Card.Body>
        <Steps current={current} direction="vertical">
          { recipeCook.map((item,index) => {return <Step data-cy={'item-step'+index} title={"Step "+(index+1)} description={handleDescription(item, current, index)} />})}
        </Steps>
      </Card.Body>
    </Card>
  }

  const handleDoneButton = (index) =>{
    let cookData= [...recipeCook];
    cookData[index].done = true;
    setRecipeCook(cookData)
  }

  const handleRenderProcessDone = (item, index) =>{
    if(item.done){
      return <div style={{display:'flex'}}>
        <img src={Cek} style={{width:'12px',height:'12px', margin:'auto 0'}}/>
        <p data-cy={'text-step-done'} style={{marginLeft:'10px',marginBottom:'0',fontFamily:'Poppins', color:'#2BAF2B'}}>Selesai</p>
      </div>
    }

    if(index == recipeCook.length-1){
      return <button
        style={{color:'white',borderRadius:'6px', backgroundColor:'#EF5734', border:'none', width:'250px', fontFamily:'Poppins', fontWeight:'600', padding:'1em 0'}}
        data-cy={'button-serve'}
      >Sajikan Makanan</button>
    }

    return <button
      style={{color:'white',borderRadius:'6px', backgroundColor:'#2BAF2B', border:'none', width:'250px', fontFamily:'Poppins', fontWeight:'600', padding:'1em 0'}}
      onClick={() => handleDoneButton(index)}
      data-cy={'button-step-done'}
    >Selesai</button>
  }

  const handleDescription = (item,current,index) =>{
    return <div>
      <p style={{fontWeight:'600'}}>{item.description}</p>
      {index <= current ? handleRenderProcessDone(item, index) : ''}
    </div>
  }

  const renderSpinner = () =>{
    return <div style={{display:'flex',alignItems:'center', justifyContent:'center', height:'100%'}}>
      <Spinner animation="grow" />
    </div>
  }


  const handleInputSearch = (query) =>{
    setSearchQuery(query)
    if(masterFoodData.recipes.length > 0){
      let matchesNew = masterFoodData.recipes.filter(item => {
          return Object.values(item.name).join('').toLowerCase().includes(query.toLowerCase())
        }
      );
      setSuggestion(matchesNew)
    }

    if(!query){
      setSuggestion([])
    }
  }


  return (
    <div className={'cookpage'}>
      <div className={'cookpage-header'}>
        {renderHeader()}
      </div>
      <div style={{backgroundColor:'#E5E5E5'}}>
        <div className={'cookpage-body'}>
          {load ? renderSpinner() : <div className={'cookpage-body-cards'}>
            {handleRenderContent()}
          </div>}
        </div>
      </div>
    </div>
  );
}

export default CookPage;
