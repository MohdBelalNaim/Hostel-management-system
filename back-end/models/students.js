const mongoose = require('mongoose')
const Student = mongoose.Schema({
    studentname:{type:String,required:true},
    studentphone:{type:String,required:true},
    studentemail:{type:String,required:true},
    studentage:{type:String,required:true},
    guardianname:{type:String,required:true},
    guardianphone:{type:String,required:true},
    studentaadhar:{type:String,required:true},
    studentinstitute:{type:String,required:true},
    studentaddress:{type:String,required:true},
    //studentphotograph:{type:String,required:true},
    roomnumber:{type:String,default:"NA"},
    occupancytype:{type:String,default:"NA"},
    fees:[
        {
            month:{type:String},
            amount:{type:String}
        }
    ]
})

module.exports = mongoose.model('Student',Student)