//Requires node modules child_process, discord.js, express, and dotenv

const { spawn } = require('child_process');
const Discord = require('discord.js');
const app = require('express')();
require('dotenv').config();
const client = new Discord.Client();

//Message to be sent to users
const embedMessage = new Discord.MessageEmbed()
    .setColor(process.env.MESSAGE_COLOR)
    .setTitle(process.env.MESSAGE_TITLE)
	.setDescription(process.env.MESSAGE_TEXT);
	
//Regular expression for email 
const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

//Dictionary for storage of user tokens
var userTokenDict = {};

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//Token generator fuction
const tokenGen = () => {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}


const emailSender = spawn('python', ['emailsenderv2.py']);

emailSender.stdout.on('data', (data) => {
    console.log(data.toString());
});

emailSender.stderr.on('data', (data) => {
    console.error(data.toString());
});

//On discord Bot login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//On new user join, send DM prompting for verification
client.on('guildMemberAdd',(member) => {
    member.send(embedMessage);
});

//On message seen by Bot
client.on('message', msg => {

    let messageText = msg.content

    //Command used to force users without verrified role to verify their student email
    if(messageText.startsWith('!verifyForceAll')){
        // TODO index and prompt all curently unauthized users to verify their email address
    }

    //Command used for single user to have verification message resent to themselfs 
    if(messageText.startsWith('!verify')){
        msg.member.send(embedMessage);
    }
    
    //If message is DM, passes email RE check, includes @ung.edu, and is 18 chars long
    if(msg.channel.type == 'dm' & emailRe.test(String(messageText).toLowerCase()) & messageText.includes('@ung.edu') & messageText.length == 18) {

            //if email text includes @ung.edu
            console.log('Message is a UNG email address, sending confirmation email.');

            //Generate token
            userToken = tokenGen();

            //Send email with link containing token
            emailSender.stdin.write(messageText.toLowerCase() + ' ' + userToken + '\n');
            console.log("Sending token: " + userToken);

            //Store token to dictionary for later
            //I don't particularly like using a dictionary here, but for the time being it works as a proof of concept
            userTokenDict[userToken] = msg.author.id;

            msg.reply(process.env.GOOD_EMAIL);
        }
        else if (msg.channel.type == 'dm' & msg.author.id != '762098796745719809'){

            console.log('Message is not a UNG email address, discarding.');
            msg.reply(process.env.BAD_EMAIL);
        }
});

//
app.get('/favicon.ico', (req, res) => {
    res.send('icon.png');
});

//On request to any suburl
app.get('/*', (req, res) => {
    if(req.originalUrl == '/favicon.ico'){

    }
    //Get token from suburl
    token = req.originalUrl.replace('/', '');

    //Try to get matching user from token
    try {
        userID = userTokenDict[token];
        user = client.guilds.cache.get('764197891001679872').members.cache.get(userID);

        user.roles.add("764203726134050818");
        console.log(user.username + ' confirmed their email, adding role');

        //Boilerplate response for the moment
        res.send('Email Confirmed');
    } 
    catch (error) {
        console.log('Invalid token attempted: ' + token);

        //Boilerplate response for the moment
        res.send('something went wrong.  Please try again later.');
    }        
});


//Discord bot login token should be in a .env file containing DISCORD_TOKEN="{TOKEN HERE}"
client.login();

//Hosting on port 3000 for testing
app.listen(3000, console.log('server starting on 3000'));

readline.question('', url => {
    emailSender.stdin.write(url + '\n');
    readline.close();
});