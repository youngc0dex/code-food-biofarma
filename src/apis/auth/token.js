export class TokenService {
  static setToken(key,token){
    TokenService.token = token;
    localStorage.setItem(key,token)
  }
  static getToken(){
    if(localStorage.getItem('Food-Token')){
      return localStorage.getItem('Food-Token');
    }

    if(sessionStorage.getItem('Food-Token'))
    {
      return sessionStorage.getItem('Food-Token');
    }

    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDcxOTUxMDgsInN1YiI6IjEifQ.SJmSoECYWYyGkD4F6O2PjTskk2TlZLcj2gStt8_2ivA'
  }
  static getheader(){
    let headers = {
      Authorization: `Bearer ${this.getToken()}`,
    }
    return headers;
  }
}
export default TokenService;