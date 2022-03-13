import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './RecipePage.scss'
import {Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import {message} from 'antd'
import HeaderLogo from '../../assets/logo/header-logo.png'
import HistoryPNG from '../../assets/others/historyPNG.png'
import Increase from '../../assets/others/increase-portion.png'
import Decrease from '../../assets/others/decrease-portion.png'
import clear from '../../assets/others/x-button.png'
import {Input} from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import {
  getCategoryFood,
  getFilteredRecipes, getRecipeDetail,
  getRecipes,
  getSearchedRecipe, getSearchedRecipeByCateogry,
} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";


const RecipePage = (props) => {
  const [foodData, setFoodData] = useState([])
  const [masterFoodData, setMasterFoodData] = useState([])
  const [categoryFoodData, setCategoryFoodData] = useState([])
  const [load, setLoad] = useState(false)
  const [currentSort, setCurrentSort] = useState('new')
  const [currentCategory, setCurrentCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestion, setSuggestion] = useState([])
  const [recipeDetail, setRecipeDetail] = useState('')
  const [qty,setQty] = useState(1)
  let params = useParams()
  const recipeId = params.id
  let navigate = useNavigate()

  useEffect(() => {
    getFoodData()
    getCategoryFoodData()
    getDetailRecipeData()
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

  const getDetailRecipeData = async() =>{
    try{
      let response = await getRecipeDetail(recipeId)
      let responseData = response.data.data
      setRecipeDetail(responseData)
    }catch(e){
      message.error('Error when fetching recipe data')
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

  const handleClearQuery = () =>{
    setSearchQuery('')
    setSuggestion([])
    getFoodData()
  }

  const redirectBack = () =>{
    navigate('/')
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
    return <div className={'recipepage-header-wrapper'}>
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
              : ''}<Button style={{padding:'.3rem 1.2rem',marginBottom:'2px', backgroundColor:'#EF5734', border:'none'}} onClick={() => handleSearchRecipe()}  data-cy="form-button-submit-portion">Cari</Button>
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
    return <div className={'recipepage-header-category-wrapper'}>
      {categoryFoodData.map((item,index) => { return renderCategoryButton(item, index)})}
    </div>
  }

  const renderCategoryButton = (item, index) =>{
    return <div className={'recipepage-header-category'}>
      <Button data-cy={"category-button-"+index} className={'recipepage-header-category-button ' + renderStyleActiveCategoryButton(item.id)} onClick={() => handleSortCategory(item.id)}>{item.name}</Button>
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

  const handleRenderContent = () =>{
    return <Row>
      <Col >
        <FoodCard redirectBack ={() => redirectBack()} type={'detail'} recipe={recipeDetail}/>
      </Col>
      <Col md={'auto'}>
        {renderQtyCard()}
      </Col>

    </Row>
  }

  const handleIncDecBtn = (type) =>{
    if(type == 'dec'){
      setQty(qty-1)
      return
    }
    setQty(qty+1)
  }

  const renderFormFailed = () =>{
    if(qty < 1){
      return <div data-cy='form-alert-container' style={{width:'350px',marginTop:'1em',display:'flex', justifyContent:'space-between', backgroundColor:'black',padding:'1em'}}>
          <p data-cy="one-line" style={{fontSize:'16px', color:'white', marginBottom:'0'}}>Jumlah porsi minimal adalah 1</p>
          <p style={{fontSize:'16px', color:'#BB86FC',marginBottom:'0', cursor:'pointer'}} data-cy="with-button" onClick={()=>setQty(1)}>OK</p>
        </div>

    }
  }

  const renderQtyCard = () =>{
    return <div style={{margin:'0 auto'}}>
      <Card style={{width:'350px'}} data-cy={'form-portion'}>
        <Card.Body>
          <Card.Title style={{fontSize:'18px',fontWeight:'bold',lineHeight:'27px', fontFamily:'Poppins', marginBottom:'2em'}} data-cy='list-item-text-title'>Jumlah porsi yang dimasak</Card.Title>
          <Row>
            <Col s={'auto'} xs={'auto'} md={'auto'}>
              <div>
                <img src={Decrease} style={{width:'22px', height:'22px', cursor:'pointer'}} data-cy={'form-button-decrease-portion akar-icons:circle-minus'} onClick={() =>handleIncDecBtn('dec')}/>
              </div>
            </Col>

            <Col>
              <div>
                <Input type={'number'} disabled={qty < 1} value={qty} data-cy={'form-input-portion'} onChange={(e) => setQty(e.target.value)}/>
              </div>
            </Col>

            <Col s={'auto'} xs={'auto'} md={'auto'}>
              <div>
                <img src={Increase} style={{width:'22px', height:'22px', cursor:'pointer'}} data-cy={'form-button-increase-portion akar-icons:circle-plus-fill'} onClick={() =>handleIncDecBtn('inc')}/>
              </div>
            </Col>
          </Row>

          <div style={{width:'100%', marginTop:'2em'}}>
            <button className={'start-cooking-button'} data-cy={'form-button-submit-portion'} onClick={() => navigateToCookPage()}>Mulai Memasak</button>
          </div>

        </Card.Body>
      </Card>
      <div>
        {renderFormFailed()}
      </div>
    </div>
  }

  const navigateToCookPage = () =>{
    navigate('/cook/'+recipeId)
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
    <div className={'recipepage'}>
      <div className={'recipepage-header'}>
        {renderHeader()}
      </div>
      <div style={{backgroundColor:'#E5E5E5'}}>
        <div className={'recipepage-body'}>
          {load ? renderSpinner() : <div className={'recipepage-body-cards'}>
            {handleRenderContent()}
          </div>}
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
