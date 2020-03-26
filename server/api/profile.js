const router = require('express').Router();
const {Profile} = require('../db/models');
const {User} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    let userId = req.user.id;
    let user = await User.findByPk(userId, {
      include: [{model: Profile}]
    });

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

    if (!user.profile) {
      res.sendStatus(500);
    }
    const profile = user.profile.dataValues;
    // console.log('prrrrrooooooofffffillllleeee', profile)
    Object.keys(profile).forEach(keyName => {
      console.log('keyName', keyName, typeof keyName);
      if (
        !profile[keyName] ||
        ['id', 'createdAt', 'updatedAt', 'userId'].includes(keyName)
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
    console.log('REQ>BODY', req.user.id);

    let newProfile = await Profile.create(req.body);
    newProfile.userId = req.user.id;
    newProfile.save();

    res.status(201).send(newProfile);
  } catch (error) {
    next(error);
  }
});
