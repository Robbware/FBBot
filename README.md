# Facebook Chat Bot

This is a simple chat bot, written with the NodeJS framework, for a Facebook chat page.

All you have to do is setup your own keyword (to recognize the commands you send in the chat) and add your facebook app token. You also need to setup the proper webhooks in your developer console in Facebook.

## Initial idea

Me and a few friends have an inside joke regarding saying "good morning". As such, we wanted a bot that would send a random quote when someone in our group chat said "good morning" (once a day). I took the idea and started digging into it to get some rust off my fingers and due to Facebook's limitations (You can't add a Page as a member of your group chatrooms), this happened. Currently being hosted on a private page, using [Heroku](www.heroku.com).

### Commands

Current commands are:

* !list "keyword" <br>
Informs the user of the total of quotes in the database.

* !total "keyword" <br>
Informs the user of how many quotes have been sent so far.

* !add "keyword" "quote" <br>
Adds a new quote to the database.

## Gallery

#### Sending quotes
![Quotes](https://i.imgur.com/LBVnEGb.png)

#### Commands
![Commands](https://i.imgur.com/XZm4k4O.png)

