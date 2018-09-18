'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = require('express')();


// loading the local quotes database - quotes added after server run won't be saved, for now.
var fs = require('fs');
var quotes = fs.readFileSync("quotes.json");
var quoteJson = JSON.parse(quotes);

// special keyword to use the chat commands
let keyword = "KEYWORD"
// facebook app token
let token = "FACEBOOK APP TOKEN";

// total quotes sent to users
let totalSent = 0;

app.set('port', (process.env.PORT || '5000'))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('')
})

// verifies the token added on Facebook's webhook
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] == keyword) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Wrong token bros');
})

// where the magic happens
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {

        let event = messaging_events[i];
        let sender = event.sender.id

        if (event.message) {
            if (verifyKeyword(event.message.text)) {
                sendText(sender, getRandomQuote());
                totalSent += 1;
            } else {
                parseCommands(sender, event.message.text);
            }
        }
    }
    res.sendStatus(200);
})

//verifies if the message contains the special keyword in order to sent the quote
function verifyKeyword(message) {
    let messages = ['bom dia', 'good morning', 'BOM DIA', 'GOOD MORNING', 'hello', 'HELLO', 'olá', 'OLÁ']

    for (let i = 0; i < messages.length; i++) {
        if (message.includes(messages[i])) {
            return true;
        }
    }

    return false;
}

// gets a random quote from the list
function getRandomQuote() {
    let random = Math.floor(Math.random() * quoteJson.quotes.length);
    return quoteJson.quotes[random].text;
}

// simple commander parser
function parseCommands(sender, cmd) {
    if(cmd.includes("!add " + keyword + " ")) {
        let quoteText = cmd
        quoteText = quoteText.replace("!add "+keyword+" ", "");
        addNewQuote(sender, quoteText)    
    } else if(cmd.includes("!list " + keyword)) {
        sendText(sender, "There's a total of *" + quoteJson.quotes.length + "* quotes in the database.");
    } else if(cmd.includes("!total " + keyword)) {
        sendText(sender, "I've sent a total of *" + totalSent +"* quotes.");
    }
}

function addNewQuote(author, text) {
    quoteJson.quotes.push({
        "text": text,
        "author": author
    });
    sendText(author, 'New quote added: "' + text + '"')
}

function sendText(sender, text) {
    let messageData = { text: text }
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: token },
        method: "POST",
        json: {
            recipient: { id: sender },
            message: messageData
        }
    }), function (error, response, body) {
        if (error) {
            console.log("Error while sending a message.")
        } else if (response.body.error) {
            console.log("Error on response body.")
        }
    }
}

app.listen(app.get('port'), function () {
    console.log('running on: ' + app.get('port'));
})