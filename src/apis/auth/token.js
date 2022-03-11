export class TokenService {
  static setToken(key,token){
    TokenService.token = token;
    localStorage.setItem(key,token)
  }
  static getToken(){
    return localStorage.getItem("Food-Token") || "";
  }
  static getheader(){
    let headers = {
      Token: this.getToken()
    }
    return headers;
  }
}
export default TokenService;