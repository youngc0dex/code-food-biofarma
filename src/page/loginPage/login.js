import React, {useState} from "react";
import { Layout } from 'antd';
import { Row, Col, Form , Button} from 'react-bootstrap';
import { Card } from 'antd';
import './login.scss'
import HeaderLogo from '../../assets/logo/header-logo.png'
import ContentLogo from '../../assets/logo/content-logo.png'

const { Header, Footer, Sider, Content } = Layout;



const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const renderLogo = () =>{
    return <div>
      <img data-cy="header-logo" src={HeaderLogo}/>
    </div>
  }

  const renderContent = () =>{
    return <Row >
      <Col md={6} lg={6}>
        <div className={'logo-wrapper'}>
          <img data-cy="content-logo" src={ContentLogo} className={'logo-image'}></img>
        </div>
      </Col>

      <Col md={6} lg={6}>
        <Card className={'card-settings'}>
          <div className={'card-content'}>
            <p data-cy={'form-text-title'} className={'card-login-header'}>Login</p>
          </div>

          <div className={'card-content-form'}>
            <Form>
              <Form.Group data-cy='form-text-email' className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control data-cy='form-input-email' type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group data-cy='form-text-password' className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control data-cy='form-input-password' type="password" placeholder="Password" />
              </Form.Group>


              <Button className="mt-5" style={{width:'100%'}} data-cy='form-button-login'>
                Login
              </Button>
            </Form>
          </div>

          <div>
            <p className={'card-login-skip-text'} data-cy='form-button-skip'>Lewati Login</p>
          </div>
        </Card>
      </Col>
    </Row>
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
