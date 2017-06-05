var express = require('express');

var data = require("../public/data/resorts.json");

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
            title: 'Holiday Resort'
        }
    );
});

router.get('/resorts',function (req,res) {
    res.json({resorts: data})
});

module.exports = router;
