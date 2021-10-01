const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jsonwebtoken.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodeToken.userId;
        if(req.body.userId && req.body.userId !== userId) {
            throw '403: Unauthorized request';
        } else{
            next();
        }
    } catch(error) {
        res.status(401).json({error : error | 'Requête non authentifiée !'})
    }
}