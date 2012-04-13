Support.js
==========

Support.js is a free and open-source alternative to [Olark](https://www.olark.com). 

It's written from scratch to run on Heroku and Campfire. Create an awesome user experience without paying anything.

Here is how it works
--------------------

Download the repo. Deploy it to Heroku (tutorial to follow). Set some of the config vars and add one line of Javascript to your website. Dead simple, isn't it?

The Campfire bot will now join your desired room. Whenever a customer writes to Support.js, it will be posted to Campfire. That's all the magic! And this is how it looks:

    Philipp S.: support status
	SupportBot: Welcome to Support.js!
                
                13 clients connected and 0 open conversations.

                To get stratet, just include the following snipped in your HTML:
                <script src="https://yourname.herokuapp.com/support.js"></script>
                (Make sure you have jQuery loaded before)
    
    SupportBot: @sup-philipp-spiess: I need some help! (Name: Philipp Spieß, Email: hello@philippspiess.com)

Thats easy, right? Here is how a reply looks.

    Philipp S.: @sup-philipp-spiess What can I do for you?
    SupportBot: I've send @sup-philipp-spiess the message.
    SupportBot: @sup-philipp-spiess: Buy me some chicken wings!!
    Philipp S.: @sup-philipp-spiess Sure!
    SupportBot: I've send @sup-philipp-spiess the message.

**Wow, thats cool. But what if the user disconnect or refreshes the client?**

Well, this is done via the so-called "DelayedSpam". It tries to connect the user up to 10 times in 1 second delays. If there is no user after that time, it tells you that sending the message has failed and you may retry it or send the user an email. Cool, right?

**But this would meen that Heroku has my data?**

Unfortunately. But there is no persistence, so everything Heroku get are the proxying stuff, and after the message has been sent, it's gone. Note, that the messages is always send via SSL, Heroku offers free and already-set-up client certificates for *.herokuapp.com and Campfire does the same.

**No persistence?**

Thats right. Sessions are stored within an array. All the message data is directly sent to Campfire. So you can have a look at your Campfire logs. Thats all the magic.

How to Contribute?
------------------

Do what ever you want to. I may have no time for it. Want to add some tets? Cool. Want to design the UI? Cool. Want to add new services? Again, cool. Just fork the repo and do the hacking skill.

Licence
-------

MIT, of course.

Known issues
------------

  - Customers could have the same nickname.
  - It has do be tested m0ar
  - Minify the Javascript
  - Allow to auth the user via the url. (eg: via GET parameters)
  - Abstraction and *loads* of code cleanup. Sorry :>
  - Add persistence
  - Keep chat history after refresh
  - Write tutorial on how to deploy
  - At least a minimalistic UI would be great
  - Adding tests and Travis-CI


--
Greetings from Austria, Philipp
