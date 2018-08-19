const updateCoin = require('./src/util/updateCoin');
const explosiveStrategy = require('./src/services/explosiveStrategy');
const MailService = require('./src/services/MailService');
const testExplosiveStrategy = require('./src/test/testExplosiveStrategy');
// updateCoin.updateSymbol();

const Symbol = updateCoin.getSymbol();

// let coin = Symbol['usdt'][0];
const coinb = 'usdt';
// explosiveStrategy.beginControl(coin,coinb);

// MailService.sendMailText('测试一下邮箱');
Symbol['usdt'].forEach((coin,index)=>{
    /*setTimeout(()=>{
        console.log(`***********测试${coin}-${coinb}************`);
        testExplosiveStrategy.test(coin,coinb);
    },5000*index);*/
    setTimeout(()=>{
        explosiveStrategy.beginControl(coin,coinb);
    },1500*index);

});


