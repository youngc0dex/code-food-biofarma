import React, {useState, useEffect} from "react";
import {Card, Col, Row} from "react-bootstrap";
import goodRating from '../../assets/others/goodRating.png';
import midRating from '../../assets/others/midRating.png';
import badRating from '../../assets/others/badRating.png';
import Back from '../../assets/others/back-button.png'
import LikeImage from '../../assets/others/RateLike.png'
import LikeImageChosen from '../../assets/others/ratingLikeChosen.png'
import NeutralImage from '../../assets/others/RatingNeutral.png'
import SadImage from '../../assets/others/RatingSad.png'
import Moment from "react-moment";



const FoodCard = (props) => {
  const {recipe,index,type, handleNavigateToRecipeDetail, redirectBack,navigateToRatingDetail, navigateToCookDetail} = props


  const handleRenderCard =() =>{
    if(type == 'list'){
      return handleRenderListCard()
    }

    if(type == 'detail'){
      return handleRenderDetailCard()
    }

    if(type =='cook'){
      return handleRenderCookCard()
    }

    if(type =='history'){
      return handleRenderHistoryCard()
    }
  }

  const handleRenderIngredients = () =>{
    if(recipe.ingredientsPerServing && recipe.ingredientsPerServing.length > 0){
      return recipe.ingredientsPerServing.map(item => {
        return <p data-cy={'detail-text-recipe'}><span style={{fontWeight:'bold', fontFamily:'Poppins'}}>{item.value} {item.unit}</span> {item.item}</p>
      })
    }
    return <h5>Tidak ada cara memasak untuk resep ini</h5>
  }

  const handleRenderListCard= () =>{
    return <div className={'card-component'} style={{cursor:'pointer'}} onClick={() => handleNavigateToRecipeDetail(recipe.id)} data-cy={'list-item-'+index}>
      <Card style={{ width: '264px', height:'333px', borderRadius:'6px' }}>
        <Card.Img style={{width:'100%', height:'182px'}}variant="top" src={recipe.image} data-cy={'list-item-image'}/>
        <Card.Body>
          <Card.Title style={{fontSize:'18px',lineHeight:'27px', fontFamily:'Poppins'}} data-cy='list-item-text-title'>{recipe.name}</Card.Title>
          <Card.Text style={{fontSize:'14px', color:'#828282', fontFamily:'Poppins',fontWeight:'400',font:'Poppins'}} data-cy={'list-item-text-category'}>
            {recipe.recipeCategory.name}
          </Card.Text>
          <Row>
            <Col>
              <div style={{display:'flex', alignItems:'center',padding:'2px',borderRadius: '9px',border: '1px solid #EAEAEA', width:'54px'}} data-cy={'list-item-like'}>
                <img src={goodRating} style={{width:'16px', height:'16px'}}/>
                <p  style={{fontSize:'12px',width:'100%',textAlign:'center', marginBottom:'0',lineHeight:'18px',fontWeight:'400', color:'#828282',fontFamily:'Poppins'}}>{recipe.nReactionLike}</p>
              </div>
            </Col>


            <Col>
              <div style={{display:'flex', alignItems:'center',padding:'2px',borderRadius: '9px',border: '1px solid #EAEAEA', width:'54px'}} data-cy={'list-item-neutral'}>
                <img src={midRating} style={{width:'16px', height:'16px'}}/>
                <p  style={{fontSize:'12px',width:'100%',textAlign:'center', marginBottom:'0',lineHeight:'18px',fontWeight:'400', color:'#828282',fontFamily:'Poppins'}}>{recipe.nReactionNeutral}</p>
              </div>
            </Col>

            <Col>
              <div style={{display:'flex', alignItems:'center',padding:'2px',borderRadius: '9px',border: '1px solid #EAEAEA', width:'54px'}} data-cy={'list-item-dislike'}>
                <img src={badRating} style={{width:'16px', height:'16px'}}/>
                <p  style={{fontSize:'12px',width:'100%', textAlign:'center',marginBottom:'0',lineHeight:'18px',fontWeight:'400', color:'#828282',fontFamily:'Poppins'}}>{recipe.nReactionDislike}</p>
              </div>
            </Col>
          </Row>


        </Card.Body>
      </Card>
    </div>
  }

  const handleRenderDetailCard = () =>{
    return <div className={'card-component'}>
      <Card style={{borderRadius:'6px' }}>
        <div style={{position:'absolute', transform:'translate(10px,10px)'}}>
          <button data-cy='button-back' onClick={() =>redirectBack()} style={{border:'none', backgroundColor:'transparent'}}><img style={{width:'30px'}} src={Back}/></button>
        </div>
        <Card.Img style={{width:'100%', height:'439px'}}variant="top" src={recipe.image} data-cy={'detail-image'}/>

        <Card.Body>
          <Card.Title style={{fontSize:'18px',lineHeight:'27px', fontFamily:'Poppins'}} data-cy='text-title'>{recipe.name}</Card.Title>
          <div style={{display:'flex', flexWrap:'wrap'}}>
              <div style={{display:'flex', alignItems:'center',padding:'2px',borderRadius: '9px',border: '1px solid #EAEAEA', width:'54px'}} data-cy={'detail-like'}>
                <img src={goodRating} style={{width:'16px', height:'16px'}}/>
                <p  style={{fontSize:'12px',width:'100%',textAlign:'center', marginBottom:'0',lineHeight:'18px',fontWeight:'400', color:'#828282',fontFamily:'Poppins'}} data-cy={'detail-like-value'}>{recipe.nReactionLike}</p>
              </div>


              <div style={{display:'flex', alignItems:'center',padding:'2px',margin:'0 1em',borderRadius: '9px',border: '1px solid #EAEAEA', width:'54px'}} data-cy={'detail-neutral'}>
                <img src={midRating} style={{width:'16px', height:'16px'}}/>
                <p  style={{fontSize:'12px',width:'100%',textAlign:'center', marginBottom:'0',lineHeight:'18px',fontWeight:'400', color:'#828282',fontFamily:'Poppins'}}>{recipe.nReactionNeutral}</p>
              </div>

              <div style={{display:'flex', alignItems:'center',padding:'2px',borderRadius: '9px',border: '1px solid #EAEAEA', width:'54px'}} data-cy={'detail-dislike'}>
                <img src={badRating} style={{width:'16px', height:'16px'}}/>
                <p  style={{fontSize:'12px',width:'100%', textAlign:'center',marginBottom:'0',lineHeight:'18px',fontWeight:'400', color:'#828282',fontFamily:'Poppins'}}>{recipe.nReactionDislike}</p>
              </div>
          </div>
          <hr/>

          <div>
            <h3 style={{fontFamily:'Poppins', fontWeight:'600', fontSize:'20px'}} data-cy={'detail-text-ingredients'}>Bahan-Bahan:</h3>
            {handleRenderIngredients()}
          </div>
        </Card.Body>
      </Card>
    </div>
  }

  const handleRenderCookCard = () =>{
    return <div className={'card-component'} style={{cursor:'pointer'}} >
      <Card style={{ width: '264px', height:'333px', borderRadius:'6px' }}>
        <Card.Body>
          <Card.Title style={{fontSize:'18px',lineHeight:'27px', fontFamily:'Poppins'}} >Step 1</Card.Title>
          <Card.Text style={{fontSize:'14px', color:'#828282', fontFamily:'Poppins',fontWeight:'400',font:'Poppins'}} >
            Step 2
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  }

  const handleRenderHistoryCard = () =>{
    return <Card style={{height:'245px', borderRadius:'6px' }} data-cy={'history-item-'+index}>
      <Card.Body>
        <Card.Title style={{fontSize:'12px',lineHeight:'27px', fontFamily:'Poppins'}} >
          <Moment format="DD MMMM YYYY" data-cy={'history-item-text-date'}>
          {recipe.createdAt}
          </Moment>
        </Card.Title>
        <Card.Text>
          <div style={{display:'flex', width:'100%'}}>
            <div>
              <img data-cy={'history-item-image'} style={{width:'111px', height:'111px', objectFit:'cover',  borderRadius:'6px'}} src={recipe.recipeImage}/>
            </div>

            <div style={{width:'100%',margin:'0 1em'}}>
              <p style={{fontWeight:'bold', fontFamily:'Poppins'}} data-cy={'history-item-text-title'}>{recipe.recipeName}</p>
              <p style={{color:'#898989',fontFamily:'Poppins'}} data-cy={'history-item-text-code'}>{recipe.id}</p>

              <div style={{justifyContent:'space-between', display:'flex'}}>
                <p style={{color:'#898989',fontFamily:'Poppins'}} data-cy={'history-item-text-category'}>{recipe.recipeCategoryName}</p>
                <p data-cy={'history-item-text-portion'}>Porsi: <span style={{fontWeight:'bold'}}>{recipe.nServing}</span></p>
              </div>
            </div>
          </div>
        </Card.Text>
        <hr/>
        <Card.Text>
          <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
            <div>
              {handleRenderReaction(recipe.reaction)}
            </div>

            <div>
              {handleRenderPercentation(recipe.nStep,recipe.nStepDone)}
            </div>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  }

  const handleRenderReaction = (reaction) =>{
    if(reaction == 'like'){
      return <div style={{display:'flex'}} >
        <img src={LikeImageChosen} style={{width:'30px',height:'30px',cursor:'pointer'}}/>
        <p style={{color:'green'}} data-cy={'history-item-text-rating'}>Yummy!</p>
      </div>
    }

    if(reaction == 'neutral'){
      return <div style={{display:'flex'}}>
        <img src={NeutralImage} style={{width:'30px',height:'30px',cursor:'pointer'}}/>
        <p style={{color:'green'}} data-cy={'history-item-text-rating'}>Lumayan</p>
      </div>
    }

    if(reaction == 'dislike'){
      return <div style={{display:'flex'}}>
        <img src={SadImage} style={{width:'30px',height:'30px',cursor:'pointer'}}/>
        <p style={{color:'green'}} data-cy={'history-item-text-rating'}>Kurang Suka</p>
      </div>
    }

    return <p style={{fontFamily:'Poppins',cursor:'pointer'}} onClick={() => navigateToRatingDetail(recipe.id)} data-cy={'history-item-text-rating'}>Belum ada penilaian</p>
  }

  const handleRenderPercentation = (stepOfServe, currentServe) =>{
    let percentage = (currentServe / stepOfServe) * 100
    if(percentage == 100){
      return <p data-cy={'history-item-button-status'} style={{fontFamily:'Poppins', color:'red'}}>Selesai ({Math.ceil(percentage)}%)</p>
    }
    return <p onClick={() =>navigateToCookDetail(recipe.recipeId,recipe.nServing,recipe.id)} data-cy={'history-item-button-status'} style={{cursor:'pointer',fontFamily:'Poppins', color:'Orange'}}>Dalam Proses ({Math.ceil(percentage)}%)</p>
  }

  return (
    <div>
      {handleRenderCard()}
    </div>
  );
}

export default FoodCard;
