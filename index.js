const {
    create,
    decryptMedia
} = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
const urlShortener = require('./lib/shortener')
const color = require('./lib/color')
const {
    fetchMeme
} = require('./lib/fetcher')
const {
    getText
} = require('./lib/ocr')
const bent = require('bent')
const malScraper = require('mal-scraper')
const akaneko = require('akaneko');
const axios = require('axios')
const translate = require('google-translate-api');
const booru = require('sfwbooru')
const botadmin = '4915678716710@c.us'
const botadmin2 = '919744375687@c.us'
const botadmin3 = '4915678716710@c.us'
const invitegrp = '919744375687-1599238855@g.us'
const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const errorurl2 = 'https://pbs.twimg.com/media/DyhB6dDWoAIkO-o.jpg'
const fs = require('fs-extra')
const fetch = require('node-fetch');
const { liriklagu, quotemaker } = require('./lib/functions')
const { spawn } = require('child_process');
let ban = JSON.parse(fs.readFileSync('./lib/banned.json'))
let rule = JSON.parse(fs.readFileSync('./lib/rule.json'))
const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    killProcessOnBrowserClose: true,
    cacheEnabled: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // THIS MAY BREAK YOUR APP !!!ONLY FOR TESTING FOR NOW!!!
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
    serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async() => {
    create('Imperial', serverOption)
        .then((client) => {
            console.log('[DEV] Ban Takahiro and Takeshi Stark')
            console.log('[SERVER] Server Started!')
                // Force it to keep the current session
            client.onStateChanged((state) => {
                    console.log('[Client State]', state)
                    if (state === 'CONFLICT') client.forceRefocus()
                })
                // listening on message
            client.onMessage((message) => {
                msgHandler(client, message)
            })

            client.onAddedToGroup((chat) => {
                client.sendFileFromUrl(chat.groupMetadata.id, 'https://images.alphacoders.com/692/thumb-1920-692362.png', 'welcome.png', `Hi everyone, Thanks for adding me to the group! Use '#help' to see the usable commands`)
            })
          
            client.onIncomingCall((call) => {
            client.sendText(call.peerJid, 'You are banned for calling, Join our support group to get unbanned')
            client.contactBlock(call.peerJid)
            ban.push(call.peerJid)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
            client.deleteChat(call.peerJid)
        })

      })
}

async function msgHandler(client, message) {
    try {
        const {
            type,
            id,
            from,
            t,
            sender,
            isGroupMsg,
            chat,
            caption,
            quotedMsgObj,
            isMedia,
            mimetype,
            quotedMsg,
            mentionedJidList,
            author
        } = message
        let {
            body
        } = message
        const {
            name
        } = chat
        let {
            pushname,
            verifiedName
        } = sender
        pushname = pushname || verifiedName // verifiedName is the name of someone who uses a business account
            // if (pushname === undefined) console.log(sender + '\n\n' + chat)
        const prefix = '#'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        if (!isCmd && !isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
        if (!isCmd && isGroupMsg) {
                    const botNumber1 = await client.getHostNumber()
                    const groupAdmins1 = isGroupMsg ? await client.getGroupAdmins(from) : ''
                    const isGroupAdmins1 = isGroupMsg ? groupAdmins1.includes(sender.id) : false
                    const isBotGroupAdmins1 = isGroupMsg ? groupAdmins1.includes(botNumber1 + '@c.us') : false
 
            console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name), color(chat.id))
                 if (body.includes('chat.whatsapp.com') && rule.includes(from) && !isGroupAdmins1 && isBotGroupAdmins1) {
                         await client.reply(from, 'You know the rules, and so do I 🎶️', id)
                            await client.removeParticipant(from, author)
                                   return
                 }
              }
        if (isCmd && !isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))

        const botNumber = await client.getHostNumber()
        const owners = ['9744375687@c.us', 'Sd']
        const isowner = owners.includes(sender.id)
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const isBanned = ban.includes(sender.id)
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const botadmins = await client.getGroupAdmins('919744375687-1599187760@g.us')
        const isbotadmin = botadmins.includes(sender.id)

        if (isowner && isbotadmin) {
            const role = 'Owner'
        } else if (isbotadmin) {
            const role = 'Bot Admin | Helper'
        } else if (isbotadmin == false) {
            const role = 'User'
        }

        // Checking function speed
        // const timestamp = moment()
        // const latensi = moment.duration(moment() - timestamp).asSeconds()
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const url = args.length !== 0 ? args[0] : ''
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
        const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))


    if (isBanned) {
         client.reply(from, 'You are banned, Baka! >.<', id) 
    } else {
        switch (command) {
            case 'tnc':
                await client.sendText(from, 'This bot is an open-source program written in Javascript. \n\nBy using the bot you agreeing to our Terms and Conditions! \nWe do not store any of your data in our servers. We are not responsible for stickers that you create using bots, videos, images or other data that you get from this bot.')
                break
            case 'menu':
            case 'help':
                {
                    const text = `👋️Hi ${pushname}, I'm Emilia!

My prefix is (#)

🌟️ Command List 🌟️


*_CMD: #add or #support_*
*Description: DMs our support group link to you* 👑️

*_CMD: #profile_*
*Description: Displays the information of the user*

*_CMD: #info_*
*Description: Displays the information about the bot* 🌐️

*_CMD: #sticker_*
*Description: Turns images into stickers* 🔖️
Usage: #sticker as caption of picture

*_CMD: #gsticker <giphy URL>_*
*Description: Turns gifs into stickers* 🌠️
Usage: #gsticker https://giphy.com/... 

*_CMD: #sauce_*
*Description: Give's the title of the picture specified* ❤️
Usage: #sauce as the caption or reply of any picture

*_CMD: #pokemon_*
*Description: Returns picture of a random Pokemon* 😺️

*_CMD: #waifu_*
*Description: Returns picture of a random waifu* 💌️

*_CMD: #anime <anime name>_*
Description: Returns the information of the given anime* 📺️
Usage: #anime sakura trick

*_#tts <language-code> <text>_*
*Description: Converts text to speech* 🗣️
Usage: #tts en I love Zelda

*_quotemaker | quote | author |_*
*Description: Convert the given quote to an image*
Usage: #qm | Courage need not to be remembered, for it is never forgotten | Zelda 🌌️

*_#lyrics <song name>_*
*Description: Displays the lyricsof the given song* 🎶️
Usage: #lyrics Shinzou wo sasageyo
            
*_CMD: #neko_*
*Description: Displays picture of a random cat* 🐈️

*_CMD: #animeneko_*
Description: Displays picture of an anime cat ;)* 💚️

*_CMD: #wallpaper <keyword>_*
*Description: Returns a random anime wallpaper based on the keyword* 📱️
Usage: #wallpaper Black Butler

*_CMD: #covid <country>_*
*Description: Displays the live stats of Covid-19 of the given country* 🌍️
Usage: #covid Japan

*_CMD: #meme_*
*Description: Returns a random meme 🎷️ 

*_CMD: #sr <subreddit_title>_*
*Description: Displays a post from the given subreddit* 💻️
Usage: #sr zelda

*_CMD: #quotes_* [Disabled]
*Description: Returns a quote that will either give you existential crises or wisdom* 🌠️

*_CMD: #groupinfo_*
*Description: Displays the information of the group* ⛱️

*_CMD: #roll_*
*Description: Rolls a dice* 🎲

*_CMD: #flip_*
*Description: Flips a coin* 🟡

Admin Commands 📙️

Only group admins can execute this command

*_CMD: #ping <text>_*
*Description: Tags all members in the group* 🔊️
Usage: #ping Well, in that case

*_CMD: #delete_*
Description: Deletes the Bot's message* 💔️
Usage: Send #delete as reply to the bot's message

To execute the following commands the bot and the author needs to be admin

*_CMD: #seticon_*
*Description: Sets the quoted image as the group icon* 🎆️

*_CMD: #kick @user_*
*Description: Kicks the mentioned person from the group* 🏌️

*_CMD: #promote @user_*
*Description: Makes the metioned user admin* 👑️

*_CMD: #demote @user_*
*Description: Demotes the mentioned user from adminship* 💔️


There are many hidden and fun keywords ;)

Hope you have a great day!`
                    await client.sendText(from, text)
                    break
                }
            case 'info':
                client.reply(from, '👋️Hi there, I\'m Emilia\nThis project is open source, built using Javascript || Node.js and is available at GitHub https:\/\/bit.ly\/39Ld2L8 (Updated).\n\n *Creators*👑️\n\n_Alen Yohannan (Ban Takahiro)_ \n _Somnath Das (Takeshi Stark)_ \n\n*Developers*✨\n \n _Alen Yohannan_ \n_Somnath Das_\n_Dominik Heiing_\n\n*Contributors*💫\n\n_Miliana Blue_\n_Aman Sakuya_\n_Mystery_\n_ShellTear_', id)
                break
                // Sticker Creator
            case 'sticker':
            case 'stiker':
                if (isMedia) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64)
                } else if (quotedMsg && quotedMsg.type === 'image') {
                    const mediaData = await decryptMedia(quotedMsg)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64)
                } else if (args.length === 1) {
                    if (!url.match(isUrl)) await client.reply(from, 'Sorry the URL is invalid', id)
                    await client.sendStickerfromUrl(from, url)
                        .then((r) => {
                            if (!r && r !== undefined) client.sendText(from, 'Sorry, Something went wrong')
                        })
                } else {
                    await client.reply(from, 'You didn\'t quote a picture, baka!', id)
                }
                break
            case 'gsticker':
                if (args.length !== 1) return client.reply(from, 'Baka! The format is incorrect. Use #help to see the correct format.', id)
                if (isGiphy) {
                    const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                    if (!getGiphyCode) return client.reply(from, 'Error', id)
                    const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                    console.log(giphyCode)
                    const smallGiftUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                    await client.sendGiphyAsSticker(from, smallGiftUrl).catch((err) => console.log(err))
                } else if (isMediaGiphy) {
                    const giftUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                    if (!giftUrl) return client.reply(from, 'Currently only giphy links are supported', id)
                    const smallGiftUrl = url.replace(giftUrl[0], 'giphy-downsized.gif')
                    await client.sendGiphyAsSticker(from, smallGiftUrl).catch((err) => console.log(err))
                } else {
                    await client.reply(from, 'Something went wrong', id)
                }
                break
           case 'delete':
                    if (!isGroupAdmins) return client.reply(from, 'Failed, this command can only be used by group admins!', id)
                    if (!quotedMsg) return client.reply(from, 'Sorry, the message format is wrong please check the menu', id)
                    if (!quotedMsgObj.fromMe) return client.reply(from, 'Sorry, message format is wrong, please check menu. [Wrong Format]', id)
                        client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
                           .then(() => client.reply(from, 'Successfully deleted message', id))
                   break
            case 'groupinfo':
                const grpic = await client.getProfilePicFromServer(chat.id)
                const groupchat = await client.getChatById(from)
                const {
                    desc
                } = groupchat.groupMetadata

                if (grpic == undefined) {
                    var gp1 = errorurl
                } else {
                    var gp1 = grpic
                }
                await client.sendFileFromUrl(from, gp1, 'grp.png', '*' + name + '*\n\n Description:\n ' + `${desc}`)
                break
                // Other Commands
            case 'translate':
                arg = body.trim().split(' ')
                if (quotedMsg) {
                    const zel = quotedMsg
                    translate(quotedMsg.body, {
                        to: arg[1]
                    }).then(res => {
                        client.reply(from, res.text, id)

                    }).catch(err => {
                        client.reply(from, err, id)
                    });
                    break
                }
            case 'iso':
                client.reply(from, '🌍️ *Language Codes for TTS* 🌐️ \n🇬🇧️ en - English\n🇯🇵️ jp - Japanese\n🇮🇳️ hi - Hindi\n🇮🇩️ id - Indonesian', id)
                break
            case 'memes':
            case 'meme':
                {
                    const {
                        title,
                        url
                    } = await fetchMeme()
                    await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                    break
                }
            case 'support':
            case 'add':
                client.sendLinkWithAutoPreview(author, 'https://chat.whatsapp.com/DI6qXVdkqF2BBOeLD2sLqX', `👋️Hi *${pushname}* Here is our Support Group\' invite link. We hope you have fun ❤️ \n\n https://chat.whatsapp.com/DI6qXVdkqF2BBOeLD2sLqX`)
                break
                // Group Commands (group admin only)
            case 'report':
                arg = body.trim().split(' ')
                var slicedArgs = Array.prototype.slice.call(arg, 1);
                console.log(slicedArgs)
                const text2 = await slicedArgs.join(' ')
                await client.sendText('917638851613-1597737101@g.us', 'Bug:' + text2 + '\n\nFrom:' + author + ` ${pushname} in ${name}` + chat.id + '')
                await client.reply(from, '✨️ Thank you for reporting', id)
                break
            case 'kick':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups, Baka!', id)
                if (!isGroupAdmins) return client.reply(from, 'You are not an admin, Baka!', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Baka! You need to make me admin to use this command', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'This is not how you use the command, Baka!', id)
                await client.sendText(from, `Request accepted, issued:\n${mentionedJidList.join('\n')}`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                    if (groupAdmins.includes(mentionedJidList[i])) return await client.sendText('Can\'t remove admins')
                    await client.removeParticipant(groupId, mentionedJidList[i])
                    break
                }
                break
            case 'ping':
                {
                    if (!isGroupAdmins) return client.reply(from, 'You are not an admin, Baka!', id)
                    var arr = await client.getGroupMembersId(from)
                    const arr2 = await arr.map(i => '@' + i);
                    const arr3 = await arr2.map(i => i.replace('@c.us', ''))
                    const arr4 = await arr3.join(' ')
                    arg = body.trim().split(' ')
                    var slicedArgs = Array.prototype.slice.call(arg, 1);
                    console.log(slicedArgs)
                    const text1 = await slicedArgs.join(' ')
                    await client.sendTextWithMentions(from, `*${pushname}* says *` + text1 + '* ' + arr4)
                }
                break
            case 'admins':
                {
                    var arr = groupadmins
                    const arr2 = await arr.map(i => '@' + i);
                    const arr3 = await arr2.map(i => i.replace('@c.us', ''))
                    const arr4 = await arr3.join(' ')
                    arg = body.trim().split(' ')
                    var slicedArgs = Array.prototype.slice.call(arg, 1);
                    console.log(slicedArgs)
                    const text1 = await slicedArgs.join(' ')
                    await client.sendTextWithMentions(from, `*${pushname}* says ` + text1 + ' ' + arr4)
                }
                break
            case 'fb':
            case 'facebook':
                if (args.length !== 1) return client.reply(from, 'Wrong Format!', id)
                if (!url.match(isUrl) && !url.includes('facebook.com')) return client.reply(from, 'The url is invalid', id)
                await client.sendText(from, '*Scraping Metadata...*')
                facebook(url)
                    .then(async(videoMeta) => {
                        try {
                            const title = videoMeta.response.title
                            const thumbnail = videoMeta.response.thumbnail
                            const links = videoMeta.response.links
                            const shorts = []
                            for (let i = 0; i < links.length; i++) {
                                const shortener = await urlShortener(links[i].url)
                                console.log('Shortlink: ' + shortener)
                                links[i].short = shortener
                                shorts.push(links[i])
                            }
                            const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
                            const caption = `Text: ${title} \nLink Download: \n${link.join('\n')}`
                            await client.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption)
                        } catch (err) {
                            await client.reply(from, 'Error, ' + err, id)
                        }
                    })
                    .catch((err) => {
                        client.reply(from, `Error \n\n${err}`, id)
                    })
                break
            case 'promote':
                {
                    if (!isGroupMsg) return await client.reply(from, 'This command can only be used in groups, Baka!', id)
                    if (!isGroupAdmins) return await client.reply(from, 'You are not an admin, Baka!', id)
                    if (!isBotGroupAdmins) return await client.reply(from, 'Baka! You need to make me admin to use this command', id)
                    if (mentionedJidList.length === 0) return await client.reply(from, 'This is not how you use the command, Baka!', id)
                    if (mentionedJidList.length >= 2) return await client.reply(from, 'One person at a time', id)
                    if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'The mentioned person is admin', id)
                    await client.promoteParticipant(groupId, mentionedJidList[0])
                    await client.sendTextWithMentions(from, `@${mentionedJidList[0].replace('@c.us', '')} Is now an admin.`)
                    break
                }
            case 'demote':
                {
                    if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups, Baka!', id)
                    if (!isGroupAdmins) return client.reply(from, 'You are not an admin, Baka!', id)
                    if (!isBotGroupAdmins) return client.reply(from, 'Baka! You need to make me admin to use this command', id)
                    if (mentionedJidList.length === 0) return client.reply(from, 'This is not how you use the command, Baka!', id)
                    if (mentionedJidList.length >= 2) return await client.reply(from, 'One person at a time', id)
                    if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'The mentioned person is admin.', id)
                    await client.demoteParticipant(groupId, mentionedJidList[0])
                    await client.sendTextWithMentions(from, `Removed @${mentionedJidList[0].replace('@c.us', '')} from adminship.`)
                    break
                }
            case 'seticon':
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
            case 'za_warudo':
                if (!isGroupMsg) return await client.reply(from, 'This command can only be used in groups, Baka!', id)
                if (!isGroupAdmins) return await client.reply(from, 'You are not an admin, Baka!', id)
                if (!isBotGroupAdmins) return await client.reply(from, 'Baka! You need to make me admin to use this command', id)
                await client.setGroupToAdminsOnly(from, true)
            case 'za_warudo-f':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups, Baka!', id)
                if (!isGroupAdmins) return client.reply(from, 'You are not an admin, Baka!', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Baka! You need to make me admin to use this command', id)
                await client.setGroupToAdminsOnly(from, false)
                break
            case 'chat.whatsapp.com':
                var admins = await client.getGroupAdmins(chat.id)
                if (admins.includes(author) == false) {
                    client.removeParticipant(from, author)
                }
                break

            case 'ban':
          if(!isbotadmin) return client.reply(from, 'Only Bot admins can use this command', message.id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                ban.push(mentionedJidList[i])
                fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
                client.reply(from, 'Banned User!', message.id)
                 }
                break

            case 'unban':
          if(!isbotadmin) return client.reply(from, 'Only bot admins can use this command', message.id)
          
              let inx = ban.indexOf(mentionedJidList[0])
               ban.splice(inx, 1)
               fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
               client.reply(from, 'Unbanned User', message.id)
               break
            case 'rule-true':
              if (!isGroupAdmins) return client.reply(from, 'Only group admins can use this command', message.id)
              if (!isBotGroupAdmins) return client.reply(from, 'You need to make me admin to enable it' , id)
                     rule.push(from)
                       fs.writeFileSync('./lib/rule.json', JSON.stringify(rule))
                        client.reply(from, 'kick for links is now active! ❤️', message.id)
                 
            case 'rule-false':
                 if (!isGroupAdmins) return client.reply(from, 'Only group admins can use this command', message.id)
                 if (!isBotGroupAdmins) return client.reply(from, 'You need to make me admin to enable it' , id)
                     let inx2 = rule.indexOf(from)
                       rule.splice(inx, 1)
               fs.writeFileSync('./lib/rule.json', JSON.stringify(rule))
               client.reply(from, 'Ki ck for links is now deactivated! 💔️', message.id)
                break

            case 'join':
                arg = body.trim().split(' ')
                if (chat.id == invitegrp) {
                    const joingrp = await client.joinGroupViaLink(arg[1])
                    console.log(joingrp)

                    if (joingrp == 401) {
                        await client.reply(from, '*An Error Occured* 💔️', id)
                    } else if (joingrp == 406) {
                        await client.reply(from, 'You didn\'t give a invite link, Baka >.<', id)
                    } else {
                        await client.reply(from, '*Joined* ✨️', id)
                        await client.getGroupMembersId(joingrp)
                        .then((ids) => {
                            console.log('[CLIENT]', color(`Invited to Group. [ ${name} : ${ids.length}]`, 'yellow'))
                            var num = ids.length
                          })
                        if (num <= 15) {
                             await client.sendText(joingrp, 'Sorry, the minimum group member is 15 user to use this bot. Bye~')
                             await client.leaveGroup(joingrp)
                              }
                 
                        break
                    }
                } else {
                    await client.reply(from, 'You can\'t use that CMD here, Join our support group to learn more', id)
                }
                break


                //fun commands
            case 'tts':
        	if (args.length == 0) return client.reply(from, 'This is not the correct format, Use #help to see to see the correct format')
        	const ttsEn = require('node-gtts')('en')
	        const ttsJp = require('node-gtts')('ja')
                const ttsHi = require('node-gtts')('hi')
                const ttsId = require('node-gtts')('id')
                const dataText = body.slice(8)
                var dataBhs = body.slice(5, 7)
	        if (dataBhs == 'en') {
                    ttsEn.save('./tts/resEn.mp3', dataText, function () {
                        client.sendPtt(from, './tts/resEn.mp3', message.id)
                })
                } else if (dataBhs == 'hi') {
                    ttsJp.save('./tts/resHi.mp3', dataText, function () {
                        client.sendPtt(from, './tts/resHi.mp3', message.id)
                })
                } else if (dataBhs == 'id') {
                    ttsJp.save('./tts/resId.mp3', dataText, function () {
                        client.sendPtt(from, './tts/resId.mp3', message.id)
                })
		} else if (dataBhs == 'jp') {
                    ttsJp.save('./tts/resJp.mp3', dataText, function () {
                        client.sendPtt(from, './tts/resJp.mp3', message.id)
                })
                 } else {
		    client.reply(from, 'Currently only English and Japanese are supported', message.id)
            }
            break
            case 'dujin':
                if (args.length >= 1) {
                    const nuklir = body.split(' ')[1]
                    const nanap = require('nana-api')
                    const nana = new nanap()
                    const {
                        exec
                    } = require('child_process')
                    client.sendText(from, 'Searching...')
                    nana.g(nuklir).then((g => {
                        if (g == 'Book not found') {
                            client.reply(from, '💔️ Book not found', message.id)
                        } else {
                            var url = "https://t.nhentai.net/galleries/" + g.media_id + "/cover.jpg"
                            try {
                                var teks = "English Title  : " + g.title.english.slice("0") + " \n \nJapanese Title : " + g.title.japanese + "\n \n Title   : " + g.title.pretty + "\n \n Code    : " + g.id;
                                exec('nhentai --id=' + g.id + ` -P mantap.pdf -o ./hentong/${g.id}.pdf --format ` + `${g.id}.pdf`, (error, stdout, stderr) => {
                                    client.sendFileFromUrl(from, url, 'hentod.jpg', teks, id)
                                    client.sendFile(from, `./hentong/${g.id}.pdf/${g.id}.pdf.pdf`, `${g.title.pretty}.pdf`, id)
                                    if (error) {
                                        console.log('error : ' + error.message)
                                        return
                                    }
                                    if (stderr) {
                                        console.log('stderr : ' + stderr)
                                        return
                                    }
                                    console.log('stdout : ' + stdout)
                                })
                            } catch {
                                client.reply(from, 'An error has occured', message.id)
                            }
                        }
                    }))
                }
                break
            case 'profile': {
      let ban2 = JSON.parse(fs.readFileSync('./lib/banned.json'))
    if (quotedMsg) {
        var admin = groupAdmins.includes(quotedMsgObj.sender.id)
        var namae = quotedMsgObj.sender.name
        var badmin = botadmins.includes(quotedMsgObj.sender.id)
        var pfp = await client.getProfilePicFromServer(quotedMsgObj.sender.id)
        var sts = await client.getStatus(quotedMsgObj.sender.id)
        var ban1 = ban2.includes(quotedMsgObj.sender.id)
        const { status } = sts
              if (badmin == true) {
                var role = 'Royal Guard'
              } else {
                var role = 'User'
              }
              if (pfp == undefined) {
                var picture = errorurl
              } else {
                var picture = pfp
              }
    } else if (!quotedMsg) {
        var adm = groupAdmins.includes(sender.id)
        var namae = `${pushname}`
        var badmin = botadmins.includes(sender.id)
        console.log(badmin)
        var pfp = await client.getProfilePicFromServer(author)
        var sts = await client.getStatus(sender.id)
        var ban1 = ban2.includes(author)
        var { status } = sts
              if (badmin == true) {
                var role = 'Royal Guard'
              } else {
                var role = 'User'
              }
              if (pfp == undefined) {
                var picture = errorurl
              } else {
                var picture = pfp
              }
    }   
    
    
    const caption = `✨️ *User Profile* ✨️

🔖️ *Username: ${namae}*

✨️ *Role: ${role}*

💌️ *User Info: ${status}*

💔️ *Ban: ${ban1}*

👑️ *Admin: ${adm}*`

                   await client.sendFileFromUrl(from, picture, 'picture.jpg', caption)
 
}

break

            case 'slap':
                arg = body.trim().split(' ')
                const person = author.replace('@c.us', '')
                await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
                client.sendTextWithMentions(from, '@' + person + ' *slapped* ' + arg[1])
                break
            case 'animeneko':
                client.sendFileFromUrl(from, akaneko.neko(), 'neko.jpg', 'Neko *Nyaa*~')
                break
            case 'sauce':
                if (isMedia) {
                    const mediaData = await decryptMedia(message)
                    const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                         
                try {
                   const raw = await fetch("https://trace.moe/api/search", {
                   method: "POST",
                   body: JSON.stringify({ image: imageBase64 }),
                   headers: { "Content-Type": "application/json" }
                   })

                  const parsedResult = await raw.json()
                  const { anime, episode, title_english } = parsedResult.docs[0]
                  const content = `*Anime Found!* \n⛩️ *Japanese Title:* ${anime} \n✨️ *English Title:* ${title_english} \n💚️ *Source Episode:* ${episode} `
                                       await client.sendImage(from, imageBase64, 'sauce.png', content, id)
                                       console.log("Sent!")
                                    } catch (err) {
                                      await client.sendFileFromUrl(from, errorurl, 'error.png', '💔️ An Error Occured', id)
                                         }
                  } else if (quotedMsg && quotedMsg.type == 'image') {
                    const mediaData = await decryptMedia(quotedMsg)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
   
                 try {
                   const raw = await fetch("https://trace.moe/api/search", {
                   method: "POST",
                   body: JSON.stringify({ image: imageBase64 }),
                   headers: { "Content-Type": "application/json" }
                   })

                  const parsedResult = await raw.json()
                  const { anime, episode, title_english } = parsedResult.docs[0]

                  const content = `*Anime Found!* \n⛩️ *Japanese Title:* ${anime} \n✨️ *English Title: ${title_english} \n💚️ *Source Episode:* ${episode} `
                                       await client.sendImage(from, imageBase64, 'sauce.png', content, id)
                                       console.log("Sent!")
                                    } catch (err) {
                                      throw new Error(err.message)
                                      await client.sendFileFromUrl(from, errorurl, 'error.png', '💔️ An Error Occured', id)
                                         }
                   }
             
                break
            case 'Link':
                {
                    client.sendText(from, 'Zelda')
                    break
                }
            case 'Zelda':
                {
                    client.sendText(from, 'Link')
                    break
                }
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
                        await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
               } catch(err) {
                        await client.reply(from, 'There is no such subreddit, Baka!', id) 
                            }
                break
           case 'bc' :
         if(!isbotadmin) return client.reply(from, 'Only Bot admins can use this CMD!', message.id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) client.sendText(ids, `[ EWH Bot Broadcast ]\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', message.id)
            break
            case 'anime':
                {
      const keyword = message.body.replace('#anime', '')
      try {
        const data = await fetch(
          `https://api.jikan.moe/v3/search/anime?q=${keyword}`
        )
        const parsed = await data.json()
        if (!parsed) {
          await cleint.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime', id)
          console.log("Sent!")
          return null
        }

        const {
          title,
          synopsis,
          episodes,
          url,
          rated,
          score,
          image_url
        } = parsed.results[0]
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
        await cleint.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime')
      }
    }

                
                break
            case 'lyrics':
               if (args.length == 0) return client.reply(from, 'Wrong Format, Baka!, Correct format: #lyrics <song name> ', message.id)
                const lagu = body.slice(8)
                console.log(lagu)
                const lirik = await liriklagu(lagu)
                client.sendText(from, lirik)
                     break
            case 'quotemaker':
            argw = body.trim().split('|')
             if (argw.length >= 3) {
                 client.reply(from, 'Processing...', message.id) 
                 const quotes = argw[1]
                 const author = argw[2]
                 const theme = argw[3]
                 try {
                     const resolt = await quotemaker(quotes, author, theme)
                     client.sendFile(from, resolt, 'quotesmaker.jpg','Here you go')
                 } catch {
                     client.reply(from, 'The image failed to process 💔️', message.id)
                 }
            } else {
                client.reply(from, 'Usage: \n#quotemaker | text | author |theme', message.id)
            }
            break
            case 'covid':
                arg = body.trim().split(' ')
                console.log(...arg[1])
                var slicedArgs = Array.prototype.slice.call(arg, 1);
                console.log(slicedArgs)
                const country = await slicedArgs.join(' ')
                console.log(country)
                const response = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
                const {
                    cases,
                    todayCases,
                    deaths,
                    todayDeaths,
                    active
                } = response.data
                await client.sendText(from, '🌎️Covid Info -' + country + ' 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.')
                break
            case 'waifu':
                const data = fs.readFileSync('./lib/waifu.json')
                const dataJson = JSON.parse(data)
                const randIndex = Math.floor(Math.random() * dataJson.length)
                const randKey = dataJson[randIndex]
                   client.sendFileFromUrl(from, randKey.image, 'Waifu.jpg', randKey.teks, id)
            break
                break
            case 'neko':
                q2 = Math.floor(Math.random() * 900) + 300
                q3 = Math.floor(Math.random() * 900) + 300
                client.sendFileFromUrl(from, 'http://placekitten.com/' + q3 + '/' + q2, 'neko.png', 'Neko ', id)
                break
            case 'pokemon':
                q7 = Math.floor(Math.random() * 890) + 1
                client.sendFileFromUrl(from, 'https://randompokemon.com/sprites/png/normal/' + q7 + '.png', 'Pokemon.png', '...', id)
                break
            case 'wallpaper':
                arg = body.trim().split(' ')
                var slicedArgs = Array.prototype.slice.call(arg, 1);
                const an1 = await slicedArgs.join(' ')
                console.log(an1)
                const an2 = an1.replace(' ', '_')
                await booru.search('sb', [an2], {
                        limit: 1,
                        random: true
                    })
                    .then(booru.commonfy)
                    .then(images => {
                        //Log the direct link to each image
                        for (let image of images) {
                            client.sendFileFromUrl(from, image.common.file_url, 'Wallpaper.png', '✨️ *Here is your wallpaper*', id)
                        }
                    })
                    .catch(err => {
                        if (err.name === 'booruError') {
                            //It's a custom error thrown by the package
                            client.sendFileFromUrl(from, errorurl, 'error.png', '💔️ *Sorry, we couldn\'t find any matching images*', id)
                        } else {
                            //This means I messed up. Whoops.
                            console.log(err)
                        }
                    })

                break

            case 'roll':
                {
                    const dice = Math.floor(Math.random() * 6) + 1
                    await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png')
                    break
                }
            case 'flip':
                {
                    const side = Math.floor(Math.random() * 2) + 1
                    if (side == 1) {
                        client.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
                    } else {
                        client.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
                    }
                    break
                }



        }
      }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

startServer()
