const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/test', function (req, res, next) {
  res.send('Detta är en ny testroute.');
});

module.exports = router;
