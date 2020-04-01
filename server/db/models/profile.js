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
  },

  P22_father: {
    type: Sequelize.STRING
  },

  P25_mother: {
    type: Sequelize.STRING
  },

  P26_spouse: {
    type: Sequelize.STRING
  },

  P40_child: {
    type: Sequelize.STRING
  },

  P451_unmarriedPartner: {
    type: Sequelize.STRING
  },

  P1038_relative: {
    type: Sequelize.STRING
  },

  P1290_godparent: {
    type: Sequelize.STRING
  },

  P3373_sibling: {
    type: Sequelize.STRING
  },

  P413_positionPlayedOnTeam: {
    type: Sequelize.STRING
  },

  P741_playingHand: {
    type: Sequelize.STRING
  },

  P39_positionHeld: {
    type: Sequelize.STRING
  },

  P53_family: {
    type: Sequelize.STRING
  },

  P66_ancestralHome: {
    type: Sequelize.STRING
  },

  P91_sexualOrientation: {
    type: Sequelize.STRING
  },

  P103_nativeLanguage: {
    type: Sequelize.STRING
  },

  P412_voiceType: {
    type: Sequelize.STRING
  },

  P511_honorificPrefix: {
    type: Sequelize.STRING
  },

  P512_academicDegree: {
    type: Sequelize.STRING
  },

  P641_sport: {
    type: Sequelize.STRING
  },

  P737_influencedBy: {
    type: Sequelize.STRING
  },

  P941_inspiredBy: {
    type: Sequelize.STRING
  },

  P937_workLocation: {
    type: Sequelize.STRING
  },

  P1344_participantOf: {
    type: Sequelize.STRING
  },

  P1399_convictedOf: {
    type: Sequelize.STRING
  },

  P1411_nominatedFor: {
    type: Sequelize.STRING
  },

  P1416_affiliation: {
    type: Sequelize.STRING
  },

  P742_pseudonym: {
    type: Sequelize.STRING
  },

  P1853_bloodType: {
    type: Sequelize.STRING
  },

  P2650_interestedIn: {
    type: Sequelize.STRING
  },

  P3438_vehicleNormallyUsed: {
    type: Sequelize.STRING
  },

  P2218_netWorth: {
    type: Sequelize.STRING
  }
});

module.exports = Profile;
