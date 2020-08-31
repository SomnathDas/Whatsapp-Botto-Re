function ban (client, from, quotedMsg) {
    if (quotedMsg) {
        client.sendText(from, 'baned');
        return true;
    }
}

async function kick (client, from, chat, message, author, isGroupMsg) {
    var admins = await client.getGroupAdmins(chat.id)
	if(isGroupMsg) {
	    if(args.length >=2) {
	        const wong = args[1]
            const wongw = await wong.replace('@','')
            if (admins.includes(author) == true) {
				await client.removeParticipant(from, wongw+'@c.us')
	        }else{
		        await client.reply(from, 'Only admins can use this command', message)
	        }
	    }
    }           
}

async function promote (client, from, chat, message, author, isGroupMsg) {
    var admins = await client.getGroupAdmins(chat.id)
   if(isGroupMsg) {
       if(args.length >=2) {
            const wong = args[1]
            const wongw = await wong.replace('@','')
            if (admins.includes(author) == true) {
                await client.promoteParticipant(from, wongw+'@c.us')
            }else{
                await client.reply(from, 'Only admins can use this command', message)
            }
        }
    }
}

async function demote (client, from, chat, message, author, isGroupMsg) {
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
}

async function add (client, from, chat, message, author, isGroupMsg) {
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
}

async function seticon (client, from, chat, message, author, isGroupMsg, quotedMsg) {
    var admins = await client.getGroupAdmins(chat.id)
    if (isGroupMsg) {
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
        } else{ 
            await client.reply(from, 'only admins can use this command', message)
        }
    } else {
        client.sendText(from, 'It hast to be a group message')
    }
}

module.exports = {
    ban,
    kick,
    promote,
    demote,
    add,
    seticon
}