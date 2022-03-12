import React, {useState, useEffect} from "react";
import {Card, Col, Row} from "react-bootstrap";
import goodRating from '../../assets/others/goodRating.png';
import midRating from '../../assets/others/midRating.png';
import badRating from '../../assets/others/badRating.png';


const FoodCard = (props) => {
  const {recipe,index} = props

  return (
    <div className={'card-component'} data-cy={'list-item-'+index}>
      <Card style={{ width: '264px', height:'333px', borderRadius:'6px' }}>
        <Card.Img style={{width:'100%', height:'182px'}}variant="top" src={recipe.image} />
        <Card.Body>
          <Card.Title style={{fontSize:'18px',lineHeight:'27px', fontFamily:'Poppins'}}>{recipe.name}</Card.Title>
          <Card.Text style={{fontSize:'14px', color:'#828282', fontFamily:'Poppins',fontWeight:'400',font:'Poppins'}}>
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
  );
}

export default FoodCard;
