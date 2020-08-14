const { create, decryptMedia } = require('@open-wa/wa-automate')
const moment = require('moment')
const color = require("./lib/color")
const malScraper = require('mal-scraper')
const randomAnimeWallpapers = require('random-anime-wallpapers')
const config = require('./config.json')
const jikanjs  = require('jikanjs');
const axios = require('axios')
const akaneko = require('akaneko');

var randomAnime = require("random-anime")
var info = require('./info')
var culture_code; //IGNORE THESE LINES THESE LINES ARE ONLY FOR MY FELLO MEN OF CULTURE DEVs
var sauce_Yaknow = "https://nhentai.net/g/" + culture_code; // IGNORE THESE LINES
var quote_Array = ["“You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.”– Dr. Suess", "“I’m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can’t handle me at my worst, then you sure as hell don’t deserve me at my best.”– Marilyn Monroe", "“Get busy living or get busy dying.”– Stephen King", '"Time moves in one direction, memory in another." \n~ William Gibson', '"The sky above the port was the color of television, tuned to a dead station." \n~ William Gibson', '"Before you diagnose yourself with depression or low self-esteem, first make sure that you are not, in fact, just surrounded by assholes." \n~ William Gibson', '"When you want to know how things really work, study them when they\'re coming apart." \n~ William Gibson', '"Anything that can be done to a rat can be done to a human being. And we can do most anything to rats. This is a hard thing to think about, but it\'s the truth. It won\'t go away because we cover our eyes. THAT is cyberpunk." \n~ Bruce Sterling', '"Japan is a wonderful country, a strange mixture of ancient mystique and cyberpunk saturation. It\'s a monolith of society\'s achievements, yet maintains a foothold in the past, creating an amazing backdrop for tourings and natives alive. Japan captures the imagination like no other. You never feel quite so far from home as you do in Japan, yet there are no other people on the planet that make you feel as comfortable." \n~ Corey Taylor', '“Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.” \n– Mark Twain', '“When I dare to be powerful – to use my strength in the service of my vision, then it becomes less and less important whether I am afraid.” \n– Audre Lorde', '“Those who dare to fail miserably can achieve greatly.” \n– John F. Kennedy', '“Love yourself first and everything else falls into line. You really have to love yourself to get anything done in this world.” \n– Lucille Ball', '“It is our choices, that show what we truly are, far more than our abilities.”\n– J. K Rowling', '“If you want to be happy, be.” \n– Leo Tolstoy', '“If you want to live a happy life, tie it to a goal, not to people or things.” \n– Albert Einstein', '“I never knew how to worship until I knew how to love.” \n– Henry Ward Beecher', '“Life is trying things to see if they work.” \n– Ray Bradbury', '“If life were predictable it would cease to be life, and be without flavor.” \n– Eleanor Roosevelt', '“Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.” \n– Bil Keane', '“You miss 100 percent of the shots you never take.” \n– Wayne Gretzky', '“Always forgive your enemies; nothing annoys them so much.” \n– Oscar Wilde']

const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    cacheEnabled: false,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
}

const opsys = process.platform;
if (opsys === "win32" || opsys === "win64") {
    serverOption['executablePath'] = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
} else if (opsys === "linux") {
    serverOption['browserRevision'] = '737027';
} else if (opsys === "darwin") {
    serverOption['executablePath'] = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const startServer = async (from) => {
create('Imperial', serverOption)
        .then(client => {
            console.log('[DEV] Ban Takahiro')
            console.log('[SERVER] Server Started!')

            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })

            client.onMessage((message) => {
                msgHandler(client, message)
            })
        })
}

async function msgHandler (client, message) {
    try {
        const { type, body, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, chatId, ContactId } = message
        const { pushname } = sender
        const { formattedTitle } = chat
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = ['#menu','#help','#sticker','#sauceyaknow','#Sauceyaknow','#codesyaknow' ,'#Codesyaknow', '#TnC', '#You are idiot', '#you are idiot', '#you are baka', '#you are bakka', '#YOU ARE IDIOT', '#You are bakka','#quotes', "#Quotes", '#stiker', '#hello','#info','#commands','#God','#Thank you','#I love you','#Seasonal anime','#anime','#Anime','fuck','Fuck','sex','Sex','nudes','Link','Zelda','#Best girl','#S-1','#Do you love me','#tsundere','#Tsundere','Ora ora ora ora','ora ora ora ora','Ora Ora Ora Ora','Muda Muda Muda Muda','muda muda muda muda','Muda muda muda muda','yo','freedom','Freedom','#Zelda Timeline','#Botw','I love Rem','i love rem','I Love Rem','i love Rem','El Psy Congroo','Tuturu','Indeed','Can you beat Goku though','Se no','Mou','Kokoro','#neko','#wallpaper','#source','#sauce','Heave ho','Heave ho!','Make me a coffee','#Mystery Video','Never gonna','never gonna','never gonna run around','#Pokemon','#waifu','#waifu','Mily x Yagu','#Pokewall','#pokewall','#wiki','Prepare for trouble','To protect the world from devastation','To denounce the evils of truth and love','#R','Team Rocket blasts off at the speed of light','#Emilia','#emilia','#sauce','#Sauce','#Rem','#rem', '#tiktok', '#ig', '#instagram', '#twt', '#twitter', '#fb', '#facebook','#groupinfo','#meme','#covid','#sr','#SR','#Sr','#Test','#manga','#user','#TestGif','#kick','#leave','#add','#FAQ','#Faq','#profile','And the silence remains','and the silence remains','#flip','#roll','#animeneko']
        const cmds = commands.map(x => x + '\\b').join('|')
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : '' 

        if (cmd) {
            if (!isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname))
            if (isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(formattedTitle))
            const args = body.trim().split(' ')
            const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
            switch (cmd[0]) {
                case '#menu':
                case '#help':
                    client.sendText(from,`👋️Hi *${pushname}*, I\'m Emilia!\n\n*Prefix = #* 💎\n\n*Usable Commands!*✨\n\n*_CMD: #sticker_*\n*Description: Converts images into stickers*\n\n*_CMD: #anime <anime name>_*\n*Description: Displays the information of the given anime*\n\n*_CMD: #flip_*\n*Description: Flips a coin fo you*\n\n*_CMD: #roll_*\n*Description: Rolls a dice*\n\n*_CMD: #neko_*\n*Description Returns a random cat image*\n\n*_CMD: #meme_*\n*Description: Displays and anime meme from r\/wholesomeanimememes*\n\n*_CMD: #sr <subreddit>_*\n*Description: Returns a post from the given subreddit*\n\n*_CMD: #waifu_*\n*Description: Returns a picture of a waifu*\n\n*_CMD: #covid <country name>_*\n*Description: Displays the live stats Covid-19 of the given country*\n\n*_CMD: #quotes_*\n*Description: Returns a quote that will either give you existential crises or wisdom*\n\n*_CMD #pokemon_*\n*Description: Displays picture of a random pokemon*\n\n*_CMD: #wallpaper [Beta]_*\n*Displays a random anime wallpapers*\n\n*_CMD: #Seasonal anime_* [Bugged]\n*Description: Returns a list of seasonal animes*\n\n*_CMD: #info_*\n*Description: Displays the information of the bot*\n\n*_CMD: #TnC_*\n*Description: Displays the Terms and Conditions*\n\nThere are many hidden and fun keywords ;)\n\nIf yore having any trouble with the bot, please join our support group and state your issue\n\n*Support: https://bit.ly/2CaPFyk*\n\nHope you have a great day!✨\n\n`)
                    break;
                case '#hello':
                        await client.simulateTyping(from, true);
                        client.sendText(from, 'Hello there, How can I help?');
                        await client.simulateTyping(from, false);
                        break;
              	case '#grouplink':
			if(isGroupMsg){
			        const inviteLink = await client.getGroupInviteLink(chat.id);
				client.sendLinkWithAutoPreview(from, inviteLink)
}
                      break;
                case '#groupinfo':
                         const groupchat = await client.getChatById(chatId);
                         const {owner, user, desc} = groupchat.groupMetadata
                             client.sendText(from, '*'+formattedTitle+'*\n🌠️\n✨️ Description:\n '+`${desc}`)
                    break;
               		case '#leave':
			if(isGroupMsg){
                             if (`${ContactId}` == '919744375687@c.us') {
				client.sendText(from,'Sayonara')
				client.leaveGroup(from)
 }
}
               break;
                case 'Make me a coffee':
                        client.reply(from, 'Make it yourself, lazy baka *hmph*');
                    break;
                case '#I love you':
                        client.reply(from, 'T-Thanks I-I mean *looks away blushing*');
                        break;
                case '#animeneko':
                        client.sendFileFromUrl(from, akaneko.neko(), 'neko.jpg', 'Neko *Nyaa*~')
                        break
                case '#roll':
                        const dice = Math.floor(Math.random() * 6) + 1
                        await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice'+dice+'.png')  
                        break;
                case '#flip':
                       const side = Math.floor(Math.random() * 2) + 1
                      if (side == 1){
                        client.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
                        }
                       else {
                            client.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
                          }
             break;
                       case '#add':
                        await client.addParticipant('919744375687-1596199727@g.us', `${ContactId}`)
                        break
                case '#God':
                        client.sendText(from, '@Hooman|Neko is God');
                        break
                case '#Do you love me?':           
                        client.sendText(from, 'U-Uh... n-no! *blushes* O-Of course not, bakka!');
                        break;
                 case 'And the silence remains':   
                 case 'and the silence remains':        
                        client.sendText(from, 'As always');
                        break;
                case '#Fuck' :
                case '#fuck' :
                        client.sendText(from, 'Hmph! *crosses arms* Take that back!');
                        break;
                case '#Seasonal anime':
                    break;
                 case 'Se no':
                        client.sendText(from, 'Demo sonnan ja dame')
                 case '#profile':
                           const {image_url, gender} = await jikanjs.loadUser('Bantakahiro01')
                           await client.sendFileFromUrl(from, `${image_url}`, 'profile.png', `${pushname}`+'Profile Test one')
                    break;
                 case 'Mily x Yagu':
                        client.sendText(from, 'Mily x Yagu Forever✨️')
                    break;
                 case 'Mou':
                        client.sendText(from, 'sonnan ja hora')
                    break;
                 case 'Kokoro':
                        client.sendText(from, 'wa shinka suru yo Motto motto')
                    break
                 case '#Test':
                        client.sendImageAsStickerGif(from, 'https://i.imgur.com/31zUM5g.gif')
                    break;
                case '#Best girl':
                        client.sendText(from, '*Blushes*')
                   break;
                case '#TestGif' :
                        client.sendStickerfromUrl(from, 'https://media.tenor.com/images/62c4b269d97c2412c4f364945f62afae/tenor.gif', {method: 'get'})
                     
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
                case '#user':
                     const username = 'BanTakahiro01'
                     const after = 25
                     const type = 'anime' // can be either `anime` or `manga`
 
                     // Get you an object containing all the entries with status, score... from this user's watch list
                    malScraper.getWatchListFromUser(username, after, type)
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err))
                    break;
                case '#anime':
                      if (args.length >=5) {
                         const a1 = args[1]
                         const a2 = args[2]
                         const a3 = args[3]              
                         const a4 = args[4]
                         const { title, picture, score, synopsis, episodes, aired, rating, status } = await malScraper.getInfoFromName(a1+'-'+a2+'-'+a3+'-'+a4)

                         await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:'+`${title}`+'\n\n🎼️Score:'+`${score}`+'\n\n📙️Status:'+`${status}`+'\n\n🖼️Episodes:'+`${episodes}`+'\n\n✨️Rating:'+`${rating}`+'\n\n🌠️Synopsis:'+`${synopsis}`+'\n\n📆️Aired:'+`${aired}`+'.')
                    
                  } else if (args.length >=4) {
                         const a1 = args[1]
                         const a2 = args[2]
                         const a3 = args[3]
                         const { title, picture, score, synopsis, episodes, aired, rating, status } = await malScraper.getInfoFromName(a1+'-'+a2+'-'+a3)

                         await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:'+`${title}`+'\n\n🎼️Score:'+`${score}`+'\n\n📙️Status:'+`${status}`+'\n\n🖼️Episodes:'+`${episodes}`+'\n\n✨️Rating:'+`${rating}`+'\n\n🌠️Synopsis:'+`${synopsis}`+'\n\n📆️Aired:'+`${aired}`+'.')
                   } else if (args.length >=3) {
                         const a1 = args[1]
                         const a2 = args[2]
                         const { title, picture, score, synopsis, episodes, aired, rating, status } = await malScraper.getInfoFromName(a1+'-'+a2)

                         await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:'+`${title}`+'\n\n🎼️Score:'+`${score}`+'\n\n📙️Status:'+`${status}`+'\n\n🖼️Episodes:'+`${episodes}`+'\n\n✨️Rating:'+`${rating}`+'\n\n🌠️Synopsis:'+`${synopsis}`+'\n\n📆️Aired:'+`${aired}`+'.')
                     } else if (args.length >=2) {
                         const animename = args[1]
                         malScraper.getInfoFromName(animename)
                         .then((data) => console.log(data))
                         .catch((err) => console.log(err))

                         const { title, picture, score, synopsis, episodes, aired, rating, status } = await malScraper.getInfoFromName(animename)

                         await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:'+`${title}`+'\n\n🎼️Score:'+`${score}`+'\n\n📙️Status:'+`${status}`+'\n\n🖼️Episodes:'+`${episodes}`+'\n\n✨️Rating:'+`${rating}`+'\n\n🌠️Synopsis:'+`${synopsis}`+'\n\n📆️Aired:'+`${aired}`+'.')
 }


                     break;'#manga'
                     if (args.length >=2) {
                         const name = args[1]
                         const type = 'manga'
                         malScraper.getInfoFromName(name)
                         .then((data) => console.log(data))
                         .catch((err) => console.log(err))
}
                     
                     break;
                case '#wiki':
                      if (args.length >=2) { 
                         const query = args[1]
                   wiki()
                      .page(query)
                      .then(page => page.info())
                      .then(console.log); 
 
                       }
                     break
                case 'Can you beat Goku though' :
                        client.sendText(from, '*I can and I will*')
                case '#Faq' :
                case '#faq' :
                case '#FAQ' :
                        client.sendText(from, '👋️Hello '+`${pushname}`+'\n\nSupport Group; https:\/\/bit.ly\/2CaPFyk\nGithub: https:\/\/bit.ly\/39Ld2L8\n\nThese are some of the frequently asked questions\n\nQ: Why was this bot created?\nA: We the developers wanted to increase our knowledge in JavaScript at the same time giving bac to the community\n\nQ: Will the bot ban you if you use unlisted commands?\nA: No, we\'ll not ban you if you use unlisted commands because every person isn\'t perfect, a person will make a typo or two, so we do not punish you\n\nQ: Will the bot ban you if you call the bot?\nA: No, But the bot can\'t pickup the call. Humans make mistake. we are not gonna punish you for that. Our bot is able to ban as well as block people but we won\'t do that. \n\nQ: How to make a bot like \"Emilia\"?\nA: You need to know JavaScript and Node.js If you want to, you can use our code for creating your bot. It\'d be great if you credit us if you do so, it is not necessary though.\n\nQ: Does the bot go offline?\nA: Yes, The bot services will go down for 6 or so hours because our servers are limited. The bot will be able to run for 24\/7 soon.\n \nQ: How to use the bot?\nA: Send \"#help\" to see the usable commands.\n\nQ: Who are \"Link\" and \"Zelda\"?\nA: Link and Zelda are the main charterers from The Legend of Zelda Video Game series. \n\n✨️Hope you have fun using our bot! Have a great day\n\n')
                    break;
                case '#pokewall' :
                case '#Pokewall' :
                       q9 = Math.floor(Math.random() * 199) + 1
                       client.sendFileFromUrl(from, 'http://localhost:8082/Pokemon/wallpapersanimesv.blogspot.com-('+q9+').jpg', 'Pokemon.jpg','Here is your Pokemon Wallpaper')
                    break
                case '#Emilia' :
                case '#emilia' :
                       q11 = Math.floor(Math.random() * 21) + 10
                       client.sendFileFromUrl(from, 'http://0.0.0.0:8082/Emilia/'+q11+'.png', 'Emilia.png','Emilia ✨️')
                    break
                case '#Rem' :
                case '#rem' :
                       q12 = Math.floor(Math.random() * 9) + 1
                       client.sendFileFromUrl(from, 'http://0.0.0.0:8082/Rem/'+q12+'.png', 'Rem.png','Rem ✨️')
                    break
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
                case '#meme':
                case '#Meme':
                     const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
                     const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
                     await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                    break;
                case '#sr':
                case '#Sr':
                case '#SR':
                     if (args.length >=4) {
                         const sr = args[1]
                         const rs = args[2]                  
                         const tr = args[3]
                         const response = await axios.get('https://meme-api.herokuapp.com/gimme/'+sr+'_'+rs+'_'+tr+'/');
                         const { postLink, title, subreddit, url, nsfw, spoiler } = response.data
                     await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
                    } else if (args.length >=3) {
                         const sr = args[1]
                         const rs = args[2]
                         const response = await axios.get('https://meme-api.herokuapp.com/gimme/'+sr+'_'+rs+'/');
                         const { postLink, title, subreddit, url, nsfw, spoiler } = response.data
                     await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
                   } else if (args.length >=2) {
                         const sr = args[1]
                         const response = await axios.get('https://meme-api.herokuapp.com/gimme/'+sr+'/');
                         const { postLink, title, subreddit, url, nsfw, spoiler } = response.data
                     await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
                    }
                    break;
                case '#covid':
                case '#Covid':
                      if (args.length >=2) {
                         const cn = args[1]             
                         const response = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/'+cn+'/');
                         const { cases, todayCases, deaths, todayDeaths, recovered, active } = response.data
                         await client.sendText(from, '🌎️Covid Info -'+cn+' 🌍️\n\n✨️Total Cases: '+`${cases}`+'\n📆️Today\'s Cases: '+`${todayCases}`+'\n☣️Total Deaths: '+`${deaths}`+'\n☢️Today\'s Deaths: '+`${todayDeaths}`+'\n⛩️Active Cases: '+`${active}`+'.')
}
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
                 case '#pokemon':
                        q7 = Math.floor(Math.random() * 890) + 1;
                        client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',);
                    break;
                case '#wallpaper' :
                     { const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/Animewallpaper');
                      const { postLink, title, subreddit, url, nsfw, spoiler } = response1.data
                      await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                      break;
}
                case '#Tsundere' :
                case '#tsundere' : 
                        client.sendText(from, 'I am not a tsundere, baka!');     
                    break;
                case '#Mystery Video':
                        client.sendText(from, 'https://youtu.be/dQw4w9WgXcQ');
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
                        client.sendText(from,`👋️Hi *${pushname}*, I\'m Emilia!\n\n*Prefix = #* 💎\n\n*Usable Commands!*✨\n\n*_CMD: #sticker_*\n*Description: Converts images into stickers*\n\n*_CMD: #anime <anime name>_*\n*Description: Displays the information of the given anime*\n\n*_CMD: #flip_*\n*Description: Flips a coin fo you*\n\n*_CMD: #roll_*\n*Description: Rolls a dice*\n\n*_CMD: #neko_*\n*Description Returns a random cat image*\n\n*_CMD: #meme_*\n*Description: Displays and anime meme from r\/wholesomeanimememes*\n\n*_CMD: #sr <subreddit>_*\n*Description: Returns a post from the given subreddit*\n\n*_CMD: #waifu_*\n*Description: Returns a picture of a waifu*\n\n*_CMD: #covid <country name>_*\n*Description: Displays the live stats Covid-19 of the given country*\n\n*_CMD: #quotes_*\n*Description: Returns a quote that will either give you existential crises or wisdom*\n\n*_CMD #pokemon_*\n*Description: Displays picture of a random pokemon*\n\n*_CMD: #wallpaper [Beta]_*\n*Displays a random anime wallpapers*\n\n*_CMD: #Seasonal anime_* [Bugged]\n*Description: Returns a list of seasonal animes*\n\n*_CMD: #info_*\n*Description: Displays the information of the bot*\n\n*_CMD: #TnC_*\n*Description: Displays the Terms and Conditions*\n\nThere are many hidden and fun keywords ;)\n\nIf yore having any trouble with the bot, please join our support group and state your issue\n\n*Support: https://bit.ly/2CaPFyk*\n\nHope you have a great day!✨\n\n`)
                    break;
        case '#Seasonal anime':
                        client.sendText(from, 'Summer 2020 \n Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season \n Yahari Ore no Seishun Love Comedy wa Machigatteiru. Kan \n The God of High School \n Sword Art Online: Alicization - War of Underworld 2nd Season \n Enen no Shouboutai: Ni no Shou \n Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e \n Kanojo, Okarishimasu \n Deca-Dence \n Uzaki-chan wa Asobitai! \n Monster Musume no Oishasan')
                        break;
                case '#Thank you':
                        client.sendText(from, 'Whatever... *smiles*') 
                        break;
                case '#TnC':
                        client.sendText(from, 'This is an open-source program written in Javascript. \n \nBy using the bot you agreeing to our Terms and Conditions \n \n We do not store any of your data in our servers. We are not responsebale for the stickers you create using the bot.  The wallpapers and other pictues are not hosted on our servers (expect the pokemon ones).\nUse #License to see the enitire license argreement ')
                        break;
                case '#info':
                        client.sendText(from, '👋️Hi there, I\'m Emilia\nThis project is open source, built using Javascript || Node.js and is available at GitHub https:\/\/bit.ly\/39Ld2L8. If you are willing to contribute to our project please refer to the mentioned url.\n \n\nDevelopers✨\n \n _Alen Yohannan_ \n_Somnath Das_\n\nContributors💫\n\n_Miliana Blue_\n_Aman Sakuya_\n_Mystery_')   
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
                       break;
                            //MAKE SURE TO USE ; at the end of statement :)
                case 'Prepare for trouble' :
                        client.sendText(from, 'And make it double!')
                       break;
                case 'To protect the world from devastation':
                        client.sendText(from, 'To unite all peoples within our nation!')
                       break
                case 'To denounce the evils of truth and love':
                        client.sendText(from, 'To extend our reach to the stars above!')
                       break;
                case '#R':
                        client.sendText(from, 'Emilia')
                       break
                case 'Team Rocket blasts off at the speed of light':
                        client.sendText(from, 'Surrender now, or prepare to fight!')
                       break;
                
                case '#codesyaknow':
                case '#Codesyaknow': //Culture uWu
                        var culture_code;
                        culture_code = Math.floor(Math.random() * 100001) + 10000;
                        client.sendText(from, "Here you go b-ba-baka \n" + culture_code);
                        break;
                case '#Sauceyaknow':
                case '#sauceyaknow': //Keep this hidden in depth of codes to prevent mass extinction of humans :)
                        var culture_code;
                        culture_code = Math.floor(Math.random() * 100001) + 10000;
                        var sauce_Yaknow = "https://nhentai.net/g/" + culture_code;
                        client.sendText(from, sauce_Yaknow);
                        break;
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
                        const url = args[1]
                        if (url.match(isUrl)) {
                            await client.sendStickerfromUrl(from, url, {method: 'get'})
                                .then(r => { if (!r) client.sendText(from, 'The URL is not walid') })
                                .catch(err => console.log('Caught exception: ', err))
                        } else {
                            client.sendText(from, 'Sorry The URL is not valid')
                        }
                    } else {
                        client.sendText(from, 'You did not quote a picture, Baka! To make a sticker, send an image with "#sticker" as caption')
                    }
                    break
            }
        } else {
            if (!isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
            if (isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(formattedTitle) , color(chatId), color(ContactId))
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

process.on('Something went wrong', function (err) {
    console.log('Caught exception: ', err);
  });

startServer()
