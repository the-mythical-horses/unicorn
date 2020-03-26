const router = require('express').Router();
const Profile = require('../db/models/profile');
module.exports = router;

router.get('/:id', async (req, res, next) => {
  try {
    let profileId = req.params.id;

    let startingObject = {
      PROFILE: {
        id: 'PROFILE',
        type: 'item',
        modified: '2020-01-01T00:00:00Z',
        labels: {
          en: 'My Profile'
        },
        descriptions: {
          en: 'My User Profile'
        },
        claims: {
          P373: [
            {
              value: 'Harry Prevor',
              type: 'string'
            }
          ]
        }
      }
    };

    let profile = await Profile.findByPk(profileId);
    console.log(profile);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    console.log('REQ>BODY', req.body);
    let newProfile = await Profile.create(req.body);
    res.status(201).send(newProfile);
  } catch (error) {
    next(error);
  }
});
