const Sequelize = require('sequelize');
const db = require('../db');

const Comment = db.define('comment', {
  q1: {
    type: Sequelize.STRING
  },

  q2: {
    type: Sequelize.STRING
  },

  body: {
    type: Sequelize.TEXT
  },

  date: {
    type: Sequelize.DATE
  }
});

module.exports = Comment;
