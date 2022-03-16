import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './HomePage.scss'
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {message} from 'antd'
import HeaderLogo from '../../assets/logo/header-logo.png'
import HistoryPNG from '../../assets/others/historyPNG.png'
import empty from '../../assets/others/empty.png'
import clear from '../../assets/others/x-button.png'

import {Input} from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import {
  getCategoryFood,
  getRecipes, getSearchedRecipes,
} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";

const HomePage = (props) => {
  const [foodData, setFoodData] = useState([])
  const [categoryFoodData, setCategoryFoodData] = useState([])
  const [load, setLoad] = useState(false)
  const [currentSort, setCurrentSort] = useState('new')
  const [currentCategory, setCurrentCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestion, setSuggestion] = useState([])
  let navigate = useNavigate()
  let queryDefault = useParams().query

  useEffect(() => {
    getFoodData()
    getCategoryFoodData()
  }, []);

  useEffect(() =>{
    getFoodData()
  },[queryDefault])


  const getFoodData = async(query,categoryId,sortBy) =>{
    if(queryDefault){
      getSearchedRecipes(queryDefault)
      return
    }
    setLoad(true)
    let queryNew = query || '';
    let categoryIdNew = categoryId || ''
    let sortByNew = sortBy || ''
    try{
      let response = await getRecipes(queryNew,categoryIdNew, sortByNew)
      let recipeData = response.data.data
      setFoodData(recipeData)
      setLoad(false)
    }catch(e){
      message.error('Error when fetching recipes data')
      setLoad(false)
    }
  }

  const handleSearchRecipe =async() =>{
    try{
      let response = await getRecipes(searchQuery)
      let responseData = response.data.data
      setFoodData(responseData)
      setSuggestion([])
    }catch(e){
      return message.error('Error when fetching searched recipe')
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

  const clearState = () =>{
    setSearchQuery('')
    setCurrentSort('new')
    setCurrentCategory(0)
  }

  const handleClearQuery = () =>{
    setSearchQuery('')
    setSuggestion([])
    clearState()
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
    let foodToken2 = sessionStorage.getItem('Food-Token')
    if(foodToken || foodToken2){
      navigate('/history')
      return
    }
    navigate('/login')
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
    return <div className={'homepage-header-wrapper'}>
      <Row style={{height:'65%'}}>
        <Col style={{margin:'auto'}}>
          <div>
            <img data-cy='header-logo' src={HeaderLogo} style={{cursor:'pointer'}} onClick={() => navigate('/')}/>
          </div>
        </Col>
        <Col xs={7}  style={{margin:'auto'}}>
          <div>
            <Input style={{width:'80%'}} value={searchQuery} data-cy="header-input-search" onChange={(e) => handleInputSearch(e.target.value)}/>
            {searchQuery ? <img src={clear} data-cy='header-button-clear' style={{position: 'absolute',transform: 'translate(-25px, 3px)', cursor:'pointer'}} onClick={() =>handleClearQuery()}/> : ''}
            <Button style={{padding:'.3rem 1.2rem',marginBottom:'2px', backgroundColor:'#EF5734', border:'none'}} onClick={() => handleSearchRecipe()}  data-cy="header-button-search">Cari</Button>
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
    return <div className={'homepage-header-category-wrapper'}>
      {categoryFoodData.map((item,index) => { return renderCategoryButton(item, index)})}
    </div>
  }

  const renderCategoryButton = (item, index) =>{
    return <div className={'homepage-header-category'}>
      <Button data-cy={"category-button-"+index} className={'homepage-header-category-button ' + renderStyleActiveCategoryButton(item.id)} onClick={() => handleSortCategory(item.id)}>{item.name}</Button>
    </div>
  }

  const renderStyleActiveCategoryButton = (id) => {
    if (currentCategory == id) {
      return 'category-active'
    }
    return 'category-non-active'
  }

  const handleSortCategory =async(id) =>{
    setCurrentCategory(id)
    setLoad(true)
    await getFoodData(searchQuery,id,currentSort)
  }

  const handleNavigateToRecipeDetail = (id) =>{
    navigate('/recipe/'+id)
  }

  const handleRenderContent = () =>{
    if(!foodData.recipes || foodData.recipes.length == 0){
      return <div style={{margin:'0 auto', width:'587', height:'332'}}>
        <img src={empty} data-cy={'list-image-empty'}/>
        <p data-cy={'list-text-empty'} style={{marginTop:'1em',textAlign:'center', fontSize:'18px',lineHeight:'32.4px', fontWeight:'500', fontFamily:'Poppins'}}>Oops! Resep tidak ditemukan.</p>
      </div>
    }
    return foodData.recipes.map((item,index) => {
      return <FoodCard index ={index} recipe={item} type={'list'} handleNavigateToRecipeDetail={(id) => handleNavigateToRecipeDetail(id)}/>
    })
  }

  const renderSpinner = () =>{
    return <div style={{display:'flex',alignItems:'center', justifyContent:'center', height:'100%'}}>
      <Spinner animation="grow" />
    </div>
  }

  const handleSort = async(sortBy) =>{
    setCurrentSort(sortBy)
    await getFoodData(searchQuery,currentCategory,sortBy)
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
        code:'name_asc',
        dataCy:'button-sort-az'
      },{
        name:'Urutkan Z-A',
        code:'name_desc',
        dataCy:'button-sort-za'
      },{
        name:'Urutkan Dari Paling Disukai',
        code:'like_desc',
        dataCy:'button-sort-favorite'
      },
    ]

    return sortButton.map(item => {return <Button className={renderStyleActiveSort(item.code)} data-cy={item.dataCy} style={{margin:'0 10px'}} onClick={() =>handleSort(item.code)}>
      {item.name}
    </Button>})
  }


  const handleInputSearch = async(query) =>{
    setSearchQuery(query)
    if(query.length > 1){
      let response = await getRecipes(query, currentCategory)
      let responseData = response.data.data.recipes
      setSuggestion(responseData)
      return
    }
    setSuggestion([])
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
