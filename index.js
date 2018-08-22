const updateCoin = require('./src/util/updateCoin');
const explosiveStrategy = require('./src/services/explosiveStrategy');
const MailService = require('./src/services/MailService');
const testExplosiveStrategy = require('./src/test/testExplosiveStrategy');
const commonUtil = require('./src/util/commonUtil');
// updateCoin.updateSymbol();

const Symbol = updateCoin.getSymbol();

 // let coin = 'soc';//Symbol['usdt'][0];
const coinb = 'usdt';
// explosiveStrategy.beginControl(coin,coinb);

// testExplosiveStrategy.test(coin,coinb);

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

setInterval(()=>{
    console.log(`心跳：${commonUtil.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')}########`)
},10000);

