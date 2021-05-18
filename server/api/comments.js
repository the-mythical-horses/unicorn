const router = require('express').Router();
const {Comment, User} = require('../db/models');
const {Op} = require('sequelize');
module.exports = router;

router.get('/:q1/:q2', async (req, res, next) => {
  try {
    // const comments = await Comment.findAll({
    //   where: {
    //     [Op.or]: [{q1: req.params.q1}, {q1: req.params.q2}],
    //     [Op.or]: [{q2: req.params.q1}, {q2: req.params.q2}]
    //   },
    //   include: [
    //     {
    //       model: User
    //     }
    //   ]
    // });
    res.send([]);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // if (!req.user) {
    //   res.sendStatus(500);
    //   return;
    // }
    // console.log('REQ.BODY: ', req.body);
    // const newComment = await Comment.create({
    //   q1: req.body.q1,
    //   q2: req.body.q2,
    //   comment: req.body.comment,
    //   date: new Date()
    // });
    // const user = await User.findByPk(req.user.id);
    // await newComment.setUser(user);
    // const comment = await Comment.findByPk(newComment.id, {
    //   include: [{model: User}]
    // });
    // res.status(201).send(comment);
    res.send({});
  } catch (error) {
    next(error);
  }
});
