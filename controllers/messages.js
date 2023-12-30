import express from 'express';
// import mongoose from 'mongoose'; to check Valid ObjectId

import Message from '../models/Message.js';

const router = express.Router();

//add

export const createMessages = async (req, res) => { 
  const createMessages = new Message(req.body);
  try {
      const saveCreateMessages = await createMessages.save();
              
      res.status(200).json(saveCreateMessages);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

//get

export const getMessages = async (req, res) => { 
  try {
    //console.log(req.params);
      const getMessages = await Message.find({
        conversationId: req.params.conversationId,
      });
              
      res.status(200).json(getMessages);
  } catch (error) {
      res.status(500).json({ message: error });
  }
}

export default router;
