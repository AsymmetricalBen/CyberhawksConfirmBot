const { spawn } = require('child_process');
const Discord = require('discord.js');
const app = require('express')();
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const embedMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Welcome to the Cyberhawks club server!')
	.setDescription('For security reasons, in order to get fullaccess to the server channels please respond with your UNG email address here:');
	
//Regular expression for email 
const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

//Dictionary for storage of user tokens
let userTokenDict = {};

//Token generator fuction
var tokenGen = function() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

//On discord Bot login
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd',(member) => {
    member.send(embedMessage);
});



//On message seen by Bot
client.on('message', msg => {
    if(msg.content.startsWith('!verifyForceAll')){
        // TODO add method to index and force all users to verify their email address
    }

    if(msg.content.startsWith('!verify ')){
        msg.member.send(embedMessage);
    }

    if(msg.channel.type == 'dm' & msg.author.id != '762098796745719809' ){
        let messageText = msg.content
    
        if(emailRe.test(String(messageText).toLowerCase()) &
            messageText.includes('@ung.edu')){

                //if email text includes @ung.edu
                console.log('message is a UNG email address, sending confirmation email.');

                userToken = tokenGen();
                console.log("sending token: " + userToken)
                spawn('python', ['emailsender.py', messageText, userToken])
                userTokenDict[userToken] = msg.author.id;

                msg.reply('Please check your email to confirm that you are a UNG student');
            }
            else{
                console.log('message is not an email address, discarding.');
                msg.reply('Please enter a valid UNG email address.');
            }
        }
});

//
app.get('/*/test',  (req, res) => {
    res.send('Good')
});

//On request to any suburl
app.get('/*', (req, res) => {
    if(req.originalUrl != '/favicon.ico'){

        //Get token from suburl
        token = req.originalUrl.replace('/', '')

        //Try to get matching user from token
        try {
            userID = userTokenDict[token]
            user = client.guilds.cache.get('764197891001679872').members.cache.get(userID)

            user.roles.add("764203726134050818")
            console.log(user.username + ' confirmed their email, adding role')
            res.send('Email Confirmed')
        } 
        catch (error) {
            console.log('error invalid token attempted: ' + token)
            res.send('something went wrong.  Please try again later.')
        }        
    }
});

client.login();
app.listen(3000, console.log('server starting on 3000'))