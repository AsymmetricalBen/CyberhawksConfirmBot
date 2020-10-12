const { spawn } = require('child_process');
const Discord = require('discord.js');
const app = require('express')();
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

//Regular expression for email 
const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

//Dictionary for storage of user tokens
let userTokenDict = {};

//Token generator
var rand = function() {
    return Math.random().toString(36).substr(2);
}
var tokenGen = function() {
    return rand() + rand();
}

//On discord Bot login
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//On message seen by Bot
client.on('message', msg => {

    let messageText = msg.content.toLowerCase();

    //if message was not made by bot, and matches regular expression for an email
    if(msg.author.id != '762098796745719809' & 
        emailRe.test(String(messageText).toLowerCase()) &
        messageText.includes('@ung.edu')){

            //if email text includes @ung.edu
            console.log('message is a UNG email address, sending confirmation email.');

            userToken = tokenGen();
            console.log("sending token: " + userToken)
            spawn('python', ['emailsender.py', messageText, userToken])
            userTokenDict[userToken] = msg;

            msg.reply('Please check your email to confirm that you are a UNG student');

        }
        else{
            console.log('message is not an email address, discarding.');
            msg.reply('Please enter a valid UNG email address.');

        }
});

//On request to any suburl
app.get('/*', (req, res) => {
    if(req.originalUrl != '/favicon.ico'){

        //Get token from suburl
        token = req.originalUrl.replace('/', '')

        //Try to get matching user from token
        try {
            user = userTokenDict[token]

            user.member.roles.add("764203726134050818")
            console.log(user.author.username + ' confirmed their email, adding role')
            res.send('Email Confirmed')
            
        } catch (error) {
            console.log('error invalid token attempted: ' + token)
            res.send('something went wrong.  Please try again later.')
        }        
    }
});

client.login();
app.listen(3000, console.log('server starting on 3000'))