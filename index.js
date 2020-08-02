//Engine

const { create, decryptMedia } = require('@open-wa/wa-automate');
const fs = require('fs-extra');
const moment = require('moment')
const fbvid = require('fbvideos'); //npm install --save fbvideos
const malScraper = require('mal-scraper');
const anime_Name = 'Sakura Trick'
var quote_Array = ["“You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.”– Dr. Suess", "“I’m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can’t handle me at my worst, then you sure as hell don’t deserve me at my best.”– Marilyn Monroe", "“Get busy living or get busy dying.”– Stephen King", '"Time moves in one direction, memory in another." \n~ William Gibson', '"The sky above the port was the color of television, tuned to a dead station." \n~ William Gibson', '"Before you diagnose yourself with depression or low self-esteem, first make sure that you are not, in fact, just surrounded by assholes." \n~ William Gibson', '"When you want to know how things really work, study them when they\'re coming apart." \n~ William Gibson', '"Anything that can be done to a rat can be done to a human being. And we can do most anything to rats. This is a hard thing to think about, but it\'s the truth. It won\'t go away because we cover our eyes. THAT is cyberpunk." \n~ Bruce Sterling', '"Japan is a wonderful country, a strange mixture of ancient mystique and cyberpunk saturation. It\'s a monolith of society\'s achievements, yet maintains a foothold in the past, creating an amazing backdrop for tourings and natives alive. Japan captures the imagination like no other. You never feel quite so far from home as you do in Japan, yet there are no other people on the planet that make you feel as comfortable." \n~ Corey Taylor', '“Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.” \n– Mark Twain', '“When I dare to be powerful – to use my strength in the service of my vision, then it becomes less and less important whether I am afraid.” \n– Audre Lorde', '“Those who dare to fail miserably can achieve greatly.” \n– John F. Kennedy', '“Love yourself first and everything else falls into line. You really have to love yourself to get anything done in this world.” \n– Lucille Ball', '“It is our choices, that show what we truly are, far more than our abilities.”\n– J. K Rowling', '“If you want to be happy, be.” \n– Leo Tolstoy', '“If you want to live a happy life, tie it to a goal, not to people or things.” \n– Albert Einstein', '“I never knew how to worship until I knew how to love.” \n– Henry Ward Beecher', '“Life is trying things to see if they work.” \n– Ray Bradbury', '“If life were predictable it would cease to be life, and be without flavor.” \n– Eleanor Roosevelt', '“Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.” \n– Bil Keane', '“You miss 100 percent of the shots you never take.” \n– Wayne Gretzky', '“Always forgive your enemies; nothing annoys them so much.” \n– Oscar Wilde']

const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    devtools: false,
    cacheEnabled:false,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
}

// To find OS platform to locate browser
const opsys = process.platform;
if (opsys == "win32" || opsys == "win64") {
serverOption['executablePath'] = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
} else if (opsys == "linux") {
serverOption['browserRevision'] = '737027';
} else if (opsys == "darwin") {
serverOption['executablePath'] = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const startServer = async (from) => {
create('Imperial', serverOption)
        .then(client => {
            console.log('[SERVER] Server Started!')

            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[State Changed]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            });

            client.onMessage((message) => {
                msgHandler(client, message)
            });
        });
}


// Message Handler || Recieving and Replying

freedomurl = "https://i.ibb.co/6J9ST0d/IMG-20200731-WA0791.jpg"

async function msgHandler (client, message) {
    try {
        // console.log(message)
        const { type, body, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message
        const { id, pushname } = sender
        const { name } = chat
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = ['#sticker', '#You are idiot', '#you are idiot', '#you are baka', '#you are bakka', '#YOU ARE IDIOT', '#You are bakka','#quotes', "#Quotes", '#stiker', '#hello','#info','#commands','#God','#Thank you','#I love you','#Seasonal anime','fuck','Fuck','sex','Sex','nudes','Link','Zelda','#Best girl','#S-1','#Do you love me','#tsundere','#Tsundere','Ora ora ora ora','ora ora ora ora','Ora Ora Ora Ora','Muda Muda Muda Muda','muda muda muda muda','Muda muda muda muda','yo','freedom','Freedom','#Zelda Timeline','#Botw','I love Rem','i love rem','I Love Rem','i love Rem','El Psy Congroo','Tuturu','Indeed','Can you beat Goku though','Se no','Mou','Kokoro','#neko','#wallpaper','#source','#sauce','#fb','Heave ho','Heave ho!','Make me a coffee','#Mystery Video','Never gonna','never gonna','never gonna run around','#Pokemon','#waifu','#waifu']
        const cmds = commands.map(x => x + '\\b').join('|')
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''

        if (cmd) {
            if (!isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname))
            if (isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(name))
            const args = body.trim().split(' ')
            switch (cmd[0]) {
                case '#sticker':
                case '#stiker':
                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (args.length == 2) {
                        var isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
                        const url = args[1]
                        if (url.match(isUrl)) {
                            await client.sendStickerfromUrl(from, url, { method: 'get' })
                                .catch(err => console.log('Caught exception: ', err))
                        } else {
                            client.sendText(from, 'Url is invalid')
                        }
                    } else {
                        client.sendText(from, 'You did not quote a picture, Baka! To make a sticker, send an image with "#sticker" as caption')
                    }
                    break;
                case '#hello':
                        await client.simulateTyping(from, true);
                        client.sendText(from, 'Hello there, How can I help?');
                        await client.simulateTyping(from, false);
                        break;
                case '#I love you':
                    break;
                case 'Make me a coffee':
                        client.sendText(from, 'Make it yourself, lazy baka *hmph*');
                    break;
        case '#I love you':
                        client.sendText(from, 'T-Thanks I-I mean *looks away blushing*');
                        break;
                case '#God':
                        client.sendText(from, '@Hooman|Neko is God');
                case '#Do you love me?':
                        client.sendText(from, 'U-Uh... n-no! *blushes* O-Of course not, bakka!');
                        break;
                case '#Fuck' :
                case '#fuck' :
                        client.sendText(from, 'Hmph! *crosses arms* Take that back!');
                        break;
                case '#sex':
                case '#Sex':
                case '#nudes':
                case '#porn':
                        client.sendText(from, 'Go home, you are horny!');
                        break;
                case '#Seasonal anime':
                    break;
                 case 'Se no':
                        client.sendText(from, 'Demo sonnan ja dame')
                    break;
                 case 'Mou':
                        client.sendText(from, 'sonnan ja hora')
                    break;
                 case 'Kokoro':
                        client.sendText(from, 'wa shinka suru yo Motto motto')
                    break;
                case '#Best girl':
                        client.sendText(from, '*Blushes*')
                    break;
                case 'Zelda' :
                        client.sendText(from, 'Link')
                    break;
                case 'Indeed' :
                        client.sendText(from, 'Pathetic')
                    break;
                case 'Link' :
                        client.sendText(from, 'Zelda')
                    break;
               case 'Can you beat Goku though' :
                        client.sendText(from, '*I can and I will*')
                    break;
                case 'freedom' :
                        client.sendFileFromUrl(from, 'https://i.ibb.co/6J9ST0d/IMG-20200731-WA0791.jpg','freedom.jpg','...')
                    break;
                case '#Botw' :
                        client.sendFileFromUrl(from, 'https://mocah.org/uploads/posts/197514-princess-zelda-2350x1175.png','BOTW.jpg','...')
                    break;
                case '#Zelda Timeline' :
                        client.sendFileFromUrl(from, 'https://gamepedia.cursecdn.com/zelda_gamepedia_en/b/b8/E_Timeline.png','Zelda Timeline.png','...')
                    break;
                case '#S-1':
                        client.sendText(from, 'Connection Status = Active')
                    break;
                case 'El Psy Congroo':
                        client.sendFileFromUrl(from, 'https://i.ibb.co/s9Rw8hN/index.jpg','Steins;Gate.jpg','El Psy Congroo')
                    break;
                case '#Do you love me':
                        client.sendText(from, 'U-Uh... n-no! *blushes* O-Of course not, idiot!')
                    break;
                case 'I love Rem' :
                case 'i love rem' :
                case 'I love rem' :
                case 'I Love Rem' :
                        client.sendText(from, 'Who is Rem?');
                    break;
                case 'yo':
                        client.sendText(from, 'Hiya *High-fives*');
                    break;
                case 'Never gonna':
                        client.sendText(from, 'give you up');
                    break;
                case 'never gonna':
                        client.sendText(from, 'Let you down');
                    break;
                case 'Never gonna run around':
                        client.sendText(from, 'and dessert you');
                    break;
                case '#Waifu':
                case '#waifu': 
                        q8 = q2 = Math.floor(Math.random() * 98) + 10;
                        client.sendFileFromUrl(from, 'http://randomwaifu.altervista.org/images/00'+q8+'.png', 'Waifu.png', 'How is she?'); // UwU)/ Working Fine
                    break;
                case 'Heave ho':
                case 'Heave ho!':
                        client.sendFileFromUrl(from, 'https://i.ibb.co/KjJx5ps/Whats-App-Image-2020-08-01-at-16-36-10.jpg','Soran.jpg','*Soran Soran*');
                    break;
                case '#neko':          
                        q2 = Math.floor(Math.random() * 900) + 300;
                        q3 = Math.floor(Math.random() * 900) + 300;
                        client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ');
                    break;
                 case '#Pokemon':
                        q7 = Math.floor(Math.random() * 890) + 1;
                        client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',);
                    break;
                case '#wallpaper' :
                       q4 = Math.floor(Math.random() * 800) + 100;
                       client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/anime-'+q4,'Anime.png','Here is your wallpaper');
                    break;
                case '#Tsundere' :
                case '#tsundere' : 
                        client.sendText(from, 'I am not a tsundere, baka!');     
                    break;
                case '#Mystery Video':
                        client.sendText(from, 'https://youtu.be/dQw4w9WgXcQ');
                        break;
                case '#fb':
                    if (args.length >=2) {
                        const urlvid = args[1]
                        const high = await fbvid.high(urlvid)
                        const low = await fbvid.low(urlvid)
                        if (high == "Either the video is deleted or it's not shared publicly!") {
                            client.sendFileFromUrl(from, low.url, "video.mp4", "SD Video successfully downloaded")
                        } else if (high !== "Either the video is deleted or it's not shared publicly!") {
                            client.sendFileFromUrl(from, high.url, "video.mp4", "HD Video successfully downloaded")
                        } else if (high == "Either the video is deleted or it's not shared publicly!" && low == "Either the video is deleted or it's not shared publicly!") {
                            client.reply(from,"The URL is invalid",message)
                        }
                    } else {
                        client.reply(from,"The format is #fb [URL Video]",message)
                    }
                    break;
                case 'sex' :
                case 'Sex' :
                case 'nudes' :
                case 'porn' :
                        client.sendText(from, 'Go home, you are horny!')
                    break;
                case 'ora ora ora ora' :
                case 'Ora Ora Ora Ora' :
                case 'Ora ora ora ora' :
                        client.sendText(from, 'Muda Muda Muda Muda')
                    break;
                case 'Muda Muda Muda Muda' :
                case 'Muda muda muda muda' :
                case 'muda muda muda muda' :
                        client.sendText(from, 'Ora Ora Ora Ora')
                    break;
        case '#commands':
                        client.sendText(from, '👋️Hi there\n\nKey:\n\n#example \n-Function\n\n💻️Commands\n\n#sticker \nTurns sticker to images⛩️ \n\n#neko\nReturns a random cat image🐈️\n\n#Quotes or #quotes\nReturns a quote that will either give you existential crises or wisdom\n\n#Pokemon Displays picture of a random pokemon \n \n#wallpaper \nSends a random anime wallpapers (beta) 🌌️\n\n#Seasonal anime \nReturns a list of seasonal animes🌆️\n\n#info \nDisplays the the terms and conditions & info📒️\n\n *There are many hidden and fun keywords* ;)')
                    break;
        case '#Seasonal anime':
                        client.sendText(from, 'Summer 2020 \n Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season \n Yahari Ore no Seishun Love Comedy wa Machigatteiru. Kan \n The God of High School \n Sword Art Online: Alicization - War of Underworld 2nd Season \n Enen no Shouboutai: Ni no Shou \n Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e \n Kanojo, Okarishimasu \n Deca-Dence \n Uzaki-chan wa Asobitai! \n Monster Musume no Oishasan')
                        break;
                case '#Thank you':
                        client.sendText(from, 'Whatever... *smiles*') 
                        break;
                case '#TnC':
                        client.sendText(from, 'This is an open-source program written in Javascript. \n \nBy using the bot you agreeing to our Terms and Conditions \n \nTerms and conditions \n \nYour texts and your whatsapp username will be stored on our servers as long as the bot is active, your data will be erased when the bot goes offline. We do NOT store the images, videos, audio files and documents you send. We will never ask you to sign up or ask you for any of your passwords, OTPs or PINs. \n \n Thank you, Have a great day! \n \n Learn More about the bot: https://bit.ly/39Ld2L8 \n \n - Developers');
                        break;
                case '#info':
                        client.sendText(from, )   
                        break;
                case 'Make me a coffee':
                        await client.simulateTyping(from, true)
                        client.sendText(from, 'Do it yourself, lazy ass *hmph*')
                        await client.simulateTyping(from, false)
                        break;
                case '#You are idiot':
                case '#you are idiot':
                        client.sendText(from, 'Shut up, douchebag');
                        break;
                case '#you are baka':
                        client.sendText(from, "I'll smack on your gut so hard that you will cry for mommy!")
                        break;
                case '#You are bakka':
                case '#you are bakka':
                        client.sendText(from, 'I believe hell will wipe itself when you will go there!');
                        break;
                case 'YOU ARE IDIOT':
                        client.sendText(from, 'Shuddup! Aho!!!!!');
                        break;

                case '#quotes':
                case '#Quotes':
                        a2 = Math.floor(Math.random() * 22);
                        client.sendText(from, quote_Array[a2]);
                            //MAKE SURE TO USE ; at the end of statement :)

                     }
        } else {
            if (!isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
            if (isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

// Handling Error Here 
process.on('Something went wrong', function (err) {
    console.log('Caught exception: ', err);
  });

function color (text, color) {
  switch (color) {
    case 'red': return '\x1b[31m' + text + '\x1b[0m'
    case 'yellow': return '\x1b[33m' + text + '\x1b[0m'
    default: return '\x1b[32m' + text + '\x1b[0m' // default is green
  }
}

//Starting Server
startServer();
