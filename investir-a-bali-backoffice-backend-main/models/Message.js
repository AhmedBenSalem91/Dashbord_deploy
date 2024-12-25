const mongoose = require('mongoose');

// Define the schema for a message
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },   // Name of the person sending the message
    email: { type: String, required: true },  // Email of the person
    projets: { type: Array, required: true }, 
    comment: { type:String },
    phone: { type:String },
    isOpened : { type:Boolean, required:true, default:false },
    date: { type: Date, default: Date.now }    // Date when the message was sent, defaults to current date and time
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
