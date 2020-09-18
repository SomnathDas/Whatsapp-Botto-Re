const { watchFile } = require("fs-extra");
var songLine = 0


function neverGonnaGiveUUp(client, from, cmd)
{
    if (('' + cmd).toLowerCase() == 'never gonna') {
        if (!songLine) {
            client.sendText(from, 'give you up');
            songLine++;
        } else if (songLine == 1) {
            client.sendText(from, 'let you down');
            songLine++;
        } else if (songLine == 2) {
            client.sendText(from, 'run around, and desert you');
            songLine++;
        } else if (songLine == 3) {
            client.sendText(from, 'make you cry');
            songLine++;
        } else if (songLine == 4) {
            client.sendText(from, 'say goodbye');
            songLine++;
        } else if (songLine == 5) {
            client.sendText(from, 'tell a lie, and hurt you');
            songLine++;
        } else {
            client.sendText(from, 'give you up');
            songLine = 1;
        }
    }
}

function  notListed(client, from, cmd, pushname) {
    
    var newcmd = (('' + cmd).toLowerCase());

    if (newcmd === '#hello') {
        client.sendText(from, 'Hello there how can I help?')
        return
    } 
    else if (newcmd === 'test') {
        client.sendText(from, 'the bot is currently online and runing')
        return
    } 
    else if (newcmd === 'make me a coffee') {
        client.sendText(from, 'Make it yourself, lazy baka *hmph*')
        return
    } 
    else if (newcmd === '#i love you') {
        client.sendText(from, 'T-Thanks I-I mean *looks away blushing*')
        return
    } 
    else if (newcmd === '#do you love me?') {
        client.sendText(from, 'U-Uh... n-no! *blushes* O-Of course not, bakka!')
        return
    } 
    else if (newcmd === 'god') {
        client.sendText(from, '@Kanui|EncryptionSuccess is God')
        return
    } 
    else if (newcmd === 'and the silence remains') {
        client.sendText(from, 'As always')
        return
    } else if (newcmd === 'fuck') {
        client.sendText(from, 'Hmph! *crosses arms* Take that back!')
        return
    } else if (newcmd === 'mily x yagu') {
        client.sendText(from, 'Mily x Yagu Forever✨️')
        return
    } else if (newcmd === 'mou') {
        client.sendText(from, 'sonnan ja hora')
        return
    } else if (newcmd === 'kokoro') {
        client.sendText(from, 'wa shinka suru yo Motto motto')
        return
    } else if (newcmd === 'zelda') {
        client.sendText(from, 'Link')
        return
    }   else if (newcmd === 'indeed') {
        client.sendText(from, 'Pathetic')
        return
    } else if (newcmd === 'link') {
        client.sendText(from, 'Zelda')
        return
    } else if (newcmd === '#best girl') {
        client.sendText(from, '*Blushes*')
        return
    } else if (newcmd === 'se no') {
        client.sendText(from, 'Demo sonnan ja dame')
        return
    } else if (newcmd === '#faq') {
        client.sendText(from, '👋️Hello '+`${pushname}`+'\n\nSupport Group; https:\/\/bit.ly\/2CaPFyk\nGithub: https:\/\/bit.ly\/39Ld2L8\n\nThese are some of the frequently asked questions\n\nQ: Why was this bot created?\nA: We the developers wanted to increase our knowledge in JavaScript at the same time giving bac to the community\n\nQ: Will the bot ban you if you use unlisted commands?\nA: No, we\'ll not ban you if you use unlisted commands because every person isn\'t perfect, a person will make a typo or two, so we do not punish you\n\nQ: Will the bot ban you if you call the bot?\nA: No, But the bot can\'t pickup the call. Humans make mistake. we are not gonna punish you for that. Our bot is able to ban as well as block people but we won\'t do that. \n\nQ: How to make a bot like \"Emilia\"?\nA: You need to know JavaScript and Node.js If you want to, you can use our code for creating your bot. It\'d be great if you credit us if you do so, it is not necessary though.\n\nQ: Does the bot go offline?\nA: Yes, The bot services will go down for 6 or so hours because our servers are limited. The bot will be able to run for 24\/7 soon.\n \nQ: How to use the bot?\nA: Send \"#help\" to see the usable commands.\n\nQ: Who are \"Link\" and \"Zelda\"?\nA: Link and Zelda are the main charterers from The Legend of Zelda Video Game series. \n\n✨️Hope you have fun using our bot! Have a great day\n\n')
        return
    } else if (newcmd === 'can you beat goku though') {
        client.sendText(from, '*I can and I will*')
        return
    } else if (newcmd === '#s-1') {
        client.sendText(from, 'Connection Status = Active')
        return
    } else if (newcmd === 'i love rem') {
        client.sendText(from, 'Who is Rem?')
        return
    } else if (newcmd === 'yo') {
        client.sendText(from, 'Hiya *High-fives*')
        return
    } else if (newcmd === '#tsundere') {
        client.sendText(from, 'I am not a tsudere, baka!')
        return
    } else if (newcmd === '#mystery video') {
        client.sendText(from, 'https://youtu.be/dQw4w9WgXcQ')
        return
    } else if (newcmd === 'sex' | 'nudes' | 'porn') {
        client.sendText(from, 'Go home, you are horny!')
        return
    } else if (newcmd === 'ora ora ora ora') {
        client.sendText(from, 'Muda Muda Muda Muda')
        return
    } else if (newcmd === 'muda muda muda muda') {
        client.sendText(from, 'Ora Ora Ora Ora')
        return
    } else if (newcmd === '#commands') {
        client.sendText(from, '👋️Hi *${pushname}*, I\'m Emilia!\n\n*Prefix = #* 💎\n\n*Usable Commands!*✨\n\n*_CMD: #sticker_*\n*Description: Converts images into stickers*\n\n*_CMD: #anime <anime name>_*\n*Description: Displays the information of the given anime*\n\n*_CMD: #flip_*\n*Description: Flips a coin fo you*\n\n*_CMD: #roll_*\n*Description: Rolls a dice*\n\n*_CMD: #neko_*\n*Description Returns a random cat image*\n\n*_CMD: #meme_*\n*Description: Displays and anime meme from r\/wholesomeanimememes*\n\n*_CMD: #sr <subreddit>_*\n*Description: Returns a post from the given subreddit*\n\n*_CMD: #waifu_*\n*Description: Returns a picture of a waifu*\n\n*_CMD: #covid <country name>_*\n*Description: Displays the live stats Covid-19 of the given country*\n\n*_CMD: #quotes_*\n*Description: Returns a quote that will either give you existential crises or wisdom*\n\n*_CMD #pokemon_*\n*Description: Displays picture of a random pokemon*\n\n*_CMD: #wallpaper [Beta]_*\n*Displays a random anime wallpapers*\n\n*_CMD: #Seasonal anime_* [Bugged]\n*Description: Returns a list of seasonal animes*\n\n*_CMD: #info_*\n*Description: Displays the information of the bot*\n\n*_CMD: #TnC_*\n*Description: Displays the Terms and Conditions*\n\nThere are many hidden and fun keywords ;)\n\nIf yore having any trouble with the bot, please join our support group and state your issue\n\n*Support: https://bit.ly/2CaPFyk*\n\nHope you have a great day!✨\n\n')
        return
    } else if (newcmd === '#Seasonal anime') {
        client.sendText(from, 'Summer 2020 \n Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season \n Yahari Ore no Seishun Love Comedy wa Machigatteiru. Kan \n The God of High School \n Sword Art Online: Alicization - War of Underworld 2nd Season \n Enen no Shouboutai: Ni no Shou \n Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e \n Kanojo, Okarishimasu \n Deca-Dence \n Uzaki-chan wa Asobitai! \n Monster Musume no Oishasan')
        return
    } else if (newcmd === '#you are idiot') {
        client.sendText(from, 'Shut up, douchbag')
        return
    } else if (newcmd === 'never gonna') {
        client.sendText(from, neverGonnaGiveUUp(client, from, cmd))
        return
    } else if (newcmd === '#leave') {
        if(isGroupMsg){
            if (`${ContactId}` == '919744375687@c.us') {
        client.sendText(from,'Sayonara')
        client.leaveGroup(from)
            }
        }
        return
    } else if (newcmd === 'se no') {
        client.sendText(from, 'Demo sonnan ja dame')
        return
    } else if (newcmd === 'el psy congroo') {
        client.sendFileFromUrl(from, 'https://i.ibb.co/s9Rw8hN/index.jpg','Steins;Gate.jpg','El Psy Congroo')
        return
    } else if (newcmd === 'heave ho' | 'heave ho!') {
        client.sendFileFromUrl(from, 'https://i.ibb.co/KjJx5ps/Whats-App-Image-2020-08-01-at-16-36-10.jpg','Soran.jpg','*Soran Soran*');
        return
    } else if (newcmd === '#you are idiot') {
        client.sendText(from, 'Shut up, douchebag');
        return
    } else if (newcmd === '#you are baka') {
        client.sendText(from, "I'll smack on your gut so hard that you will cry for mommy!")
        return
    } else if (newcmd === '#you are bakka') {
        client.sendText(from, 'I believe hell will wipe itself when you will go there!')
        return
    } else if (newcmd === 'prepare for trouble') {
        client.sendText(from, 'And make it double!')
        return
    } else if (newcmd === 'to protect the world from devastation') {
        client.sendText(from, 'To unite all peoples within our nation!')
        return
    } else if (newcmd === 'to denounce the evils of truth and love') {
        client.sendText(from, 'to extend our reach to the stars above!')
        return
    } else if (newcmd === 'team Rocket blasts off at the speed of light') {
        client.sendText(from, 'Surrender now, or prepare to fight!')
        return
    } else if (newcmd === '#codesyaknow') {
        var culture_code;
        culture_code = Math.floor(Math.random() * 100001) + 10000;
        client.sendText(from, "Here you go b-ba-baka \n" + culture_code);
        return
    } else if (newcmd === '#sauceyaknow') {
        var culture_code;
        culture_code = Math.floor(Math.random() * 100001) + 10000;
        var sauce_Yaknow = "https://nhentai.net/g/" + culture_code;
        client.sendText(from, sauce_Yaknow);
    } else if (newcmd === '#botw') {
        client.sendFileFromUrl(from, 'https://mocah.org/uploads/posts/197514-princess-zelda-2350x1175.png','BOTW.jpg','...')
    } else if (newcmd === 'freedom') {
        client.sendFileFromUrl(from, 'https://i.ibb.co/6J9ST0d/IMG-20200731-WA0791.jpg','freedom.jpg','...')
    } else if (newcmd === '#rem') {
        q12 = Math.floor(Math.random() * 9) + 1
        client.sendFileFromUrl(from, 'http://0.0.0.0:8082/Rem/'+q12+'.png', 'Rem.png','Rem ✨️')
    }


}


module.exports = {
     
    notListed
    
}
