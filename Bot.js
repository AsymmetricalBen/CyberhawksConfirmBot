const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const emailRe = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const TOKEN = process.env.TOKEN;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    let messageText = msg.content;
    console.log('message from -'+ msg.author.username + ' - Message text - ' + messageText);

    if(msg.author.id != '762098796745719809'){
        if(emailRe.test(String(messageText).toLowerCase)){
            if(messageText.includes('@ung.edu')){
                msg.reply('Please check your email to confirm that you are a UNG student');
                
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

client.login(TOKEN);