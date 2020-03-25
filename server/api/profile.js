const router = require('express').Router();
const Profile = require('../db/models/profile');
module.exports = router;

router.post('/', async (req, res, next) => {
  try {
    console.log('REQ>BODY', req.body);
    let newProfile = await Profile.create(req.body);
    res.status(201).send(newProfile);
  } catch (error) {
    next(error);
  }
});
