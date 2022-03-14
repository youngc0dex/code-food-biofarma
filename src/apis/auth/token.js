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

    return ''
  }
  static getheader(){
    let headers = {
      Authorization: `Bearer ${this.getToken()}`,
    }
    return headers;
  }
}
export default TokenService;