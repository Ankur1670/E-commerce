const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");


app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://16rahulsaini:ankursaini1670@cluster0.qs901o7.mongodb.net/")




// api creation //
app.get("/" , (req , res)=>{
res.send("Express App is Running")
})

// Image Storage Engine//
const storage = multer.diskStorage({
    destination : './upload/images',
    filename : (req , file,cb)=>{
return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating Upload Endpont for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req , res)=>{
res.json({
    success:1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
})
})

// Schema for Creating Product

const Product = mongoose.model("Produc",{
    id:{
        type: Number,
        required: true,

    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    Date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async(req , res)=>{

    let products = await Product.find({});
    let id;
    if(products.lenght>0){
let last_product_array = products.slice(-1);
let last_product = last_product_array[0];
id= last_product.id+1;
    }
    else{
        id=1;
    }
const product = new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,

});
console.log(product);
await product.save();
console.log("Saved");
res.json({
    success:true,
    name:req.body.name,
})
})

// Creating API for deleting produact

app.post('/removeproduct', async(req,res)=>{
await Product.findOneAndDelete({id:req.body.id});
console.log("Removed");
res.json({
    success:true,
    name:req.body.name
})
})
//Creating API for getting all products
app.get('/allproducts', async(req,res)=>{
let products = await Product.find({});
console.log("All Product Fetched")
res.send(products);
})


//Shema creating for User Model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})

// Creating end points for registring the user

app.post('/signup', async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success:false,error:"existing user found with same email address"});
    }
    let cart ={};
    for (let i = 0; i < 300; i++) {
cart[i]=0;        
        
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,

    })

    //save the data into db

    await user.save();

    //Creating token using object
    const data ={
        usre:{
            id:user.id
        }
    }
//genrating token usinng jwt
    const token = jwt.sign(data,'secret_ecom')
    res.json({success:true,token});
})

// Creating endpoint for user login

app.post('/login',async(req,res)=>{
    let user= await Users.findOne({email:req.body.email});
    if(user){
const passCompare = req.body.password === user.password;
if(passCompare){
    const data={
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secert_ecom');
    res.json({success:true,token});
}
else{
    res.json({success:false,error:"Wrong Password"});
}
    }
    else{
        res.json({success:false,error:"Wrong Email Id"});
    }
})


//Creating endpoint for newcollection data


// app.get('/newcollections', async(req , res)=>{
// let product = await Product.find({});
// let newcollection = product.slice(1).slice(-8);
// console.log("New Collection");
// res.send(newcollection);
// })


// creating end points for women section

// app.get('/popularinwomen', async(req,res)=>{
// let product = await Product.find({category:"women"});
// let popular_in_women = product.slice(0,4);
// console.log("Popular in women fetched");
// res.send(popular_in_women);

// })

// creating middleware to fetch user 

// Creating endpoints for adding product in cart data

// app.post('/addtocart',async(req,res)=>{
// console.log(req.body);

// })

app.listen(port,(error)=>{
if (!error) {
    console.log("Server running on Port " +port)
}
else{
    console.log("error :" +error)
}
})

