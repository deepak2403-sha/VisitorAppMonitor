require('dotenv').config();
const express = require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const Data=require('./models/dat');
const methodOverride = require('method-override');
const sgMail = require('@sendgrid/mail');
const apiKey = `${process.env.SENDGRID_API_KEY}`;
sgMail.setApiKey(apiKey);
console.log(apiKey);

mongoose.connect('mongodb://localhost:27017/reception-db')
.then(()=>{
    console.log("DB CONNECTED")
})
.catch((er)=>{
    console.log(err)
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.get('/home',async (req,res)=>{
    const data=await Data.find({});
    res.render('home',{data});
})
app.get('/home/enter',(req,res)=>{
    res.render('enter');
})
app.post('/home',async(req,res)=>{
    const {name,email,phone,cinh,cinm}=req.body;
    sendeimail(email,cinh,cinm);
    await Data.create({name,email,phone,cinh,cinm});
    res.redirect('/home');
})
app.get('/home/:id',async(req,res)=>{
    const {id}=req.params;
    const d=await Data.findById(id);
    res.render('exit',{d});
})
app.put('/home/:id',async(req,res)=>{
    const {id}=req.params;
    const {couth,coutm}=req.body;
    const oh=couth;
    const om=coutm;
    const d=await Data.findById(id)
    sendexmail(d.email,oh,om)
    await Data.findByIdAndUpdate(id,{$set:{status:"Checked Out",couth:oh,coutm,om}});
    res.redirect('/home');
})
app.delete('/home/:id',async (req,res)=>{
    const {id}=req.params;
    await Data.findByIdAndDelete(id);
    res.redirect('/home');
})


function sendeimail(email,cinh,cinm){
  let m=cinm.toString();
  let h=cinh.toString();;
  if(cinm<=9){
      m='0'+cinm.toString();
  }
  if(cinh<=9){
      h='0'+cinh.toString();
  }
  const msg={
      to: email,
      from: 'dsharma04724@gmail.com',
      subject:"Entering building",
      text:`Hi you entered the building at ${h}:${m}`
  };
  sgMail.send(msg)
  .then((res) => console.log("mail sent"))
  .catch((err) => console.log(err.message));
}


function sendexmail(email,couth,coutm){
  let m=coutm.toString();
  let h=couth.toString();
  if(coutm<=9){
      m='0'+coutm.toString();
  }
  if(couth<=9){
      h='0'+couth.toString()
  }
  const msg={
      to: email,
      from: 'dsharma04724@gmail.com',
      subject:"Checking out",
      text:`Hi you checked out at ${h}:${m}`
  };
    sgMail.send(msg)
        .then((res) => console.log("mail sent"))
        .catch((err) => console.log(err.message));
}

app.listen(3000,(req,res)=>{
    console.log("UP AT 3000");
})