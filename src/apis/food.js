import axios from 'axios';
import { API_BASE_URL } from '../constants/defaultValues';

export const getRecipes = () =>{
  return axios.get(API_BASE_URL + '/recipes')
}