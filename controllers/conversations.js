import express from 'express';
// import mongoose from 'mongoose'; to check Valid ObjectId

import Conversation from '../models/Conversation.js';

const router = express.Router();

//new conv
export const createConversation = async (req, res) => { 
  const createConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
      const saveCreateConversation = await createConversation.save();
              
      res.status(200).json(saveCreateConversation);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

//get conv of a user
export const getConversation = async (req, res) => { 
  try {
    
    //console.log(req.params);
   
      const getConversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(getConversation);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}


// get conv includes two userId
export const getConversationTwoId = async (req, res) => { 
  try {
    const getConversationTwoId = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
            
    res.status(200).json(getConversationTwoId);
} catch (error) {
    res.status(500).json({ message: error.message });
}
}

//get getOneConversation  details 
export const getOneConversation = async (req, res) => { 
  const { conversationId } = req.params;
  //console.log("req.params conversationId " + req.params);
  try {
      const getOneConversation = await Conversation.findById(conversationId);
      //console.log(getOneConversation);
      res.status(200).json(getOneConversation);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export default router;
