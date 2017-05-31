var express = require('express');
var index = require("../controllers/index");

var router = express.Router();

router.get('/', index.index);
router.get('/get_today_user_list', index.todayUserList);

module.exports = router;