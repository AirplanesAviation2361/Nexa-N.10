import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import multer from "multer";
import path from "path";


dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());


// ======================
// FILE UPLOAD SYSTEM
// ======================


const storage =
multer.diskStorage({

destination:
(req,file,cb)=>{

cb(null,"assets/uploads");

},


filename:
(req,file,cb)=>{

cb(
null,
Date.now()+"-"+file.originalname
);

}

});


const upload =
multer({storage});




app.post(
"/upload",
upload.single("file"),

(req,res)=>{


if(!req.file){

return res.json({
error:"No file"
});

}



res.json({

success:true,

file:req.file.filename

});


});




// ======================
// HEALTH
// ======================


app.get("/",(req,res)=>{

res.send(
"🤖 Nexa N.20 online"
);

});




// ======================
// CHAT
// ======================


app.post(
"/chat",

async(req,res)=>{


try{


const message =
req.body.message;


const mode =
req.body.mode || "normal";




const response =
await fetch(

"https://api.openai.com/v1/chat/completions",

{


method:"POST",


headers:{


"Content-Type":
"application/json",


"Authorization":
`Bearer ${process.env.OPENAI_API_KEY}`


},


body:JSON.stringify({

model:"gpt-4o-mini",


messages:[


{

role:"system",

content:

`

You are Nexa N.20.

Modes:

normal:
Friendly assistant.

thinking:
Detailed answers.

research:
Research style.

image:
Creative image prompts.

web:
Current information style.


`

},


{

role:"user",

content:message

}


]

})


});




const data =
await response.json();



res.json({

reply:
data.choices[0].message.content

});




}

catch(err){


console.log(err);


res.status(500).json({

error:
"Nexa failed"

});


}


});




// ======================
// START
// ======================


app.listen(3000,()=>{


console.log(
"🤖 Nexa N.20 running"
);


});
