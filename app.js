const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
require('dotenv').config({ path: 'key.env' });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req, res){
    res.sendFile(__dirname + "/signup.html");
    
})
app.post("/",function (req ,res){
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    const https = require("https")
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME:fName,
                    LNAME:lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const listId = process.env.MAILCHIMP_LIST_ID;
    const apiKey = process.env.MAILCHIMP_API_KEY;
    
    
    console.log("API Key suffix:", apiKey?.slice(-6));  // <---- add this
    console.log("List ID:", listId); 

    const dc = apiKey.split("-")[1]; // extracts "us14" from key
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}`;


    const options = {
        method : "POST",
        auth : `anystring:${apiKey}`
    };

    const request = https.request(url,options, function(response){

        if(response.statusCode ===200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")

        }


        response.on("data", function(data) {
            console.log("Mailchimp response:", JSON.parse(data));
        });

        

    });

   request.write(jsonData);
   request.end();
     
   
});
app.post("/failure.html",function(req, res){
    res.redirect("/");

});

app.listen(process.env.PORT||3000, function(){
    console.log ("working");

});


























//REMOVED_API_KEY

//2a70c26847

/*const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: "YOUR_API_KEY",
  server: "YOUR_SERVER_PREFIX",
});

const run = async () => {
  const response = await client.lists.batchListMembers("list_id", {
    members: [{}],
  });
  console.log(response);
};

run();

*/