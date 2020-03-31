const router = require('express').Router();
const {Comment, User} = require('../db/models');
const {Op} = require('sequelize');
module.exports = router;

router.get('/:q1/:q2', async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: {
        [Op.or]: [{q1: req.params.q1}, {q1: req.params.q2}],
        [Op.or]: [{q2: req.params.q1}, {q2: req.params.q2}]
      },
      include: [
        {
          model: User
        }
      ]
    });
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      res.sendStatus(500);
      return;
    }
    const newComment = await Comment.create({
      q1: req.body.q1,
      q2: req.body.q2,
      body: req.body.body,
      date: new Date()
    });
    const user = await User.findByPk(req.user.id);
    await newComment.setUser(user);
    const comment = await Comment.findByPk(newComment.id, {
      include: [{model: User}]
    });
    res.status(201).send(comment);
  } catch (error) {
    next(error);
  }
});
