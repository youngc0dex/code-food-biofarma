import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './HistoryPage.scss'
import {Button, Col, Card, Row, Spinner} from "react-bootstrap";
import {message} from 'antd'
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
import { Select } from 'antd';

const { Option } = Select;

const HistoryPage = (props) => {
  const [historyData, setHistoryData] = useState([])
  const [masterHistoryData, setMasterHistoryData] = useState([])
  const [categoryFoodData, setCategoryFoodData] = useState([])
  const [load, setLoad] = useState(false)
  const [currentSort, setCurrentSort] = useState('newest')
  const [currentCategory, setCurrentCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentStatus,setCurrentStatus] = useState('')
  const [suggestion, setSuggestion] = useState([])
  const [showModal, setShowModal] = useState(false)
  let navigate = useNavigate()

  useEffect(() => {
    getCategoryFoodData()
    getHistoryData()
  }, []);

  const navigateToCookDetail = (recipeId, serving,serveId) =>{
    navigate('/cook/'+recipeId+'/'+serving+'/'+serveId)
  }

  const navigateToRatingDetail = (serveId) =>{
    navigate('/rating/'+serveId)
  }

  const getHistoryData = async(searchQueries, currentSorts, currentStatuses) =>{
    let sq = searchQueries ? searchQueries : searchQuery ? searchQuery : '';
    let cs = currentSorts ? currentSorts : currentSort ? currentSort : ''
    let cst = currentStatuses ? currentStatuses :currentStatus ? currentStatus : ''

    try{
      let response = await getRecipeHistoryData(sq,cs,cst)
      let responseData = response.data.data.history
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
        type:'normal'
      }]
      let newArray = allData.concat(categoryData)

      let dropDownData = {
        id: newArray.length -1,
        name:'Selesai_Dimasak',
        type:'dropdown',
        dataCy:'category-button-status',
        data:[
          {
            title:'Selesai_Dimasak',
            code:'done',
            dataCy:'category-button-status-done'
          },{
            title:'Dalam_Progress',
            code:'progress',
            dataCy:'category-button-status-progress'
          },
        ]
      }

      newArray.push(dropDownData)
      setCategoryFoodData(newArray)
    }catch(e){
      message.error('Error when fetching category data')
    }
  }

  const handleSearchRecipe =async() =>{
    setLoad(true)
    try{
      await getHistoryData('','','')
      setSuggestion([])
      setLoad(false)
    }catch(e){
      setLoad(true)
      return message.error('Error when fetching searched recipe')
    }
  }

  const handleClearQuery = () =>{
    setSuggestion([])
    setSearchQuery('')
    getHistoryData(' ','','',)
  }

  const handleClickSuggestion = (item) =>{
    navigate('/recipe/' +item.recipeId)
  }

  const renderSuggestionBox = () =>{
    if(suggestion.length > 0){
      return <div className={'suggestion-box'} data-cy={'search-suggestion-container'}>
        {suggestion.map((item,index) =>{
          return <div style={{padding: '0.5em', cursor:'pointer'}} data-cy={'search-suggestion-'+index}onClick={() =>handleClickSuggestion(item)}>
            <p style={{marginBottom:'0'}}>{item.recipeName}</p>
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
        <p data-cy={'header-text-title'} style={{marginLeft:'1em', fontSize:'26px', fontWeight:'bolder',fontFamily:'Poppins', margin:'auto 0'}}>Riwayat</p>
      </div>
      <Row style={{height:'100%'}}>
        <Col style={{margin:'auto'}}>
          <div>
            <Input style={{width:'80%'}} value={searchQuery} data-cy="header-button-search" onChange={(e) => handleInputSearch(e.target.value)}/>
            {searchQuery ? <img src={clear} data-cy='header-button-clear' style={{position: 'absolute',transform: 'translate(-25px, 3px)', cursor:'pointer'}} onClick={() =>handleClearQuery()}/> : ''}
            <Button style={{padding:'.3rem 1.2rem',marginBottom:'2px', backgroundColor:'#EF5734', border:'none'}} onClick={() => handleSearchRecipe()}  data-cy="header-button-history">Cari</Button>
            {renderSuggestionBox()}
          </div>
        </Col>
      </Row>
      <div style={{width:'100%', height:'35%'}}>
        {handleRenderCategoryButton()}
      </div>
    </div>
  }

  const handleNavigateRecipeDetailPage = (recipeId, nServe) =>{
    navigate(`/recipe/${recipeId}/${nServe}`)
  }

  const handleRenderCategoryButton = () =>{
    return <div className={'historypage-header-category-wrapper'}>
      {categoryFoodData.map((item,index) => { return renderCategoryButton(item, index)})}
    </div>
  }

  const handleModalClick = async(code, index, title) =>{
    try{
      await getHistoryData('','', code)
      categoryFoodData[index].name = title
      setShowModal(false)
    }catch(e){
      return message.error('Error sort data')
    }
  }

  const renderListButton = (data,index) =>{
    if(data && data.length > 0){
      return <Card style={{position:'absolute', transform:'translateY(10px)'}}>
        <Card.Body style={{padding:'.3rem 1rem'}}>
          {data.map(item => {
            return <p style={{cursor:'pointer', margin:'10px 0'}} data-cy={item.dataCy} onClick={() => handleModalClick(item.code,index, item.title)}>{item.title.split('_').join(' ')}</p>
          })}
        </Card.Body>
      </Card>
    }
  }

  const renderCategoryButton = (item, index) =>{
    if(item.type == 'dropdown'){
     return <div>
        <Button  className={'historypage-header-category-button'} onClick={() =>setShowModal(!showModal)} data-cy={"category-button-status"}>{item.name.split('_').join(' ')} ^</Button>
        <div>
          {showModal ? renderListButton(item.data,index) : ''}
        </div>
      </div>
    }
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

  const handleSortCategory =async(id) =>{
    setCurrentCategory(id)
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
    setLoad(true)
    try{
      await getHistoryData('',sortBy,'','')
      setCurrentSort(sortBy)
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
        code:'newest',
        dataCy:'button-sort-newest'
      },{
        name:'Terlama',
        code:'oldest',
        dataCy:'button-sort-oldest'
      },{
        name:'Porsi Terbanyak',
        code:'nserve_desc',
        dataCy:'button-sort-most'
      },{
        name:'Porsi Tersedikit',
        code:'nserve_asc',
        dataCy:'button-sort-least'
      },
    ]

    return sortButton.map(item => {return <Button className={renderStyleActiveSort(item.code)} data-cy={item.dataCy} style={{margin:'0 10px'}} onClick={() =>handleSort(item.code)}>
      {item.name}
    </Button>})
  }


  const handleInputSearch = async(query) =>{
    setSearchQuery(query)
    if(query.length > 1){
      let response = await getRecipeHistoryData(query,currentSort,currentStatus)
      let responseData = response.data.data.history
      setSuggestion(responseData)
      return
    }
    setSuggestion([])
  }

  const handleRenderContent = () =>{
    if(historyData && historyData.length > 0){
      return historyData.map((item,index) => {
        return <div style={{marginBottom: '1em'}}><FoodCard handleNavigateRecipeDetailPage = {(a,b) => handleNavigateRecipeDetailPage(a,b)} navigateToRatingDetail ={(a) =>navigateToRatingDetail(a) } navigateToCookDetail = {(a,b,c) => navigateToCookDetail(a,b,c)}index={index} recipe={item} type={'history'}/></div>
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
