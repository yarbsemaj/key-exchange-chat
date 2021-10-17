function random(size){
	return BigInt('0x'+genRanHex(size / 4))
}

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export default random