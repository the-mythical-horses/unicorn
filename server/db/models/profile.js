/* eslint-disable camelcase */
const Sequelize = require('sequelize');
const db = require('../db');

const Profile = db.define('profile', {
  P735_firstName: {
    type: Sequelize.STRING
  },

  P734_familyName: {
    type: Sequelize.STRING
  },

  P569_dateOfBirth: {
    type: Sequelize.DATE
  },

  P21_sexOrGender: {
    type: Sequelize.STRING
  },

  P19_placeOfBirth: {
    type: Sequelize.STRING
  },

  P1412_languagesSpokenWrittenOrSigned: {
    type: Sequelize.STRING
  },

  P106_occupation: {
    type: Sequelize.STRING
  },

  P69_educatedAt: {
    type: Sequelize.STRING
  },

  P551_residence: {
    type: Sequelize.STRING
  },

  P172_ethnicGroup: {
    type: Sequelize.STRING
  },

  P140_religion: {
    type: Sequelize.STRING
  },

  P410_militaryRank: {
    type: Sequelize.STRING
  },

  P1971_numberOfChildren: {
    type: Sequelize.INTEGER
  },

  P2048_height: {
    type: Sequelize.INTEGER
  },

  P27_countryOfCitizenship: {
    type: Sequelize.STRING
  },

  P108_employer: {
    type: Sequelize.STRING
  },

  P463_memberOf: {
    type: Sequelize.STRING
  },

  P552_handedness: {
    type: Sequelize.STRING
  },

  P101_fieldOfWork: {
    type: Sequelize.STRING
  },

  P102_memberOfPoliticalParty: {
    type: Sequelize.STRING
  },

  P1340_eyeColor: {
    type: Sequelize.STRING
  },

  P1884_hairColor: {
    type: Sequelize.STRING
  },

  P2067_mass: {
    type: Sequelize.INTEGER
  }
});

module.exports = Profile;
