// import { create, Client } from '@open-wa/wa-automate';
const wa = require('@open-wa/wa-automate');
 
wa.create().then(client => start(client));
 
function start(client) {
  client.onMessage(message => {
    if (message.body === 'Hi') {
      client.sendText(message.from, '👋 Hello!');
    }
  });
}
