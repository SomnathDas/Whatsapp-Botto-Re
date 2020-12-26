// edit it to change the bot's name
const botname = 'NACO' 

function help(prefix, pushname) {
    return `👋️Hi ${pushname}, I'm ${botname}!

Prefix - ${prefix}

🌟️ Lista de comandos 🌟️

*_CMD: ${prefix}profile_*
*Descripcion: Muestra la información del usuario*

*_CMD: ${prefix}info_*
*Descripcion: Muestra la información sobre el bot* 🌐️

*_CMD: ${prefix}sticker_*
*Descripcion: Convierte imágenes en stickers* 🔖️
*Uso: ${prefix}sticker como título de la imagen*

*_CMD: ${prefix}gsticker <giphy URL>_*
*Descripcion: Convierte gifs en stickers* 🌠️

*_CMD: ${prefix}sauce_*
*Descripcion: Dar es el título de la imagen especificada* ❤️
*Uso: ${prefix}sauce como título o respuesta de cualquier imagen*

*_CMD: ${prefix}pokemon_*
*Descripcion: Devuelve la imagen de un Pokémon aleatorio* 😺️

*_CMD: ${prefix}waifu_*
*Descripcion: Devuelve la imagen de un waifu aleatorio* 💌️

*_CMD: ${prefix}anime <anime name>_*
*Description: Devuelve la información del anime dado* 📺️
*Uso: ${prefix}anime sakura trick*

*_${prefix}tts <language-code> <text>_* [Desactivado debido al riesgo de ban]
*Descripcion: Convierte texto en voz* 🗣️
*Uso: ${prefix}tts es airam maricon*

*_${prefix}quotemaker | citar | autor |_*
*Descripcion: Convert the given quote to an image*
Uso: ${prefix}qm | En cuarentena cualquier agujero es trinchera | Lucas 🌌️

*_${prefix}lyrics <song name>_*
*Descripcion: Muestra la letra de la canción dada* 🎶️
*Uso: ${prefix}lyrics sasageyo*
            
*_CMD: ${prefix}neko_*
*Descripcion: Muestra la imagen de un gato al azar* 🐈️

*_CMD: ${prefix}doggo_*
*Descripcion: Muestra la imagen de un cachorro al azar* 🐕️

*_CMD: ${prefix}rpaper_*
*Descripcion: Muestra un fondo de pantalla aleatorio* 🌆️

*_CMD: ${prefix}animeneko_*
*Descripcion: Muestra la imagen de un gato de anime. ;)* 💚️

*_CMD: ${prefix}wallpaper <palabra clave>_*
*Descripcion: Devuelve un fondo de pantalla de anime aleatorio basado en la palabra clave* 📱️
*Uso: ${prefix}wallpaper Black Butler*

*_CMD: ${prefix}covid <país>_*
*Descripcion: Muestra las estadísticas en vivo de Covid-19 del país dado* 🌍️
*Uso: ${prefix}covid Japan*

*_CMD: ${prefix}meme_*
*Descripcion: Devuelve un meme aleatorio* 🎷️ 

*_CMD: ${prefix}sr <subreddit_title>_*
*Descripcion: Muestra una publicación del subreddit dado* 💻️
*Uso: ${prefix}sr memes*

*_CMD: ${prefix}quotes_* [Disabled]
*Descripcion: Devuelve una cita que te dará crisis existenciales o sabiduría* 🌠️

*_CMD: ${prefix}groupinfo_*
*Descripcion: Muestra la información del grupo* ⛱️

*_CMD: ${prefix}roll_*
*Descripcion: Tira un dado* 🎲

*_CMD: ${prefix}flip_*
*Descripcion: Lanza una moneda* 🟡

Comandos de administrador 📙️

Solo los administradores de grupo pueden ejecutar este comando

*_CMD: ${prefix}ping <text>_*
*Descripcion: Etiquetas a todos los miembros del grupo* 🔊️
*Uso: ${prefix}ping Bueno, en ese caso*

*_CMD: ${prefix}delete_*
*Descripcion: Elimina el mensaje del Bot* 💔️
*Uso: Enviar ${prefix}delete como respuesta al mensaje del bot*

Para ejecutar los siguientes comandos, el bot y el autor deben ser administradores

*_CMD: ${prefix}seticon_*
*Descripcion: Establece la imagen citada como el icono de grupo* 🎆️

*_CMD: ${prefix}kick @user_*
*Descripcion: Expulsa a la persona mencionada del grupo* 🏌️

*_CMD: ${prefix}promote @user_*
*Descripcion: Hace que el usuario mencionado sea administrador* 👑️

*_CMD: ${prefix}demote @user_*
*Descripcion: Degrada al usuario mencionado de la administración* 💔️


Hay muchas palabras clave ocultas y divertidas. ;)

Espero que tengas un buen día!`
}
module.exports = { info, help }
function info() {
    return `INFO!`
}


