const { models } = require('mongoose');
const { config } = require('nodemon');

module.exports = (app) => {
  const posts = require('../controllers/post.controller');
  const router = require('express').Router();

  router.get('/', posts.findAll);
  router.post('/', posts.create);
  router.put('/:id', posts.update);
  router.delete('/:id', posts.delete);
  router.post('/reserve', posts.validate);
  router.get('/search', posts.findOne);

  app.use('/api/posts', router);
};
