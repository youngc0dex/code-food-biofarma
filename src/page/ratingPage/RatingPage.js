import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import './RatingPage.scss'
import {Button, Col, Card, Row, Spinner} from "react-bootstrap";
import {message} from 'antd'
import HeaderLogo from '../../assets/logo/header-logo.png'
import HistoryPNG from '../../assets/others/historyPNG.png'
import empty from '../../assets/others/empty.png'
import clear from '../../assets/others/x-button.png'
import RatingImage from '../../assets/others/image-rate.png'
import LikeImage from '../../assets/others/RateLike.png'
import LikeImageChosen from '../../assets/others/ratingLikeChosen.png'
import NeutralImage from '../../assets/others/RatingNeutral.png'
import SadImage from '../../assets/others/RatingSad.png'
import ThanksImage from '../../assets/others/image-thanks.png'


import {Input} from "antd";
import { useNavigate,useParams } from 'react-router-dom';
import {
  getCategoryFood,
  getFilteredRecipes,
  getRecipes,
  getSearchedRecipe, getSearchedRecipeByCateogry,
  getSortedRecipeDataBySortName, sendCookReaction
} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";

const RatingPage = (props) => {
  const [foodData, setFoodData] = useState([])
  const [masterFoodData, setMasterFoodData] = useState([])
  const [categoryFoodData, setCategoryFoodData] = useState([])
  const [load, setLoad] = useState(false)
  const [currentSort, setCurrentSort] = useState('new')
  const [currentCategory, setCurrentCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestion, setSuggestion] = useState([])
  const [currentRating, setCurrentRating] = useState('')
  let navigate = useNavigate()
  const id = useParams().id
  const [isRated, setIsRated] = useState(false)

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

  const handleClearQuery = () =>{
    setSearchQuery('')
    setSuggestion([])
    getFoodData()
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
    return <div className={'ratingpage-header-wrapper'}>
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
    return <div className={'ratingpage-header-category-wrapper'}>
      {categoryFoodData.map((item,index) => { return renderCategoryButton(item, index)})}
    </div>
  }

  const renderCategoryButton = (item, index) =>{
    return <div className={'ratingpage-header-category'}>
      <Button data-cy={"category-button-"+index} className={'ratingpage-header-category-button ' + renderStyleActiveCategoryButton(item.id)} onClick={() => handleSortCategory(item.id)}>{item.name}</Button>
    </div>
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


  const handleRate = async() =>{
    try{
      let payload = {
        reaction:currentRating
      }
      await sendCookReaction(id, payload)
      setIsRated(true)
    }catch(e){
      return message.error('Error when sending reaction')
    }
  }

  const renderNotRated = () =>{
    return <div>
      <Card.Title>
        <div style={{textAlign:'center'}}>
          <h4 style={{fontFamily:'Poppins', fontWeight:'bold'}} data-cy={'text-title'}>Yaay! Masakanmu sudah siap disajikan</h4>
        </div>
      </Card.Title>
      <Card.Body>
        <div style={{textAlign:'center'}}>
          <img style={{marginBottom:'2em'}} src={RatingImage} data-cy={'image-rate'}/>
          <p style={{fontFamily:'Poppins', fontWeight:'500', marginBottom:'0'}}>Suka dengan resep dari CodeFood?</p>
          <p style={{fontFamily:'Poppins', fontWeight:'500', marginBottom:'0'}}>Bagaimana rasanya?</p>

        </div>

        <div style={{margin:'5em 0'}}>
          <Row>
            <Col style={{textAlign:'center'}}>
              <img data-cy={'button-like'} src={currentRating =='like' ? LikeImageChosen : LikeImage} style={{cursor:'pointer'}} onClick={() => setCurrentRating('like')}/>
              <p>Yummy!</p>
            </Col>

            <Col style={{textAlign:'center'}}>
              <img data-cy={'button-neutral'} src={NeutralImage} style={{cursor:'pointer'}} onClick={() => setCurrentRating('neutral')}/>
              <p>Lumayan</p>
            </Col>

            <Col style={{textAlign:'center'}}>
              <img src={SadImage} data-cy={'button-dislike'} style={{cursor:'pointer'}} onClick={() => setCurrentRating('dislike')}/>
              <p>Kurang Suka</p>
            </Col>
          </Row>
        </div>

        <div style={{textAlign:'center'}}>
          <Button data-cy={'button-rate'} onClick={() => handleRate()} disabled={!currentRating} style={{backgroundColor:'#EF5734', color:'white', border:'none', width:'50%', padding:'1em 0', fontWeight:'500', fontFamily:'Poppins'}}>
            Berikan Penilaian
          </Button>
        </div>

      </Card.Body>
    </div>
  }

  const renderRated = () =>{
    return <div>
      <Card.Body>
        <div style={{textAlign:'center', margin:'3em 0'}}>
          <img style={{marginBottom:'2em'}} src={ThanksImage} data-cy={'image-thanks'}/>
          <p data-cy={'text-description'} style={{fontFamily:'Poppins', fontWeight:'500', marginBottom:'0'}}>Terimakasih telah memberikan penilaianmu!</p>
        </div>

        <div style={{textAlign:'center'}}>
          <Button data-cy={'button-home'} onClick={() => navigate('/')} style={{backgroundColor:'#EF5734', color:'white', border:'none', width:'50%', padding:'1em 0', fontWeight:'500', fontFamily:'Poppins'}}>
            Kembali ke beranda
          </Button>
        </div>

      </Card.Body>
    </div>
  }

  const handleRenderContent = () =>{
    return <Card style={{padding:'2em'}}>
      {isRated ? renderRated() : renderNotRated()}
    </Card>
  }


  return (
    <div className={'ratingpage'}>
      <div className={'ratingpage-header'}>
        {renderHeader()}
      </div>
      <div style={{backgroundColor:'#E5E5E5'}}>
        <div className={'ratingpage-body'}>
          {handleRenderContent()}
        </div>
      </div>
    </div>
  );
}

export default RatingPage;
