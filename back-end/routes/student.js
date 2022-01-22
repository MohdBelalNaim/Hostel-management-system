const Student = require('../models/students')
const router = require('express').Router()

router.post('/add-student',(req,res)=>{
    const{
        studentname,
        studentphone,
        studentemail,
        studentage,
        guardianname,
        guardianphone,
        studentaadhar,
        studentinstitute,
        studentaddress,
    }=req.body

    if(!studentname||!studentphone||!studentemail||!studentage||!guardianname||!guardianphone||!studentaadhar||!studentinstitute||!studentaddress){
        res.json({error:"All fields are required"})
    }
    else{
        Student.findOne({studentemail:studentemail})
        .then(found=>{
            if(found>0){
                res.json({error:"This email is already registered"})
            }
            else{
                const student = new Student({
                    studentname,
                    studentphone,
                    studentemail,
                    studentage,
                    guardianname,
                    guardianphone,
                    studentaadhar,
                    studentinstitute,
                    studentaddress,
                })
                student.save()
                .then(saved=>{
                     if(saved)res.json({success:"Student record added"})
                })
            }
        })
    }
    
})

router.post('/all-students',(req,res)=>{
    Student.find()
    .then(found=>{
        if(found!=null){
            res.json({found:found})
        }
        else{
            res.json({error:"No record found"})
        }
    })
})

router.post('/by-id/:id',(req,res)=>{
    Student.findOne({_id:req.params.id}).then(found=>{
        if(found!=null){
            res.json({found:found})
        }
        else{
            res.json({error:"Invalid student ID"})
        }
    })
})

router.post('/by-phone',(req,res)=>{
    const{phone}=req.body
    if(!phone){
        res.json({error:"All feilds are required"})
    }
    else{
        Student.findOne({studentphone:phone})
        .then(found=>{
            if(found!=null){
                res.json({found:found})
            }
            else{
                res.json({error:"This student is not registered"})
            }
        })
    }
})

router.post('/update-student-data/:id',(req,res)=>{
    const{
            studentname,
            studentphone,
            studentemail,
            studentage,
            guardianname,
            guardianphone,
            studentaadhar,
            studentinstitute,
            studentaddress,
    }=req.body
    Student.updateOne({_id:req.params.id},{
        "$set":{
            studentname:studentname,
            studentphone:studentphone,
            studentemail:studentemail,
            studentage:studentage,
            guardianname:guardianname,
            guardianphone:guardianphone,
            studentaadhar:studentaadhar,
            studentinstitute:studentinstitute,
            studentaddress:studentaddress
        }
    })
    .then(updated=>{
        res.json({message:"Details updated successfully"})
    })
    .catch(err=>{
        res.json({error:"Cannot complete your request at the moment"})
    })
})



module.exports = router