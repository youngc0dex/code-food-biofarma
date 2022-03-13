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
  getRecipeCookSteps, postCookProgress, updateCookProgress
} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";
import { Steps } from 'antd';
import Back from "../../assets/others/back-button.png";

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
  const qty  = useParams().nServe
  const [recipeCook, setRecipeCook] =useState([])
  const [currentCookId, setCurrentCookId] = useState('')
  let navigate = useNavigate()

  useEffect(() => {
    getFoodData()
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
        {suggestion.map((item,index) =>{
          return <div style={{padding: '0.5em', cursor:'pointer'}} data-cy={'search-suggestion-'+index}onClick={() =>handleClickSuggestion(item)}>
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
    </div>
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

  const redirectBack = () =>{
    navigate('/recipe/'+recipeId)
  }

  const handleRenderContent = () =>{
    let current = recipeCook.findIndex(item => item.done == false)

    return <Card>
      <Card.Title>
        <div style={{position:'absolute', transform:'translate(10px,10px)'}}>
          <button data-cy='button-back' onClick={() =>redirectBack()} style={{border:'none', backgroundColor:'transparent'}}><img style={{width:'30px'}} src={Back}/></button>
        </div> <h5 style={{marginLeft:'3em', marginTop:'10px'}} data-cy={'text-title'}>Langkah Memasak</h5>
      </Card.Title>
      <Card.Body>
        <Steps current={current} direction="vertical">
          { recipeCook.map((item,index) => {return <Step data-cy={'item-step'+index} title={"Step "+(item.stepOrder)} description={handleDescription(item, current, index)} />})}
        </Steps>
        {renderDoneCookButton()}
      </Card.Body>
    </Card>
  }

  const handleDoneButton = async(index) =>{
    if(index == 1){
      try{
        let payload = {
          nServing:qty,
          recipeId:recipeId,
        }

        let response = await postCookProgress(payload)
        let responseData = response.data.data
        setCurrentCookId(responseData.id)
        setRecipeCook(responseData.steps)
        return
      }catch(e){
        return message.error('Failed to update cooking progress')
      }
    }

    try{
      let payload = {
          stepOrder:index
      }
      let response = await updateCookProgress(currentCookId, payload)
      let responseData = response.data.data.steps
      setRecipeCook(responseData)
    }catch(e){
      return message.error('Failed update current steps')
    }
  }

  const handleRenderProcessDone = (item, index) =>{
    if(item.done){
      return <div style={{display:'flex'}}>
        <img src={Cek} style={{width:'12px',height:'12px', margin:'auto 0'}}/>
        <p data-cy={'text-step-done'} style={{marginLeft:'10px',marginBottom:'0',fontFamily:'Poppins', color:'#2BAF2B'}}>Selesai</p>
      </div>
    }

    return <button
      style={{color:'white',borderRadius:'6px', backgroundColor:'#2BAF2B', border:'none', width:'250px', fontFamily:'Poppins', fontWeight:'600', padding:'1em 0'}}
      onClick={() => handleDoneButton(item.stepOrder)}
      data-cy={'button-step-done'}
    >Selesai</button>
  }

  const renderDoneCookButton = () =>{
    let checkIfNotDone = recipeCook.find(item => item.done == false)
    if(checkIfNotDone){
      return
    }
    return <div style={{width:'100%', textAlign:'center'}}><button
      style={{color:'white',borderRadius:'6px', backgroundColor:'#EF5734', border:'none', width:'250px', fontFamily:'Poppins', fontWeight:'600', padding:'1em 0'}}
      data-cy={'button-serve'}
      onClick = {() =>handleServeFood()}
    >Sajikan Makanan</button>
    </div>
  }

  const handleServeFood = async() =>{
    navigate('/rating/' + currentCookId)
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