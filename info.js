exports.info = async function() {
   
    while(true) {

        await client.setMyStatus('Link ⚔️');
        await Sleep(60000)
        await client.setMyStatus('Zelda ✨️');
        await Sleep(60000)
        await client.setMyStatus('Ganon 🔱️');
        await Sleep(60000)
    }

}

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
