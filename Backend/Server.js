import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


/* ======================
   HEALTH CHECK
====================== */

app.get("/", (req,res)=>{
    res.send("🤖 Nexa N.20 is running securely.");
});


/* ======================
   CHAT ENDPOINT
====================== */

app.post("/chat", async(req,res)=>{

try {

    const userMessage = req.body.message;
    const memory = req.body.memory || "";
    const mode = req.body.mode || "normal";


    if(!userMessage){

        return res.status(400).json({
            error:"No message provided"
        });

    }


    let modePrompt = "";


    if(mode==="thinking"){

        modePrompt =
        "Use deeper reasoning and detailed explanations.";

    }


    if(mode==="research"){

        modePrompt =
        "Answer like a research assistant. Structure information clearly.";

    }


    if(mode==="image"){

        modePrompt =
        "Help create image ideas and prompts.";

    }


    if(mode==="web"){

        modePrompt =
        "Provide current-information style answers.";

    }



    const response =
    await fetch(
    "https://api.openai.com/v1/chat/completions",
    {

        method:"POST",

        headers:{

            "Content-Type":"application/json",

            "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`

        },


        body:JSON.stringify({

            model:"gpt-4o-mini",


            messages:[


            {
                role:"system",

                content:`

You are Nexa N.20,
an advanced AI assistant.

Personality:
- Friendly
- Helpful
- Simple explanations

Features:
- Voice support
- File support
- Image support

Current mode:
${mode}

${modePrompt}

Use memory when available.

`
            },


            {

                role:"system",

                content:
                `User memory:
                ${memory || "No memory available"}`

            },


            {

                role:"user",

                content:userMessage

            }


            ]

        })

    });



    const data =
    await response.json();



    if(data.error){

        return res.status(500).json({

            error:data.error.message

        });

    }



    const reply =
    data.choices[0].message.content;



    res.json({

        reply

    });



}

catch(error){


console.error(
"Nexa Error:",
error
);


res.status(500).json({

    error:"Nexa backend failed"

});


}

});



/* ======================
   START
====================== */

const PORT =
process.env.PORT || 3000;


app.listen(PORT,()=>{

console.log(
`🤖 Nexa N.20 running on port ${PORT}`
);

});
