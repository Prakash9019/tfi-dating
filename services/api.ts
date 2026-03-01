import axios from 'axios';
import { getToken } from './authStorage';
// 10.218.58.192
// ⚠️ REPLACE WITH YOUR MACHINE'S LOCAL IP ADDRESS (e.g., 192.168.1.5)
const BASE_URL = 'http://10.218.58.192:5000/api'; 

export const api = axios.create({
  baseURL: BASE_URL,
});
// Axios Interceptor: Automatically attach the token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log("Attaching token to request:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We will use a mock user ID for now. 
// In a real app, you get this after the user creates an account.
export const CURRENT_USER_ID = '654321mockuserid123456'; 


export const loginUser = async (email : string, password : string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};
    
export const signupUser = async (name : string, email : string, password : string) => {
  const { data } = await api.post('/auth/signup', { name, email, password });
  return data;
};


export const fetchActors = async (query: string) => {
  const { data } = await api.get(`/tmdb/search?q=${query}`);
  // Filter only persons for the Bias screen
  return data.filter((item: any) => item.type === 'person'); 
};

export const fetchActorMovies = async (actorId: string | number) => {
    console.log("helleo from api.ts");
    console.log(`Fetching movies for actor ID: ${actorId}`);
  const { data } = await api.get(`/tmdb/actor/${actorId}/movies`);
  return data;
};

export const saveUserBias = async (biasActor: any) => {
    console.log("Saving user bias:", biasActor);
  const { data } = await api.post('/users/bias', { biasActor });
  return data;
};

export const saveTopMovies = async (movies: any[]) => {
  const { data } = await api.post('/users/top-movies', { movies });
  return data;
};
// Add this to your existing api.ts file
export const saveUserSlogan = async ( slogan: string) => {
  const { data } = await api.post('/users/slogan', {  slogan });
  return data;
};

// Add to services/api.ts

export const searchMusic = async (query: string) => {
  const { data } = await api.get(`/music/search?q=${query}`);
  return data;
};

export const saveUserMoods = async (userId: string, moods: any) => {
  const { data } = await api.post('/users/moods', { userId, moods });
  return data;
};

// Also slightly rename your existing TMDB search for clarity if you want:
export const searchTMDB = async (query: string) => {
  const { data } = await api.get(`/tmdb/search?q=${query}`);
  console.log('TMDB search results:', data);
  return data;
};