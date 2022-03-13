import React, {useState, useEffect} from "react";
import {Card, Col, Row} from "react-bootstrap";
import goodRating from '../../assets/others/goodRating.png';
import midRating from '../../assets/others/midRating.png';
import badRating from '../../assets/others/badRating.png';
import Back from '../../assets/others/back-button.png'



const FoodCard = (props) => {
  const {recipe,index,type, handleNavigateToRecipeDetail, redirectBack} = props

  const handleRenderCard =() =>{
    if(type == 'list'){
      return handleRenderListCard()
    }

    if(type == 'detail'){
      return handleRenderDetailCard()
    }
  }

  const handleRenderIngredients = () =>{
    if(recipe.ingredientsPerServing && recipe.ingredientsPerServing.length > 0){
      return recipe.ingredientsPerServing.map(item => {
        return <p><span style={{fontWeight:'bold', fontFamily:'Poppins'}} data-cy={'detail-text-recipe'}>{item.value} {item.unit}</span> {item.item}</p>
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
    return <div className={'card-component'} data-cy={'list-item-'+index}>
      <Card style={{borderRadius:'6px' }}>
        <div style={{position:'absolute', transform:'translate(10px,10px)'}}>
          <button data-cy='button-back' onClick={() =>redirectBack()} style={{border:'none', backgroundColor:'transparent'}}><img style={{width:'30px'}} src={Back}/></button>
        </div>
        <Card.Img style={{width:'100%', height:'439px'}}variant="top" src={recipe.image} data-cy={'detail-image'}/>

        <Card.Body>
          <Card.Title style={{fontSize:'18px',lineHeight:'27px', fontFamily:'Poppins'}} data-cy='detail-tect-title'>{recipe.name}</Card.Title>
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

  return (
    <div>
      {handleRenderCard()}
    </div>
  );
}

export default FoodCard;
