const { create, decryptMedia } = require('@open-wa/wa-automate')
const moment = require('moment')
const color = require("./lib/color")
const malScraper = require('mal-scraper')
const randomAnimeWallpapers = require('random-anime-wallpapers')
const jikanjs  = require('jikanjs');
const axios = require('axios')
const akaneko = require('akaneko');
const sauce = require('./sauce')
const fs = require('fs')

const nsfw = fs.createReadStream('nsfw.txt')

const Zelda = ['918318686444-1596712042@g.us', '917067857805-1588156120@g.us', '919744375687-1596550546@g.us', '919050320505-1588747170@g.us']

var info = require('./info')
var randomAnime = require("random-anime")
var culture_code; //IGNORE THESE LINES THESE LINES ARE ONLY FOR MY FELLO MEN OF CULTURE DEVs
var sauce_Yaknow = "https://nhentai.net/g/" + culture_code; // IGNORE THESE LINES
var quote_Array = ["“You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.”– Dr. Suess", "“I’m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can’t handle me at my worst, then you sure as hell don’t deserve me at my best.”– Marilyn Monroe", "“Get busy living or get busy dying.”– Stephen King", '"Time moves in one direction, memory in another." \n~ William Gibson', '"The sky above the port was the color of television, tuned to a dead station." \n~ William Gibson', '"Before you diagnose yourself with depression or low self-esteem, first make sure that you are not, in fact, just surrounded by assholes." \n~ William Gibson', '"When you want to know how things really work, study them when they\'re coming apart." \n~ William Gibson', '"Anything that can be done to a rat can be done to a human being. And we can do most anything to rats. This is a hard thing to think about, but it\'s the truth. It won\'t go away because we cover our eyes. THAT is cyberpunk." \n~ Bruce Sterling', '"Japan is a wonderful country, a strange mixture of ancient mystique and cyberpunk saturation. It\'s a monolith of society\'s achievements, yet maintains a foothold in the past, creating an amazing backdrop for tourings and natives alive. Japan captures the imagination like no other. You never feel quite so far from home as you do in Japan, yet there are no other people on the planet that make you feel as comfortable." \n~ Corey Taylor', '“Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.” \n– Mark Twain', '“When I dare to be powerful – to use my strength in the service of my vision, then it becomes less and less important whether I am afraid.” \n– Audre Lorde', '“Those who dare to fail miserably can achieve greatly.” \n– John F. Kennedy', '“Love yourself first and everything else falls into line. You really have to love yourself to get anything done in this world.” \n– Lucille Ball', '“It is our choices, that show what we truly are, far more than our abilities.”\n– J. K Rowling', '“If you want to be happy, be.” \n– Leo Tolstoy', '“If you want to live a happy life, tie it to a goal, not to people or things.” \n– Albert Einstein', '“I never knew how to worship until I knew how to love.” \n– Henry Ward Beecher', '“Life is trying things to see if they work.” \n– Ray Bradbury', '“If life were predictable it would cease to be life, and be without flavor.” \n– Eleanor Roosevelt', '“Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.” \n– Bil Keane', '“You miss 100 percent of the shots you never take.” \n– Wayne Gretzky', '“Always forgive your enemies; nothing annoys them so much.” \n– Oscar Wilde']


let listed = require("./commands/notlistedcommands.js")
//let profil = require("./commands/profilecommand")
let rules = require("./commands/rules")
let moderation = require('./commands/moderation')

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
           
         info.info()

        })
}

async function msgHandler (client, message) {
    try {
        const { type, body, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, chatId, author } = message
        const { pushname } = sender
        const { formattedTitle } = chat
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = ['#menu','test','#help','#sticker','#sauceyaknow','#Sauceyaknow','#codesyaknow' ,'#Codesyaknow', '#TnC', '#You are idiot', '#you are idiot', '#you are baka', '#you are bakka', '#YOU ARE IDIOT', '#You are bakka','#quotes', "#Quotes", '#stiker', '#hello','#info','#commands','#God','#Thank you','#I love you','#Seasonal anime','#anime','#Anime','fuck','Fuck','sex','Sex','nudes','Link','Zelda','#Best girl','#S-1','#Do you love me','#tsundere','#Tsundere','Ora ora ora ora','ora ora ora ora','Ora Ora Ora Ora','Muda Muda Muda Muda','muda muda muda muda','Muda muda muda muda','yo','freedom','Freedom','#Zelda Timeline','#Botw','I love Rem','i love rem','I Love Rem','i love Rem','El Psy Congroo','Tuturu','Indeed','Can you beat Goku though','Se no','Mou','Kokoro','#neko','#wallpaper','#source','#sauce','Heave ho','Heave ho!','Make me a coffee','#Mystery Video','Never gonna','never gonna','never gonna run around','#Pokemon','#waifu','#waifu','Mily x Yagu','#Pokewall','#pokewall','#wiki','Prepare for trouble','To protect the world from devastation','To denounce the evils of truth and love','#R','Team Rocket blasts off at the speed of light','#Emilia','#emilia','#sauce','#Sauce','#Rem','#rem', '#tiktok', '#ig', '#instagram', '#twt', '#twitter', '#fb', '#facebook','#groupinfo','#meme','#covid','#sr','#SR','#Sr','#Test','#manga','#user','#TestGif','#kick','#leave','#add','#FAQ','#Faq','#profile','And the silence remains','and the silence remains','#animeneko', '#kick','chat.whatsapp.com','#flip','#roll','#promote','#support','#demote','#seticon','#gtest','#d_nsfw','#t_nsfw','#gsticker']
        const cmds = commands.map(x => x + '\\b').join('|')
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : '' 


        if (cmd) {
             if (Zelda.includes(chat.id) == true) {
            !isGroupMsg ? console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname)) : console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(formattedTitle))
            const args = body.trim().split(' ')
            const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi)
      
            switch (cmd[0].toLowerCase()) {
              case '#menu':
              case '#help':
                client.reply(from, '👋️Hi '+`*${pushname}*`+', I\'m Emilia!\n\nMy prefix is (#)\n\n\n*List Key:* \nCMD - The command\nDescription - How the command works\nUsage - An example of the command\n\n*Usable Commands* 🌟️\n\n*_CMD: #info_*\n*Description: Displays the information about the bot*\n\n*_CMD: #sticker_*\n*Description: Turns images into stickers* \n*Usage: _#sticker_ as caption of picture_*\n\n*_CMD: #pokemon_*\n*Description: Returns picture of a random Pokemon*\n\n*_CMD: #waifu_*\n*Description: Returns picture of a random waifu*\n\n*_CMD: #anime <anime name>_*\n*Description: Returns the information of the given anime*\n*Usage: _#anime sakura trick_*\n\n*_CMD: #neko_*\n*Description: Displays picture of a random cat*\n\n*_CMD: #animeneko_*\n*Description: Displays picture of an anime cat ;)*\n\n*_CMD: #wallpaper <keyword>_*\n*Description: Returns a random anime wallpaper based on the keyword*\n*Usage: _#wallpaper Black Butler_*\n\n*_CMD: #covid <country>_*\n*Description: Displays the live stats of Covid-19 of the given country*\n*Usage: _#covid Japan_*\n\n*_CMD: #meme_*\n*Description: Returns a meme from r\/wholesomeanimememes*\n\n*_CMD: #sr <subreddit_title>_*\n*Description: Displays a post from the given subreddit_*\n*Usage: _#sr zelda_*\n\n*_CMD: #quotes_*\n*Description: Returns a quote that will either give you existential crises or wisdom*\n\n*_CMD: #groupinfo_*\n*Description: Displays the information of the group*\n\n*_CMD: #support_*\n*Description: Adds you to the support group*\n\n*_CMD: #roll_*\n*Description: Rolls a dice*\n\n*_CMD: #flip_*\n*Description: Flips a coin*\n\n*_Admin Commands_* 📙️\n\nTo execute the following commands the bot and the author needs to be admin\n\n*_CMD: #seticon*\n*Description: Sets the quoted image as the group icon*\n\n*_CMD: #kick @user_*\n*Description: Kicks the mentioned person from the group*\n\n*_CMD: #promote @user_*\n*Description: Makes the metioned user admin*\n\n*_CMD: #demote @user_*\n*Description: Demotes the mentioned user from adminship*\n\n\nThere are many hidden and fun keywords ;)\n\nHope you have a great day!')
                break
              case '#grouplink':
                if (isGroupMsg) {
                  const inviteLink = await client.getGroupInviteLink(chat.id)
                  client.sendLinkWithAutoPreview(from, inviteLink)
                }
                break
              case '#groupinfo':
                const groupchat = await client.getChatById(chatId)
                const { desc } = groupchat.groupMetadata
                client.sendText(from, '*' + formattedTitle + '*\n\n✨️ Description:\n ' + `${desc}`)
                break           
               case '#roll':
               const dice = Math.floor(Math.random() * 6) + 1
               await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png')
               break

            case '#gsticker':
            if (args.length >=2){
                const url = args[1]
                const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'));
                const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'));
                if(isGiphy){
                    const getGiphyCode = url.match(new RegExp(/\-(?:.(?!\-))+$/, 'gi'));
                    if(getGiphyCode){
                        let delChars = getGiphyCode[0].replace(/[-\/]/gi, "");
                        const smallGif = "https://media.giphy.com/media/"+delChars+"/giphy-downsized.gif";
                        await client.sendGiphyAsSticker(from, smallGif)
                        .catch((err) => {
                            console.log(err)
                        })
                    } else {
                        client.reply(from, "Sorry, something went wrong", id)
                    }
                } else if(isMediaGiphy){
                    const normalGif = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'));
                    if(normalGif){
                        let smallGif = url.replace(normalGif[0], "giphy-downsized.gif")
                        await client.sendGiphyAsSticker(from, smallGif)
                        .catch((err) => {
                            console.log(err)
                        })
                    }
                } else {
                    client.reply(from, "Currently gif stickers can only be created from the giphy links.")
                }
            }
            break
               case '#flip':
               const side = Math.floor(Math.random() * 2) + 1
               if (side == 1) {
                 client.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
               } else {
               client.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
               }
                 break
             case '#kick':
                       var admins = await client.getGroupAdmins(chat.id)
	       	   if(isGroupMsg){
			if(args.length >=2){
				const wong = args[1]
                                const wongw = await wong.replace('@','')
                            if (admins.includes(author) == true) {
						await client.removeParticipant(from, wongw+'@c.us')
					}else{
						await client.reply(from, 'Only admins can use this command', message)
		}
	     }
           }
               break
              case '#promote':
                       var admins = await client.getGroupAdmins(chat.id)
	       	   if(isGroupMsg){
			if(args.length >=2){
				const wong = args[1]
                                const wongw = await wong.replace('@','')
                            if (admins.includes(author) == true) {
						await client.promoteParticipant(from, wongw+'@c.us')
					}else{
						await client.reply(from, 'Only admins can use this command', message)
		}
	     }
           }
                     break
              case '#demote':
                       var admins = await client.getGroupAdmins(chat.id)
	       	   if(isGroupMsg){
			if(args.length >=2){
				const wong = args[1]
                                const wongw = await wong.replace('@','')
                            if (admins.includes(author) == true) {
						await client.demoteParticipant(from, wongw+'@c.us')
					}else{
						await client.reply(from, 'Only admins can use this command', message)
		}
	     }
           }
              case '#add': 
                        var admins = await client.getGroupAdmins(chat.id)
                       if (isGroupMsg){
                          if (args.length >=2){
                                      const part = args[1]
                                          if (admins.includes(author) == true) {
                                                await client.addParticipant(from, part+'@c.us')
                                          }else{ 
                                                await client.reply(from, 'only admins can use this command', message)
                                        }
                                 }
                          }
                                                 
     
                       break
            case '#seticon':
              var admins = await client.getGroupAdmins(chat.id)
              if (admins.includes(author) == true) {
                 if (isMedia) {
                  const mediaData = await decryptMedia(message)
                  const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                  await client.setGroupIcon(from, imageBase64)
                } else if (quotedMsg && quotedMsg.type == 'image') {
                  const mediaData = await decryptMedia(quotedMsg)
                  const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                  await client.setGroupIcon(from, imageBase64)
                }
              }
               break
            case '#support':
                       await client.addParticipant('919744375687-1596199727@g.us', author)
                       break
           case '#animeneko':
                client.sendFileFromUrl(from, akaneko.neko(), 'neko.jpg', 'Neko *Nyaa*~')
                break
            case 'chat.whatsapp.com':
                var admins = await client.getGroupAdmins(chat.id)
                    if (admins.includes(author) == false) {
                         client.removeParticipant(from, author)
               }
                break;
              case '#t_nsfw':
                   var admins = await client.getGroupAdmins(chat.id)
                    if (isGroupMsg) {
                         if (admins.includes(author) == true) { 
                               fs.appendFileSync('nsfw.txt', from+'\n');
                                  await client.sendText(from, `NSFW is Contents are now enabled in *${formattedTitle}*`)
                           } else await client.sendText(from, `Only admins are able to use this command`)
                      }
                    break
              case '#d_nsfw':          
                  var admins = await client.getGroupAdmins(chat.id)
                   if (isGroupMsg) {
                          if (admins.includes(author) == true) { 
                                fs.readFile('nsfw.txt', {encoding: 'utf-8'}, function(err, data) {
                          if (err) throw error;
    
                          let dataArray = data.split('\n'); 
                          const searchKeyword = from 
                          let lastIndex = -1; 
    
                          for (let index=0; index<dataArray.length; index++) {
                            if (dataArray[index].includes(searchKeyword)) { 
                             lastIndex = index
                          break; 
                    }
              }
                            dataArray.splice(lastIndex, 1);
                              const updatedData = dataArray.join('\n');
                              fs.writeFile('nsfw.txt', updatedData, (err) => {
                              if (err) throw err
                               client.sendText(from, `NSFW contents are now disabled in *${formattedTitle}*`);
            
                      })
    
                  })

              }	
}
                break
 
              case '#gtest':
                     await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/9JgktOQBGT2AjZymYF/source.gif')
                    break
              case '#user':
                const username = 'BanTakahiro01'
                const after = 25
                const type = 'anime' // can be either `anime` or `manga`
      
                // Get you an object containing all the entries with status, score... from this user's watch list
                malScraper.getWatchListFromUser(username, after, type)
                  .then((data) => console.log(data))
                  .catch((err) => console.log(err))
                break
              case '#anime':
                if (args.length >= 5) {
                  const { title, picture, score, synopsis, episodes, aired, rating, status } = await malScraper.getInfoFromName(args[1] + '-' + args[2] + '-' + args[3] + '-' + args[4])
      
                  await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n🌠️Synopsis:' + `${synopsis}` + '\n\n📆️Aired:' + `${aired}` + '.')
                } else if (args.length >= 4) {
                  const { title, picture, score, synopsis, episodes, aired, rating, status } = await malScraper.getInfoFromName(args[1] + '-' + args[2] + '-' + args[3])
      
                  await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n🌠️Synopsis:' + `${synopsis}` + '\n\n📆️Aired:' + `${aired}` + '.')
                } else if (args.length >= 3) {
                  const { title, picture, score, synopsis, episodes, aired, rating, status } = await malScraper.getInfoFromName(args[1] + '-' + args[2])
      
                  await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n🌠️Synopsis:' + `${synopsis}` + '\n\n📆️Aired:' + `${aired}` + '.')
                } else {
                  malScraper.getInfoFromName(args[1])
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err))
      
                  const { title, picture, score, synopsis, episodes, aired, rating, status } = await malScraper.getInfoFromName(args[1])
      
                  await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n🌠️Synopsis:' + `${synopsis}` + '\n\n📆️Aired:' + `${aired}` + '.')
                }
                break
              case '#sauce':
                    if (isMedia) {
                    sauce.sauce(message)
                    }
                    else client.sendText(from, '...')
                    break
              case '#profile':
                  const picture = await client.getProfilePicFromServer(author)
                        client.sendfileFromUrl(from, picture, 'profile.jpg', `User: ${pushname}`+'\n Number:...')
              case '#manga':
      
                if (args.length >= 2) {
                  const name = args[1]
                  malScraper.getInfoFromName(name)
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err))
                }
      
                break
      
              case '#wiki':
                if (args.length >= 2) {
                  const query = args[1]
                  wiki()
                    .page(query)
                    .then(page => page.info())
                    .then(console.log)
                }
                break
              case '#pokewall' :
                q9 = Math.floor(Math.random() * 199) + 1
                client.sendFileFromUrl(from, 'http://localhost:8082/Pokemon/wallpapersanimesv.blogspot.com-(' + q9 + ').jpg', 'Pokemon.jpg', 'Here is your Pokemon Wallpaper')
                break
              case '#emilia' :
                q11 = Math.floor(Math.random() * 21) + 10
                client.sendFileFromUrl(from, 'http://0.0.0.0:8082/Emilia/' + q11 + '.png', 'Emilia.png', 'Emilia ✨️')
                break
              case '#meme':
                const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes')
                const { title, url } = response.data
                await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                break
              case '#sr':
            
                  if (args.length >=2) {
                      const sr = args[1]
                      const response = await axios.get('https://meme-api.herokuapp.com/gimme/'+sr+'/');
                      const { postLink, title, subreddit, url, nsfw, spoiler } = response.data
                     if (isGroupMsg) {
                      if (`${nsfw}` == false) {
                             client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`) 
                                   break
                    } else if (`${nsfw}` == true) {
                       fs.readFile('bans.txt', {encoding: 'utf-8'}, function(err, data) {
    
                       let dataArray = data.split('\n');  
                       let lastIndex = -1; 
    
                       for (let index=0; index<dataArray.length; index++) {
                       if (dataArray[index].includes(from) == true) { 
                             client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
                               break
                     } if (dataArray[index].includes(from) == false) {
                            client.sendText(from, `NSFW isn't enabled in *${fromattedTitle}*`) 
                                 break
                  } 
               }
           })
         }  
       } else client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
     }
                   
              break;
              case '#covid':
                if (args.length >= 2) {
                  const response = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + args[1] + '/')
                  const { cases, todayCases, deaths, todayDeaths, active } = response.data
                  await client.sendText(from, '🌎️Covid Info -' + args[1] + ' 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.')
                }
                break
              case '#waifu':
                q8 = q2 = Math.floor(Math.random() * 98) + 10
                client.sendFileFromUrl(from, 'http://randomwaifu.altervista.org/images/00' + q8 + '.png', 'Waifu.png', 'How is she?') // UwU)/ Working Fine
                break
              case '#neko':
                q2 = Math.floor(Math.random() * 900) + 300
                q3 = Math.floor(Math.random() * 900) + 300
                client.sendFileFromUrl(from, 'http://placekitten.com/' + q3 + '/' + q2, 'neko.png', 'Neko ')
                break
              case '#pokemon':
                q7 = Math.floor(Math.random() * 890) + 1
                client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + q7 + '.png', 'Pokemon.png')
                break
              case '#wallpaper' :
              if (args.length >=4) {
                         const q = args[1]
                         const a = args[2]                  
                         const z = args[3]
                         await booru.search('sb', [q+' '+a+' '+z], {limit: 1, random: true})
                         .then(booru.commonfy)
                         .then(images => {
                         for (let image of images) {
                         client.sendFileFromUrl(from, image.common.file_url, 'anime.png', 'Here\'s your wallpaper')
                       }
                  })
                }
                   else if (args.length >=3) {
                         const w = args[1]
                         const s = args[2]                  
                         await booru.search('sb', [w+' '+s], {limit: 1, random: true})
                         .then(booru.commonfy)
                         .then(images => {
                         for (let image of images) {
                         client.sendFileFromUrl(from, image.common.file_url, 'anime.png', 'Here\'s your wallpaper')
                       }
                  })
                } 
                    else if (args.length >=2) {
                         const r = args[1]                  
                         await booru.search('sb', [r], {limit: 1, random: true})
                         .then(booru.commonfy)
                         .then(images => {
                         for (let image of images) {
                         client.sendFileFromUrl(from, image.common.file_url, 'anime.png', 'Here\'s your wallpaper')
                       }
                  })
                 }  
                      break                        
              case '#mystery video':
                client.sendText(from, 'https://youtu.be/dQw4w9WgXcQ')
                break
              case '#tnc':
                client.sendText(from, 'This is an open-source program written in Javascript. \n \nBy using the bot you agreeing to our Terms and Conditions \n \n We do not store any of your data in our servers. We are not responsebale for the stickers you create using the bot.  The wallpapers and other pictues are not hosted on our servers (expect the pokemon ones).\nUse #License to see the enitire license argreement ')
                break
              case '#info':
                client.sendText(from, '👋️Hi there, I\'m Emilia\nThis project is open source, built using Javascript || Node.js and is available at GitHub https:\/\/bit.ly\/39Ld2L8. If you are willing to contribute to our project please refer to the mentioned url.\n\n\nCreators🌟️\n\n_Alen Yohannan (Ban Takahiro)_\n_Somnath Das (Takeshi Stark)_\n\nDevelopers✨\n\n _Alen Yohannan_ \n_Somnath Das_\n_Dominik Heiing_\n\nContributors💫\n\n_Miliana Blue_\n_Aman Sakuya_\n_Mystery_\n_ShellTear_')
                break
              case '#quotes':
                a2 = Math.floor(Math.random() * 22)
                client.sendText(from, quote_Array[a2])
                break
                // MAKE SURE TO USE ; at the end of statement :)
              case '#r':
                client.sendText(from, 'Emilia')
                break
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
      
                  url.match(isUrl) ? await client.sendStickerfromUrl(from, url, { method: 'get' })
                    .then(r => { if (!r) client.sendText(from, 'The URL is not walid') })
                    .catch(err => console.log('Caught exception: ', err)) : client.sendText(from, 'Sorry The URL is not valid')
                } else {
                  client.sendText(from, 'You did not quote a picture, Baka! To make a sticker, send an image with "#sticker" as caption')
                }
                break
            }
          } else {
            !isGroupMsg ? console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname)) : console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(formattedTitle), color(chatId), color(author))
          }
         }
        } catch (err) {
          console.log(color('[ERROR]', 'red'), err)
        }
      }
      
      process.on('Something went wrong', function (err) {
        console.log('Caught exception: ', err)
      })
      
      startServer()
