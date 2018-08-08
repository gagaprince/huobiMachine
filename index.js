const updateCoin = require('./src/util/updateCoin');
const explosiveStrategy = require('./src/services/explosiveStrategy');
// updateCoin.updateSymbol();

const Symbol = updateCoin.getSymbol();

const coin = 'soc';//Symbol['usdt'][0];
const coinb = 'usdt';
explosiveStrategy.beginControl(coin,coinb);
