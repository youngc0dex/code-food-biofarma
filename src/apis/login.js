import axios from 'axios';
import { API_BASE_URL } from '../constants/defaultValues';

export const loginUser = (payload) =>{
  return axios.post(API_BASE_URL + '/auth/login', payload).then(response => {return response.data}).catch((e) =>{
    return e.response.data
  })
}