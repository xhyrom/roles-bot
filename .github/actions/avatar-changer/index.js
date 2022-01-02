const fs = require('fs');
const hyttpo = require('hyttpo').default;

const list = fs.readFileSync('./list.txt', 'utf-8').split('\n');
let now = Number(fs.readFileSync('./now.txt', 'utf-8'));

(async() => {
    if (now === list.length) now = 0;

    const url = list[now + 1];

    const req = await hyttpo.request({
        method: 'GET',
        responseType: 'buffer',
        url
    }).catch(e => e)

    const base64 = `data:image/png;base64,${req.data.toString('base64')}`;

    const bot = await hyttpo.request({
        url: 'https://discord.com/api/v9/applications/745599648110215260',
        method: 'PATCH',
        headers: {
            'Authorization': 'Bot'
        },
        body: JSON.stringify({
            icon: base64
        })
    }).catch(e => e)

    console.log(bot)
})();