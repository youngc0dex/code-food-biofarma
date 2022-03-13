import axios from 'axios';
import { API_BASE_URL } from '../constants/defaultValues';

export const getRecipes = () =>{
  return axios.get(API_BASE_URL + '/recipes')
}

export const getCategoryFood = () =>{
  return axios.get(API_BASE_URL + '/recipe-categories')
}

export const getSortedRecipeDataBySortName = (name) =>{
  return axios.get(API_BASE_URL +'/recipes?sort=' + name)
}

export const getFilteredRecipes = (id) =>{
  return axios.get(API_BASE_URL +'/recipes?categoryId='+id)
}

export const getSearchedRecipe = (query) =>{
  return axios.get(API_BASE_URL +'/recipes?q=' +query)
}

export const getSearchedRecipeByCateogry = (searchQuery, categoryId) =>{
  return axios.get(API_BASE_URL +`/recipes?q=${searchQuery}&categoryId=${categoryId}`)
}

export const getRecipeDetail = (id) =>{
  return axios.get(API_BASE_URL +`/recipes/${id}?nServing=1`)
}

export const getRecipeCookSteps = (id) =>{
  return axios.get(API_BASE_URL + `/recipes/${id}/steps`)
}