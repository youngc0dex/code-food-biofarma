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
import NeutralChosen from '../../assets/others/NeutralChosen.png'
import SadImage from '../../assets/others/RatingSad.png'
import BadChosen from '../../assets/others/BadChosen.png'
import ThanksImage from '../../assets/others/image-thanks.png'


import {Input} from "antd";
import { useNavigate,useParams } from 'react-router-dom';
import {
  getRecipes, getSearchedRecipes,
  sendCookReaction
} from "../../apis/food";
import FoodCard from "../../component/card/FoodCard";
import TokenService from "../../apis/auth/token";

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
  }, []);


  const getFoodData = async(query,categoryId,sortBy) =>{
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
    navigate('/'+searchQuery)
  }


  const handleClearQuery = () =>{
    setSearchQuery('')
    setSuggestion([])
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
    </div>
  }

  const handleInputSearch = async(query) =>{
    setSearchQuery(query)
    if(query.length > 1){
      let response = await getSearchedRecipes(query)
      let responseData = response.data.data.recipes
      setSuggestion(responseData)
      return
    }
    setSuggestion([])
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
              <img data-cy={'button-like'} src={currentRating =='like' ? LikeImageChosen : LikeImage} style={{cursor:'pointer', width:'88px', height:'88px'}} onClick={() => setCurrentRating('like')}/>
              <p>Yummy!</p>
            </Col>

            <Col style={{textAlign:'center'}}>
              <img data-cy={'button-neutral'} src={currentRating == 'neutral' ? NeutralChosen : NeutralImage} style={{cursor:'pointer', width:'88px', height:'88px'}} onClick={() => setCurrentRating('neutral')}/>
              <p>Lumayan</p>
            </Col>

            <Col style={{textAlign:'center'}}>
              <img src={currentRating =='dislike' ? BadChosen : SadImage} data-cy={'button-dislike'} style={{cursor:'pointer', width:'88px', height:'88px'}} onClick={() => setCurrentRating('dislike')}/>
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

  const navigateToHome = () =>{
    let token = TokenService.getToken();
    localStorage.setItem('Food-Token', token)
    sessionStorage.setItem('Food-Token', token)
    setTimeout(() =>{
      navigate('/')
    },1000)
  }

  const renderRated = () =>{
    return <div>
      <Card.Body>
        <div style={{textAlign:'center', margin:'3em 0'}}>
          <img style={{marginBottom:'2em'}} src={ThanksImage} data-cy={'image-thanks'}/>
          <p data-cy={'text-description'} style={{fontFamily:'Poppins', fontWeight:'500', marginBottom:'0'}}>Terimakasih telah memberikan penilaianmu!</p>
        </div>

        <div style={{textAlign:'center'}}>
          <Button data-cy={'button-home'} onClick={() => navigateToHome()} style={{backgroundColor:'#EF5734', color:'white', border:'none', width:'50%', padding:'1em 0', fontWeight:'500', fontFamily:'Poppins'}}>
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
