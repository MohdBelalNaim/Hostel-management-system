const router = require('express').Router()

router.post('/login',(req,res)=>{
    const{username,password}=req.body
    if(!username || !password){
        res.json({error:"All feilds are required"})
    }
    else{
        if(username==="Belal" && password==="Belalpass"){
            res.json({success:"Logged in"})
        }
        else{
            res.json({error:"Bad "})
        }
    }
})


module.exports = router