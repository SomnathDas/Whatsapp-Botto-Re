const fs = require('fs-extra')
const axios = require('axios')
const pokeArray = JSON.parse(fs.readFileSync('./lib/pokedata/pkmnz.json'))

module.exports = { pkmzdata, pkmnabi, pkmntype, pkmnstats, capitalize, pokeCheck }

function Sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}


async function pkmzdata(pkmnm) {

	const pkmnz = await axios.get(`https://pokeapi.co/api/v2/pokemon/${await pokeCheck(pkmnm)}`)
        var pkurl = pkmnz.data.sprites.other['official-artwork'].front_default
	if (pkurl == null) {
 		var pkurl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pkmnz.data.id}.png`
	}
	
	var text = `👑️ Name: ${await capitalize(pkmnz.data.species.name)}

⭐️ ${await pkmntype(pkmnz.data)}

🎉️ ${await pkmnabi(pkmnz.data)}

💎️ ${await pkmnstats(pkmnz.data)}`
        
	return { "data": text, "url": pkurl}

}

async function pokeCheck(pokeName) {

		const dexNo = pokeArray.indexOf(pokeName.toLowerCase()) 
		return dexNo + 1

}
 

async function pkmnabi(pkdata) {
 	var abi = 'Abilities: |'
        let no = pkdata.abilities.length
	for (let i = 0; i < no; i++) {
                var cap = await capitalize(`${pkdata.abilities[i].ability.name}`)
		abi = abi+` ${cap} |`
	}
        return abi 
}

async function capitalize(sz) {
  	if (typeof sz !== 'string') return ''
  	return sz.charAt(0).toUpperCase() + sz.slice(1)
}

async function pkmntype(pkdata) {
 	var typ = 'Types: |'
        let no = pkdata.types.length
	for (let i = 0; i < no; i++) {
                var cap = await capitalize(`${pkdata.types[i].type.name}`)
		typ = typ+` ${cap} |`
	}
        return typ 
}

async function pkmnstats(pkdata) {
	var stat = 'Base Stats: |'
        let no = pkdata.stats.length
	for (let i = 0; i < no; i++) {
                var sta = await capitalize(`${pkdata.stats[i].stat.name}`)
		stat = stat+` ${sta}: ${pkdata.stats[i].base_stat} |`
	}
        return stat 
}


	
   



