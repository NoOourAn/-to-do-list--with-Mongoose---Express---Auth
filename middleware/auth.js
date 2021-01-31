var jwt = require('jsonwebtoken');

module.exports = async (req,res,next)=>{
    try {
      const { authorization } = req.headers;
      const decodeData = await jwt.verify(authorization, 'Awesomeness');
      req.decodeData = decodeData; ///now we can access the user id in each request
      next();
    } catch (err) {
      console.error(err)
      res.status(401).send({error:"authentication failed"})
    }

  }

