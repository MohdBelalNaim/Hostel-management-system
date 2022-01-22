const router = require('express').Router()
const Student = require('../models/students')

router.post('/submit-fees',(req,res)=>{
    const{phone,amount,month} = req.body
    if(!phone || !amount || !month){
        res.json({error:"All feilds are required"})
    }
    else{
        Student.findOne({studentphone:phone}).then(found=>{
            if(found){
                Student.updateOne({studentphone:phone},{"$push":{fees:{month:month,amount:amount}}})
                .then(updated=>{
                    if(updated){
                        res.json({success:"Fees record updates"})
                    }
                    else{
                        res.json({error:"Cannot complete your request at the moment"})
                    }
                })
            }
            else{
                res.json({error:"This student is not registered"})
            }
        })
    }
})

router.post('/update-amount',(req,res)=>{
    const{month,user,amount}=req.body
    if(!month || !user || !amount){
        res.json({error:"All feilds are required"})
    }
    else{
        Student.findById(user)
        .then(found=>{
            Student.update(
                {_id:user,"fees.month":month},{"$set":{"fees.$.amount":amount}})
            .then(updated=>{
                res.json({success:"Fees amount updated"})
            })
            .catch(er=>{
                res.json({error:"Kuch to gadbad hai daya!!"})
            })
        })
        .catch(err=>{
            res.json({error:"This student is not registered"})
        })
    }
})

router.post('/remove-record',(req,res)=>{
    const{user,month} = req.body
    if(!user || !month){
        res.json({error:"A required parameter was missing"})
    }
    else{
        Student.updateOne({_id:user},{
            "$pull":{
                fees:{month:month}
            }
        })
        .then(removed=>{
            res.json({success:"Record removed successfully"})
        })
    }
})

module.exports = router