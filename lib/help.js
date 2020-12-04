// edit it to change the bot's name
const botname = 'Emilia' 

function help(prefix, pushname) {
    return `👋️Hi ${pushname}, I'm ${botname}!

Prefix - ${prefix}

🌟️ Command List 🌟️

*_CMD: ${prefix}profile_*
*Description: Displays the information of the user*

*_CMD: ${prefix}info_*
*Description: Displays the information about the bot* 🌐️

*_CMD: ${prefix}sticker_*
*Description: Turns images into stickers* 🔖️
Usage: ${prefix}sticker as caption of picture

*_CMD: ${prefix}gsticker <giphy URL>_*
*Description: Turns gifs into stickers* 🌠️

*_CMD: ${prefix}sauce_*
*Description: Give's the title of the picture specified* ❤️
Usage: ${prefix}sauce as the caption or reply of any picture

*_CMD: ${prefix}pokemon_*
*Description: Returns picture of a random Pokemon* 😺️

*_CMD: ${prefix}waifu_*
*Description: Returns picture of a random waifu* 💌️

*_CMD: ${prefix}anime <anime name>_*
Description: Returns the information of the given anime* 📺️
Usage: ${prefix}anime sakura trick

*_${prefix}tts <language-code> <text>_* [Disabled due to ban-risk]
*Description: Converts text to speech* 🗣️
Usage: ${prefix}tts en I love Emilia

*_${prefix}quotemaker | quote | author |_*
*Description: Convert the given quote to an image*
Usage: ${prefix}qm | Courage need not to be remembered, for it is never forgotten | Emilia 🌌️

*_${prefix}lyrics <song name>_*
*Description: Displays the lyricsof the given song* 🎶️
Usage: ${prefix}lyrics Shinzou wo sasageyo
            
*_CMD: ${prefix}neko_*
*Description: Displays picture of a random cat* 🐈️

*_CMD: ${prefix}doggo_*
*Description: Displays picture of a random pup* 🐕️

*_CMD: ${prefix}rpaper_*
*Description: Displays a random wallpaper* 🌆️

*_CMD: ${prefix}animeneko_*
Description: Displays picture of an anime cat ;)* 💚️

*_CMD: ${prefix}wallpaper <keyword>_*
*Description: Returns a random anime wallpaper based on the keyword* 📱️
Usage: ${prefix}wallpaper Black Butler

*_CMD: ${prefix}covid <country>_*
*Description: Displays the live stats of Covid-19 of the given country* 🌍️
Usage: ${prefix}covid Japan

*_CMD: ${prefix}meme_*
*Description: Returns a random meme 🎷️ 

*_CMD: ${prefix}sr <subreddit_title>_*
*Description: Displays a post from the given subreddit* 💻️
Usage: ${prefix}sr Emilia

*_CMD: ${prefix}quotes_* [Disabled]
*Description: Returns a quote that will either give you existential crises or wisdom* 🌠️

*_CMD: ${prefix}groupinfo_*
*Description: Displays the information of the group* ⛱️

*_CMD: ${prefix}roll_*
*Description: Rolls a dice* 🎲

*_CMD: ${prefix}flip_*
*Description: Flips a coin* 🟡

Admin Commands 📙️

Only group admins can execute this command

*_CMD: ${prefix}ping <text>_*
*Description: Tags all members in the group* 🔊️
Usage: ${prefix}ping Well, in that case

*_CMD: ${prefix}delete_*
Description: Deletes the Bot's message* 💔️
Usage: Send ${prefix}delete as reply to the bot's message

To execute the following commands the bot and the author needs to be admin

*_CMD: ${prefix}seticon_*
*Description: Sets the quoted image as the group icon* 🎆️

*_CMD: ${prefix}kick @user_*
*Description: Kicks the mentioned person from the group* 🏌️

*_CMD: ${prefix}promote @user_*
*Description: Makes the metioned user admin* 👑️

*_CMD: ${prefix}demote @user_*
*Description: Demotes the mentioned user from adminship* 💔️


There are many hidden and fun keywords ;)

Hope you have a great day!`
}
module.exports = { info, help }
function info() {
    return `INFO!`
}


