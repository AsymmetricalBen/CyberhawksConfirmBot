const Discord = require('discord.js');
const app = require('express')();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const TOKEN = process.env.DISCORD_BOT_TOKEN;



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    let messageText = msg.content;
    console.log('message from -'+ msg.author.username + ' - Message text - ' + messageText);

    if(msg.author.id != '762098796745719809'){
        if(emailRe.test(String(messageText).toLowerCase())){
            if(messageText.includes('@ung.edu')){
                msg.reply('Please check your email to confirm that you are a UNG student');
                //TODO come back and write code for AUTH token creation and email sending
                
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
    res.send('Email Confirmed')
    //TODO Confirm AUTH token and give user role


});

client.login(TOKEN);
app.listen(3000, console.log('server starting on 3000'))