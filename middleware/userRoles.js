
module.exports = function (req, res, next) {
// console.log(req.user,'this is a test')
    if (req.user.role != 'admin') return res.status(403).send('Access Denied.');
   next();
}