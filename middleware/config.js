var express = require('express')
var router = express.Router()


router.use(express.static('public'))
router.use(express.json());


router.use((req,res,next)=>{
  let logObj = {
      url:req.url,
      method:req.method,
      CurrentTime:new Date()
  }
  console.log(logObj)
  next();  ///needed to get out the middleware
})

///global error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack)
  const errObj = {
      error:"internal server error !",
      statusCode:res.statusCode,
  }
  res.send(errObj)
  next();
})


module.exports = router
