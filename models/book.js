const mongoose = require('mongoose');
const { checkout } = require('../controllers/auth');

const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true
  },
   auther: {
    type: String,
    required: true
  },
   genre: {
    type: String,
    required: true,
  
  },
    language: {
    type: String,
    required: true,
    
  },
    availability: {
    type: Boolean,
    required: true,
    
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  favoritedByUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const book = mongoose.model('book', bookSchema);
module.exports = book;