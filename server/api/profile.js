const router = require('express').Router();
const Profile = require('../db/models/profile');
module.exports = router;

router.get('/:id', async (req, res, next) => {
  try {
    let profileId = req.params.id;

    let entities = {
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
        claims: {}
      }
    };

    let profile = await Profile.findByPk(profileId, {raw: true});
    Object.keys(profile).forEach(keyName => {
      if (
        !profile[keyName] ||
        ['id', 'createdAt', 'updatedAt'].includes(keyName)
      ) {
        return;
      }
      const pid = keyName.split('_')[0];
      if (typeof profile[keyName] == 'string') {
        // assume q-objects
        const values = profile[keyName].split(',');
        values.forEach(v => {
          const valObj = {
            value: v,
            type: 'wikibase-item'
          };
          if (entities.PROFILE.claims[pid]) {
            entities.PROFILE.claims[pid].push(valObj);
          } else {
            entities.PROFILE.claims[pid] = [valObj];
          }
        });
      } else {
        entities.PROFILE.claims[pid] = [
          {
            value: profile[keyName],
            type: 'quantity'
          }
        ];
      }
    });
    res.json(entities);
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
