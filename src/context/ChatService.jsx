import axios from 'axios';
import { StreamChat } from 'stream-chat';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const getChatToken = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/api/chat/chatToken`, { userId }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.token;
  } catch (error) {
    console.error('Error getting chat token:', error);
    throw error;
  }
};

export const createChannel = async (petId, requesterId, ownerId) => {
  try {
    const response = await axios.post(`${API_URL}/api/chat/create-channel`, {
      petId,
      requesterId,
      ownerId
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};

export const initializeStreamClient = async (userId) => {
  const client = StreamChat.getInstance(STREAM_API_KEY);
  
  try {
    const token = await getChatToken(userId);
    await client.connectUser(
      {
        id: userId,
        name: 'User Name', // You should get this from your user data
        image: 'https://example.com/avatar.jpg' // User avatar
      },
      token
    );
    
    return client;
  } catch (error) {
    console.error('Error initializing Stream client:', error);
    throw error;
  }
};