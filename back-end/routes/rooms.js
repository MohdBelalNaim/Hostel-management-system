const Rooms = require('../models/rooms')
const Student = require('../models/students')

const router = require('express').Router()

router.post("/add-room",(req,res)=>{
    const{roomNumber}=req.body
    if(!roomNumber){
        res.json({error:"All feilds are required"})
    }
    else{
        Rooms.findOne({room:roomNumber})
        .then(found=>{
            if(found){
                res.json({error:"Room number already exists"})
            }
            else{
                const room = new Rooms({
                    room:roomNumber
                })
                room.save()
                .then(saved=>{
                    if(saved){
                        res.json({success:"Room added"})
                    }
                    else{
                        res.json({error:"An unknown error has occuredx"})
                    }
                })
            }
        })
    }
})

router.post("/all-rooms",(req,res)=>{
    Rooms.find()
    .then(found=>{
        res.json({rooms:found})
    })
    .catch(err=>{console.log(err)})
})

router.post("/vaccant",(req,res)=>{
    Rooms.find({status:'Vaccant'})
    .then(found=>{
        if(found!=""){
            res.json({found:found})
        }
        else{
            res.json({error:"No vaccant rooms"})
        }
    })
})

router.post("/partly",(req,res)=>{
    Rooms.find({status:"Partly occupied"})
    .then(found=>{
        if(found!=""){
            res.json({found:found})
        }
        else{
            res.json({error:"No partly occupied rooms found"})
        }
    })
})

router.post('/by-id/:id',(req,res)=>{
    Rooms.findById(req.params.id)
    .then(found=>{
        if(found!=""){
            res.json({found:found})
        }
        else{
            res.json({error:"No room found with the given ID"})
        }
    })
})

router.post('/available',(req,res)=>{
    Rooms.find({"$or":[{status:"Vaccant"},{status:"Partly occupied"}]})
    .then(found=>{
        if(found!=""){
            res.json({found:found})
        }
        else{
            res.json({error:"No rooms vaccant"})
        }
    })
})

router.post('/allot-room',(req,res)=>{
   const{phone,type,room}=req.body
   if(!phone || !type ||!room){
       res.json({error:"All feilds are required"})
   }
   else{
    Student.findOne({studentphone:phone})
    .then(foundStudent=>{
        if(foundStudent==null){
            res.json({error:"This student is not registered"})
        }
        else{
            if(foundStudent.roomnumber=="NA"){
                Rooms.findOne({room:room}).then(foundRoom=>{
                    if(foundRoom==null){
                        res.json({error:"Invalid room number"})
                    }
                    else{
                        //checking is room is fully occupied
                        if(foundRoom.status=="Fully occupied"){
                            res.json({error:"This room is fully occupied"})
                        }
                        else{
                            //checking if room is partly occupied and user wants a full occupancy
                            if(foundRoom.status=="Partly occupied" && type=="Full"){
                                res.json({error:"This room cannot be fully occupied"})
                            }
                            //if room is vaccant and occupancy type is full then
                            else{
                                if(foundRoom.status=="Vaccant" && type=="Full"){
                                    Rooms.updateOne({room:room},{"$set":{status:"Fully occupied"}})
                                    .then(updatedRoomStatus=>{
                                        Rooms.updateOne({room:room},{"$push":{occupied_by:{name:foundStudent.studentname,student:foundStudent._id,occupancy_type:type}}})
                                        .then(updateOccupancyList=>{
                                           Student.updateOne({studentphone:phone},{"$set":{roomnumber:room,occupancytype:type}})
                                           .then(updatedStudentStatus=>{
                                                res.json({message:"Room "+room+" fully occupied by "+foundStudent.studentname})
                                           })
                                        })
                                    })
                                }
                            }

                            if(foundRoom.status == "Vaccant" && type=="Partly" || foundRoom.status == "Partly occupied" && type=="Partly"){
                               if(foundRoom.status=="Vaccant"){
                                  Rooms.updateOne({room:room},{"$set":{status:"Partly occupied"}})
                                  .then(updated=>{
                                    Rooms.updateOne({room:room},{"$push":{occupied_by:{name:foundStudent.studentname,student:foundStudent._id,occupancy_type:type}}})
                                    .then(updatedRoomList=>{
                                        Student.updateOne({studentphone:phone},{"$set":{roomnumber:room,occupancytype:type}})
                                        .then(updatedStudentData=>{
                                            res.json({message:"Room "+room+" Partly occupied by "+foundStudent.studentname})
                                        })
                                    })
                                  })
                               }
                               else if(foundRoom.status=="Partly occupied"){
                                  Rooms.updateOne({room:room},{"$set":{status:"Fully occupied"}})
                                  .then(updated=>{
                                    Rooms.updateOne({room:room},{"$push":{occupied_by:{name:foundStudent.studentname,student:foundStudent._id,occupancy_type:type}}})
                                    .then(updatedRoomList=>{
                                        Student.updateOne({studentphone:phone},{"$set":{roomnumber:room,occupancytype:type}})
                                        .then(updatedStudentData=>{
                                            res.json({message:"Room "+room+" Partly occupied by "+foundStudent.studentname})
                                        })
                                    })
                                  })
                               }

                               

                            }
                        }
                    }
                })
            }
            else{
                res.json({error:"This student has already been alotted a room"})
            }
        }
    })
   }
})

module.exports = router