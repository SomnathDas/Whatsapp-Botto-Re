const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const sendSticker = require('./sendSticker')
const get = require('got')
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg') 
const color = require('./lib/color')
const { liriklagu, quotemaker, wall } = require('./lib/functions')
const { help, info, } = require('./lib/help')
const msgFilter = require('./lib/msgFilter')
const akaneko = require('akaneko');
const { exec } = require('child_process')
const fetch = require('node-fetch');
const ruleArr = JSON.parse(fs.readFileSync('./lib/rule.json'))
const bent = require('bent')
const wel = JSON.parse(fs.readFileSync('./lib/welcome.json')) 
const nsfwgrp = JSON.parse(fs.readFileSync('./lib/nsfw.json')) 
const ban = JSON.parse(fs.readFileSync('./lib/banned.json'))
const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const { profile } = require('./lib/profile.js')
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, mentionedJidList, author, quotedMsgObj } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        const prefix = '='
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
	const isRule = ruleArr.includes(chat.id)
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')

	const botNumber = await client.getHostNumber()
	const groupId = isGroupMsg ? chat.groupMetadata.id : ''
	const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
	const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false

	if (isGroupMsg && isRule && (type === 'chat' && message.body.includes('chat.whatsapp.com') && isBotGroupAdmins) && !isGroupAdmins) return await client.removeParticipant(chat.id, author)
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
        if (!isCmd && !isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
        if (!isCmd && isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        if (isCmd && !isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))


        const isBanned = ban.includes(sender.id)
        const owners = ['919744375687@c.us'] // eg [9190xxxxxxxx, 49xxxxxxxx] replace my number also 
        const isowner = owners.includes(sender.id) 

        msgFilter.addFilter(from)

        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isBanned) {
            switch (command) {
            case 'sticker':
			//console.log(type)
                        if (isMedia && type == 'video') {
                        		return await sendSticker.sendAnimatedSticker(message)
                        } else if (isMedia && type == 'image') {
                      		const mediaData = await decryptMedia(message)
                      		const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                      		const baseImg = imageBase64.replace('video/mp4','image/gif')
                      		await client.sendImageAsSticker(from, baseImg)
                    	} else if (quotedMsg && quotedMsg.type == 'image') {
                    		const mediaData = await decryptMedia(quotedMsg)
                    		const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    		await client.sendImageAsSticker(from, imageBase64)
                	} else if (quotedMsg && quotedMsg.type == 'video') {
                           		if (quotedMsg.duration < 15) {
                          		sendSticker.sendAnimatedSticker(quotedMsgObj)
                          		} else {
                          		await client.reply(from, 'The given file is too large for converting', id)
                          		} 
	                } else {
                  		client.reply(from, 'You did not tag a picture or video, Baka', message.id)
                    	}
		break
       case 'tts': //You can add as many as you want, just find the language code and modify the code :)
            if (args.length === 1) return client.reply(from, '  *Usage #tts language text*')
            const ttsId = require('node-gtts')('id');
            const ttsEn = require('node-gtts')('en');
            const ttsPt = require('node-gtts')('pt');
            const ttsJp = require('node-gtts')('ja');
            const ttsAr = require('node-gtts')('ar');

            const dataText = body.slice(8)
            if (dataText === '') return client.reply(from, 'idiota!', id)
            if (dataText.length > 500) return client.reply(from, 'O texto é muito longo!', id)
            var dataBhs = body.slice(5, 7)
            if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resJp.mp3', id)
                })
            } else if (dataBhs == 'pt') {
                ttsPt.save('./media/tts/resPt.mp3', dataText, ()=> {
                    client.sendPtt(from, './media/tts/resPt.mp3');
                })
            } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resAr.mp3', id)
                })
            } else {
                client.reply(from, 'Language not supported!', id)
            }
            break
        case 'quotemaker':
            arg = body.trim().split('|')
            if (arg.length >= 3) {
            client.reply(from, 'Processing...', message.id) 
            const quotes = arg[1]
            const author = arg[2]
            const theme = arg[3]
            try {
            const resolt = await quotemaker(quotes, author, theme)
            client.sendFile(from, resolt, 'quotesmaker.jpg','neh...')
            } catch {
            client.reply(from, 'I\'m afraid to tell you that the image failed to process', message.id)
            }
            } else {
            client.reply(from, 'Usage: \n!quotemaker |text|watermark|theme\n\nEx :\n!quotemaker |...|...|random', message.id)
            }
            break
			    
	case 'aiquote' :
            const aiquote = await axios.get("http://inspirobot.me/api?generate=true")
            await client.sendFileFromUrl(from, aiquote.data, 'quote.jpg', 'Powered By http://inspirobot.me/ With ❤️' , id )
            break
			    
        case 'groupinfo' :
            if (!isGroupMsg) return client.reply(from, '.', message.id) 
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = wel.includes(chat.id)
            var ngrp = nsfwgrp.includes(chat.id)
            var grouppic = await client.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await client.sendFileFromUrl(from, pfp, 'group.png', `*${groupname}* 

🌐️ *Members: ${totalMem}*

💌️ *Welcome: ${welgrp}*

🔮️ *Rule* : *${isRule}*

⚜️ *NSFW: ${ngrp}*

📃️ *Group Description* 

${desc}`)
        break
        case 'bc':
            if(!isowner) return client.reply(from, 'Only Bot admins!', message.id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) client.sendText(ids, `[ EWH BOT Broadcast ]\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', message.id)
            break
        case 'ban':
            if(!isowner) return client.reply(from, 'Only Bot admins can use this CMD!', message.id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                ban.push(mentionedJidList[i])
                fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
                client.reply(from, 'Succes ban target!', message.id)
            }
            break  		   
        case 'covid':
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const country = await slicedArgs.join(' ')
            console.log(country)
            const response2 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response2.data
                await client.sendText(from, '🌎️Covid Info -' + country + ' 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.')
            break
			    
        case 'ping':
            if (!isGroupMsg) return client.reply(from, 'Sorry, This command can only be used in groups', message.id)
            if (!isGroupAdmins) return client.reply(from, 'Well, only admins can use this command', message.id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = `${body.slice(6)} - ${pushname} \n`
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '✨️'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '----------------------'
            await client.sendTextWithMentions(from, hehe)
            break
			    
        case 'kickall':
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if(!isGroupOwner) return client.reply(from, 'Sorry, Only group owner can use this CMD', message.id)
            if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'You need to give me the power to do this before executing', message.id)
            const allMem = await client.getGroupMembers(groupId)
            console.log(isGroupAdmins)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) return
                await client.removeParticipant(groupId, allMem[i].id)
            }
            client.reply(from, 'Done!', message.id)
            break
			    
        case 'clearall':
            if (!isowner) return client.reply(from, 'Owner only', message.id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Done', message.id)
            break
			    
        case 'act':
             arg = body.trim().split(' ')
             if (!isGroupAdmins) return client.reply(from, 'Only Admins can use this command, Baka >.<', id)
             		if (arg[1].toLowerCase() == 'welcome') {
	     			if (wel.includes(chat.id)) {
	       				client.reply(from, `Welcome is already registered on *${name}*`, message.id)
	     			} else {
               				wel.push(chat.id)
                			fs.writeFileSync('./lib/welcome.json', JSON.stringify(wel))
                			client.reply(from, `Welcome is now registered on *${name}*`, message.id)
	     			}
             		} else if (arg[1].toLowerCase() == 'nsfw') {
	       			if (nsfwgrp.includes(chat.id)) {
				client.reply(from, `NSFW is already registered on *${name}*`, message.id)
	     			} else {
                		nsfwgrp.push(chat.id)
                		fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfwgrp))
                		client.reply(from, `NSFW is now registered on *${name}*`, message.id)
				}
			} else if (arg[1].toLowerCase() == 'rule') {
				if (!isBotGroupAdmins) return client.reply(from, 'You need to make me admin to use this CMD', message.id)
				if (ruleArr.includes(chat.id)) {
					 client.reply(from, `Rule is already registered on *${name}*`, message.id)
				} else {
                			ruleArr.push(chat.id)
                			fs.writeFileSync('./lib/rule.json', JSON.stringify(ruleArr))
                			client.reply(from, `Rule is now registered on *${name}*`, message.id)
             			}
			}
             break
        case 'deact':
             arg = body.trim().split(' ')
             if (!isGroupAdmins) return client.reply(from, 'Only Admins can use this command, Baka >.<', id)
             if (arg[1].toLowerCase() == 'welcome') {
                let inx = ban.indexOf(from)
                wel.splice(inx, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(wel))
                client.reply(from, `Welcome is now unregistered on *${name}*`, message.id)
             } else if (arg[1].toLowerCase() == 'nsfw') {
                let inx = ban.indexOf(from)
                nsfwgrp.splice(inx, 1)
                fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfwgrp))
                client.reply(from, `NSFW is now unregistered on *${name}*`, message.id)
             } else if (arg[1].toLowerCase() == 'pokegame') {
                let inx = pokarr.indexOf(from)
                pokarr.splice(inx, 1)
                fs.writeFileSync('./lib/poke.json', JSON.stringify(pokarr))
                client.reply(from, `PokeGame is now unregistered on *${name}*`, message.id)
             } else if (arg[1].toLowerCase() == 'rule') {
                let inx = ruleArr.indexOf(from)
                ruleArr.splice(inx, 1)
                fs.writeFileSync('./lib/rule.json', JSON.stringify(ruleArr))
                client.reply(from, `Rule is now unregistered on *${name}*`, message.id)
             }      
             break
			    
       case 'cgc':
            arg = body.trim().split(' ')
            const gcname = arg[1]
            client.createGroup(gcname, mentionedJidList)
            client.sendText(from, 'Group Created ✨️')
            break
       
        case 'sr':
             arg = body.trim().split(' ')
             const sr = arg[1]
             try {
             const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + sr + '/');
             const {
                    postLink,
                    title,
                    subreddit,
                    url,
                    nsfw,
                    spoiler
                } = response1.data

                const isnsfw = nsfwgrp.includes(from)
                if (nsfw == true) {
                      if ((isGroupMsg) && (isnsfw)) {
                                await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
                      } else if ((isGroupMsg) && (!isnsfw)) {
                                await client.reply(from, `NSFW is not registered on *${name}*`, id)
                      }
                } else { 
                      await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
                }
                } catch(err) {
                    console.log(err)
                    await client.reply(from, 'There is no such subreddit, Baka!', id) 
                }
                break
        case 'unban':
            if(!isowner) return client.reply(from, 'Only bot admins can use this CMD', message.id)
            let inx = ban.indexOf(mentionedJidList[0])
            ban.splice(inx, 1)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
            client.reply(from, 'Unbanned User!', message.id)
            break
        case 'kick':
            if(!isGroupMsg) return client.reply(from, '...', message.id)
            if(!isGroupAdmins) return client.reply(from, 'You are not an admin, Sorry', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'You need to make me admin to use this CMD', message.id)
            if(mentionedJidList.length === 0) return client.reply(from, 'Wrong format', message.id)
            await client.sendText(from, `Request Accepted! issued:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.reply(from, '....', message.id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'delete':
            if (!isGroupAdmins) return client.reply(from, 'Only admins can use this command', id)
            if (!quotedMsg) return client.reply(from, 'Wrong Format!', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Wrong Format!', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case 'leave':
            if(!isGroupMsg) return client.reply(from, '...', message.id)
            if(!isGroupAdmins) return client.reply(from, 'You are not an admin', message.id)
            await client.sendText(from,'Sayonara').then(() => client.leaveGroup(groupId))
            break
        case 'promote':
            if(!isGroupMsg) return client.reply(from, '.', message.id)
            if(!isGroupAdmins) return client.reply(from, 'You are not an admin', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'You need to make me admin to use this CMD', message.id)
            if (mentionedJidList.length === 0) return await client.reply(from, 'Wrong format!', message.id)
            if (mentionedJidList.length >= 2) return await client.reply(from, 'One user at a time', message.id)
            if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'This user is already admin', message.id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `@${mentionedJidList[0].replace('@c.us', '')} is now an admin`)
            break
        case 'demote':
            if(!isGroupAdmins) return client.reply(from, 'You are not an admin', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'You need to make me admin to use this CMD', message.id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Wrong Format', message.id)
            if (mentionedJidList.length >= 2) return await client.reply(from, 'One user at a time', message.id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'The user isn\'t an admin', message.id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Demoted @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        case 'join':
            if (args.length == 0) return client.reply(from, 'Wrong Format', message.id)
            const link = body.slice(6)
            const minMem = 30
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, 'Where\'s the link?', message.id)
            if (check.size < minMem) return client.reply(from, 'The group does not have 30+ members', message.id)
            await client.joinGroupViaLink(link).then( async () => {
                await client.reply(from, '*Joined* ✨️', message.id)
            }).catch(error => {
                client.reply(from, 'An error occured 💔️', message.id)
            })
            break
        case 'sauce':
             if (isMedia) {
                 if (type == 'image') {
                 const buffer = await decryptMedia(message, uaOverride)
                 const filename = `./media/images/sauce.${mime.extension(message.mimetype)}`
                 await fs.writeFile(filename, buffer)
                 await source.sauce(filename, message)
                 } else { 
                 client.reply(from, 'Only Images are supported', id)
                 }
             } else if (quotedMsg && quotedMsg.type == 'image') {
                 const buffer = await decryptMedia(quotedMsg, uaOverride)
                 const filename = `./media/images/sauce.${mime.extension(quotedMsg.mimetype)}`
                 await fs.writeFile(filename, buffer)
                 await source.sauce(filename, quotedMsgObj)
             } else { 
                 client.reply(from, 'Only Images are supported', id)
             }
             break
			    
        case 'lyrics':
            if (args.length == 0) return client.reply(from, 'Wrong Format', message.id)
            const lagu = body.slice(7)
            console.log(lagu)
            const lirik = await liriklagu(lagu)
            client.sendText(from, lirik)
            break
        case 'anime':
            const keyword = message.body.replace('#anime', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime', id)
              console.log("Sent!")
              return null
              }
            const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
            const content = `*Anime Found!*
✨️ *Title:* ${title}

🎆️ *Episodes:* ${episodes}

💌️ *Rating:* ${rated}

❤️ *Score:* ${score}

💚️ *Synopsis:* ${synopsis}

🌐️ *URL*: ${url}`

            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            client.sendImage(from, base64, title, content)
           } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime')
           }
          break
        case 'wallpaper':
            if (args.length == 0) return client.reply(from, 'Wrong Format!', id)
            const query = body.slice(6)
            const walls = await wall(query)
            await client.sendFileFromUrl(from, walls, 'walls.jpg', '', id)
	    break
        case 'haigusha': 
        	const waifu = await waifuclient.getCharacter(no)
        	await sclient.sendFileFromUrl(message.from, waifu.data.display_picture, 'haugusha.jpg', `❤️ *Name : ${waifu.data.name}*\n\n💎️ Description : ${waifu.data.description}\n\n💚️ Source : ${waifu.data.series.name}\n\n✨️ URL: ${waifu.data.url}`, message.id)
            break
        case 'animeneko':
            client.sendFileFromUrl(from, akaneko.neko(), 'neko.jpg', 'Neko *Nyaa*~')
            break
        case 'doggo':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Doggo ✨️', id)
            break
        case 'neko':          
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko 🌠️', id)
            break
        case 'roll':
            const dice = Math.floor(Math.random() * 6) + 1
            await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png')
            break
        case 'flip':
            const side = Math.floor(Math.random() * 2) + 1
            if (side == 1) {
               client.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
            } else {
               client.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
            }
            break
        case 'slap':
            arg = body.trim().split(' ')
            const person = author.replace('@c.us', '')
            await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
            client.sendTextWithMentions(from, '@' + person + ' *slapped* ' + arg[1])
            break
        case 'pokemon':
            	await axios.get(`https://pokeapi.co/api/v2/pokemon/${message.body.slice(6)}`)
        	var pkurl = pkmnz.data.sprites.other['official-artwork'].front_default
		if (pkurl == null) {
 			var pkurl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pkmnz.data.id}.png`
		}
	
	var text = `👑️ Name: ${await capitalize(pkmnz.data.species.name)}

⭐️ ${await pkmntype(pkmnz.data)}

🎉️ ${await pkmnabi(pkmnz.data)}

💎️ ${await pkmnstats(pkmnz.data)}`
        
	return client.sendFileFromUrl(from, pkurl, 'pkmn.png', text, id)
        case 'rpaper' :
            const walnime = ['https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            client.sendFileFromUrl(from, walnimek, 'Nimek.jpg', '', message.id)
            break
        case 'meme':
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
            const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
            await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break
        case 'help':
            client.reply(from, help(prefix, pushname), message.id)
            break
        case 'info':
            client.reply(from, info, id)
            break
        case 'profile':
            if (quotedMsg) return profile(quotedMsgObj.sender.id, message, fs, groupAdmins, client)
	    if (mentionedJidList.length >= 1) return profile(mentionedJidList[1], message, fs, groupAdmins, client)
	    return profile(sender.id, message, fs, groupAdmins, client)
            break
        default:
            console.log(color('[PREFIX-CALL]', 'green'), color(time, 'yellow'), 'Command from', color(pushname))
            break
        }
    }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
