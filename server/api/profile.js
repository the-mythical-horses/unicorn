const router = require('express').Router();
const {Profile} = require('../db/models');
const {User} = require('../db/models');
module.exports = router;

router.get('/raw', async (req, res, next) => {
  try {
    let profile = await Profile.findOne({
      where: {
        userId: req.user.id
      }
    });
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

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

router.put('/', async (req, res, next) => {
  try {
    let profile = await Profile.findOne({
      where: {
        userId: req.user.id
      }
    });
    profile.update(req.body);
    res.status(201).send(profile);
  } catch (error) {
    next(error);
  }
});
