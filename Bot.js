const { spawn } = require('child_process');
const Discord = require('discord.js');
const app = require('express')();
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

let userTokenDict = {};
var rand = function() {
    return Math.random().toString(36).substr(2);
}
var token = function() {
    return rand() + rand();
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    let messageText = msg.content.toLowerCase();

    if(msg.author.id != '762098796745719809' & msg.member.roles.has("764203726134050818")){
        console.log('New message from - '+ msg.author.username + ' - Message text - ' + messageText);
        if(emailRe.test(String(messageText).toLowerCase())){
            if(messageText.includes('@ung.edu')){
                msg.reply('Please check your email to confirm that you are a UNG student');
                console.log('message is a UNG email address, sending confirmation email.');

                userToken = token();
                console.log("sending token: " + userToken)
                spawn('python', ['emailsender.py', messageText, userToken])
                userTokenDict[userToken] = msg.member;

            }
            else{
                console.log('message is not a UNG email address, discarding.');
                msg.reply('Please enter a valid UNG email address.');
            }
        }
        else{
            console.log('message is not an email address, discarding.');
            msg.reply('Please enter a valid UNG email address.');
        }
    }
});

app.get('/*', (req, res) => {
    console.log(req.originalUrl);
    try {
        console.log(userTokenDict[req.originalUrl.replace('/', '')]);
        userTokenDict[req.originalUrl.replace('/', '')].roles.add("764203726134050818")
        res.send('Email Confirmed')
    } catch (error) {
        console.log('error')
        res.send('something went wrong.')
    }

});

client.login();
app.listen(3000, console.log('server starting on 3000'))