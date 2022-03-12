import React, {useState} from "react";
import { Layout } from 'antd';
import { Row, Col, Form , Button} from 'react-bootstrap';
import { Card } from 'antd';
import './login.scss'
import HeaderLogo from '../../assets/logo/header-logo.png'
import ContentLogo from '../../assets/logo/content-logo.png'
import { Formik } from 'formik';
import * as yup from 'yup';
import {loginUser } from "../../apis/login";
import TokenService from './../../apis/auth/token';
import { useNavigate } from 'react-router-dom';




const { Header, Footer, Sider, Content } = Layout;

const Login = () => {
  const [invalidData, setInvalidData] = useState(false)
  const [invalidEmailCount, setInvalidEmailCount] = useState([])
  const [invalidCountWarning, setInvalidCountWarning] = useState(false)
  const [isStillCantLogin, setIsStillCantLogin] = useState(false)
  let navigate = useNavigate()


  const schema = yup.object().shape({
    email: yup.string().email('Format Email tidak sesuai').required('Required'),
    password: yup.string().min(6, 'Password Minimal 6 Karakter').required('Required'),
  });


  const isButtonDisabled = (values) =>{
    if(!values.email || !values.password){
      return true
    }
    return false
  }

  const renderLogo = () =>{
    return <div>
      <img data-cy="header-logo" src={HeaderLogo} onClick={() => navigate('/')} style={{cursor:'pointer'}}/>
    </div>
  }

  const stillCantLogin = (email) =>{
   let findIndex = invalidEmailCount.findIndex(item => item.email == email)
    if(findIndex > -1){
      if(invalidEmailCount[findIndex].cantLogin){
        setIsStillCantLogin(true)
        setInvalidData(false)
        setInvalidCountWarning(false)
        return false
      }
    }
    return true
  }


  const handleSubmit = async(values,isValid) =>{
    if(!isValid) {
      return
    }
    if(!stillCantLogin(values.email)){
      return
    }

    let payload = {
      username: values.email,
      password: values.password
    }

    try{
      let response = await loginUser(payload)
      saveIntoLocalStorage(response.data, payload)

      setIsStillCantLogin(false)
      setInvalidData(false)
      setInvalidCountWarning(false)
      navigate('/')
    }catch(e){
      setIsStillCantLogin(false)
      setInvalidData(true)
      putIntoEmailInvalidCount(values.email)
    }
  }

  const saveIntoLocalStorage = (data, userData) =>{
    const token = data.data.token;
    const obj = {
      userEmail: userData.username,
    };
    const encryptedData = window.btoa(JSON.stringify(obj));
    localStorage.setItem('foodUserData', encryptedData);
    TokenService.setToken('Food-Token', token);
  }

  const putIntoEmailInvalidCount = (email) =>{
    let invalidEmailCountData = [...invalidEmailCount]
    let findIndex = invalidEmailCountData.findIndex(item => item.email == email);

    if(findIndex > -1 ){
      let invalidCountForCurrentIndex = invalidEmailCountData[findIndex].invalidCount
      if(invalidCountForCurrentIndex == 3){
        setInvalidData(false)
        setInvalidCountWarning(true)
        if(!invalidEmailCountData[findIndex].cantLogin){
          blockCurrentEmail(findIndex,email)
        }
        return
      }
      invalidEmailCountData[findIndex].invalidCount += 1
      setInvalidCountWarning(false)
      return
    }

    let newData = {
      email:email,
      invalidCount:1,
      cantLogin:false
    }

    invalidEmailCountData.push(newData)
    setInvalidEmailCount(invalidEmailCountData)
    setInvalidCountWarning(false)
  }

  const blockCurrentEmail =(index, email) =>{
    invalidEmailCount[index].cantLogin = true
    setTimeout(() =>{
      let findIndex = invalidEmailCount.findIndex(item => item.email == email)
      if(findIndex > -1){
        invalidEmailCount[findIndex].invalidCount = 0
        invalidEmailCount[findIndex].cantLogin = false
      }
    }, 60000)
  }

  const handleSkipLogin = () =>{
    navigate('/')
  }

  const renderContent = () =>{
    return <Formik
      validationSchema={schema}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
        }) => (
        <Form onSubmit={handleSubmit}>
          <Row >
            <Col md={6} lg={6}>
              <div className={'logo-wrapper'}>
                <img data-cy="content-logo" src={ContentLogo} className={'logo-image'}></img>
              </div>
            </Col>

            <Col md={6} lg={6}>
              <Card className={'card-settings'}>
                <div style={{display: isStillCantLogin ? 'block' : 'none'}}>
                  <div style={{display:'flex', justifyContent:'space-between', backgroundColor:'black',padding:'1em'}}>
                    <p style={{fontSize:'16px', color:'white', marginBottom:'0'}}>Terlalu banyak percobaan, coba kembali setelah 1 menit</p>
                  </div>
                </div>
                <div style={{display: invalidCountWarning ? 'block' : 'none'}}>
                  <div style={{display:'flex', justifyContent:'space-between', backgroundColor:'black',padding:'1em'}}>
                    <p style={{fontSize:'16px', color:'white', marginBottom:'0'}}>Terlalu banyak percobaan, pastikan data Email dan Password anda benar.</p>
                  </div>
                </div>

                <div style={{display: invalidData ? 'block' : 'none'}}>
                  <div data-cy='form-alert-container' style={{display:'flex', justifyContent:'space-between', backgroundColor:'black',padding:'1em'}}>
                    <p style={{fontSize:'16px', color:'white', marginBottom:'0'}}>Email / Password anda salah</p>
                    <p style={{fontSize:'16px', color:'#BB86FC',marginBottom:'0', cursor:'pointer'}} data-cy="form-alert-button-ok" onClick={() => setInvalidData(false)}>OK</p>
                  </div>
                </div>
                <div className={'card-content'}>
                  <p data-cy={'form-text-title'} className={'card-login-header'}>Login</p>
                </div>

                <div className={'card-content-form'}>
                  <Form>
                    <Form.Group data-cy='form-text-email' className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control data-cy='form-input-email'
                                    type="email"
                                    placeholder="Enter email"
                                    name='email'
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                      />
                      {errors.email && touched.email ? <div style={{color:'red'}}>{errors.email}</div> : null}
                    </Form.Group>

                    <Form.Group data-cy='form-text-password' className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control data-cy='form-input-password'
                                    type="password"
                                    placeholder="Password"
                                    name='password'
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                      />
                      {errors.password && touched.password ? <div style={{color:'red'}}>{errors.password}</div> : null}
                    </Form.Group>


                    <div className={'card-login-btn'}>
                      <Button className="mt-5" onClick={()=>handleSubmit(values,isValid)} style={{width:'100%'}} data-cy='form-button-login' disabled={isButtonDisabled(values)}>
                        Login
                      </Button>
                    </div>

                  </Form>
                </div>

                <div>
                  <p className={'card-login-skip-text'} data-cy='form-button-skip' style={{cursor:'pointer'}} onClick={() => handleSkipLogin()}>Lewati Login</p>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  }

  return (
    <div style={{overflow:'hidden'}}>
      <Layout className={'login'}>
        <Header className={'login-header'}>
          {renderLogo()}
        </Header>
        <Content className={'login-content'}>
          {renderContent()}
        </Content>
        <Footer className={'login-footer'}></Footer>
      </Layout>
    </div>
  );
}

export default Login;
