import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './HistoryPage.scss'
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {message} from 'antd'
import HeaderLogo from '../../assets/logo/header-logo.png'
import HistoryPNG from '../../assets/others/historyPNG.png'
import empty from '../../assets/others/empty.png'
import clear from '../../assets/others/x-button.png'
import Back from '../../assets/others/back-button.png'


import {Input} from "antd";
import { useNavigate } from 'react-router-dom';
import {
  getCategoryFood,
  getFilteredRecipes, getRecipeHistoryData,
  getRecipes,
  getSearchedRecipe, getSearchedRecipeByCateogry,
  getSortedRecipeDataBySortName, searchRecipeQuery
} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";

const HistoryPage = (props) => {
  const [historyData, setHistoryData] = useState([])
  const [masterHistoryData, setMasterHistoryData] = useState([])
  const [categoryFoodData, setCategoryFoodData] = useState([])
  const [load, setLoad] = useState(false)
  const [currentSort, setCurrentSort] = useState('new')
  const [currentCategory, setCurrentCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestion, setSuggestion] = useState([])
  let navigate = useNavigate()

  useEffect(() => {
    getCategoryFoodData()
    getHistoryData()
  }, []);

  const getHistoryData = async() =>{
    try{
      let response = await getRecipeHistoryData()
      let responseData = response.data.data.history
      console.log(responseData, ' in i')
      setHistoryData(responseData)
    }catch(e){
      message.error('Error fetching history data')
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

  const handleSearchRecipe =async() =>{
    try{
      let response = await getSearchedRecipe(searchQuery)
      let responseData = response.data.data
      setSuggestion([])
    }catch(e){
      return message.error('Error when fetching searched recipe')
    }
  }

  const handleClearQuery = () =>{
    setSearchQuery('')
    setSuggestion([])
  }

  const handleClickSuggestion = (item) =>{
    navigate('/recipe/' +item.id)
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

  const redirectBack = () =>{
    navigate('/')
  }


  const renderHeader = () =>{
    return <div className={'historypage-header-wrapper'}>
      <div style={{display:'flex', marginBottom:'1em'}}>
        <button data-cy='button-back' onClick={() =>redirectBack()} style={{border:'none', backgroundColor:'transparent'}}><img style={{width:'30px'}} src={Back}/></button>
        <p style={{marginLeft:'1em', fontSize:'26px', fontWeight:'bolder',fontFamily:'Poppins', margin:'auto 0'}}>Riwayat</p>
      </div>
      <Row style={{height:'100%'}}>
        <Col style={{margin:'auto'}}>
          <div>
            <Input style={{width:'80%'}} value={searchQuery} data-cy="header-input-search" onChange={(e) => handleInputSearch(e.target.value)}/>
            {searchQuery ? <img src={clear} data-cy='header-button-clear' style={{position: 'absolute',transform: 'translate(-25px, 3px)', cursor:'pointer'}} onClick={() =>handleClearQuery()}/> : ''}
            <Button style={{padding:'.3rem 1.2rem',marginBottom:'2px', backgroundColor:'#EF5734', border:'none'}} onClick={() => handleSearchRecipe()}  data-cy="header-button-search">Cari</Button>
            {renderSuggestionBox()}
          </div>
        </Col>
      </Row>
      <div style={{width:'100%', height:'35%'}}>
        {handleRenderCategoryButton()}
      </div>
    </div>
  }

  const handleRenderCategoryButton = () =>{
    return <div className={'historypage-header-category-wrapper'}>
      {categoryFoodData.map((item,index) => { return renderCategoryButton(item, index)})}
    </div>
  }

  const renderCategoryButton = (item, index) =>{
    return <div className={'historypage-header-category'}>
      <Button data-cy={"category-button-"+index} className={'historypage-header-category-button ' + renderStyleActiveCategoryButton(item.id)} onClick={() => handleSortCategory(item.id)}>{item.name}</Button>
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
      setLoad(false)
    }catch(e){
      message.error('Error fetching filter data')
      setLoad(false)
    }
  }

  const handleNavigateToRecipeDetail = (id) =>{
    navigate('/recipe/'+id)
  }


  const renderSpinner = () =>{
    return <div style={{display:'flex',alignItems:'center', justifyContent:'center', height:'100%'}}>
      <Spinner animation="grow" />
    </div>
  }

  const handleSort = async(sortBy) =>{
    setCurrentSort(sortBy)
    if(sortBy == 'new'){
      getHistoryData()
      return
    }
    setLoad(true)
    try{
      let response = await getSortedRecipeDataBySortName(sortBy)
      let newCategoriesData = response.data.data
      setLoad(false)

    }catch(e){
      message.error('Error fetching sorted data')
      setLoad(false)

    }
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
      let response = await searchRecipeQuery(query)
      let responseData = response.data.data
      setSuggestion(responseData)
      return
    }
    setSuggestion([])
  }

  const handleRenderContent = () =>{
    if(historyData && historyData.length > 0){
      return historyData.map(item => {
        return <div style={{marginBottom: '1em'}}><FoodCard recipe={item} type={'history'}/></div>
      })
    }
  }

  return (
    <div className={'historypage'}>
      <div className={'historypage-header'}>
        {renderHeader()}
      </div>
      <div style={{backgroundColor:'#E5E5E5'}}>
        <div className={'historypage-body'}>
          <div>
            <div style={{display:'flex', alignItems:'center', marginBottom:'20px'}}>
              <p style={{fontFamily:'Poppins', marginBottom:'0',fontWeight:'bold', fontSize:'16px', lineHeight:'24px'}}>Urutkan:</p>
              {renderSortButton()}
            </div>
          </div>
          {load ? renderSpinner() : <div>
            {handleRenderContent()}
          </div>}
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
