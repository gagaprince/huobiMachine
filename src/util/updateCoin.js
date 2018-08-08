const jsonfile = require('jsonfile');
const path = require('path');
const jsonPath = path.resolve('config/symbol.json');

const GetAllCoin = require('../services/GetAllCoin');
const GetKline = require('../services/GetKline');

let Symbol = null;


module.exports={
    updateSymbol() {
        return GetAllCoin.allCoin().then((coins)=>{
            const usdt=[];
            const btc=[];
            const eth=[];
            coins.forEach((item,index)=>{
                GetKline.get15MK(item,'usdt',2,(res)=>{
                    if(res!=null){
                        // 说明属于usdtbase
                        console.log(`${item}属于usdt阵营`);
                        usdt.push(item);
                    }
                });
                GetKline.get15MK(item,'btc',2,(res)=>{
                    if(res!=null){
                        // 说明属于btcbase
                        console.log(`${item}属于btc阵营`);
                        btc.push(item);
                    }
                });
                GetKline.get15MK(item,'eth',2,(res)=>{
                    if(res!=null){
                        // 说明属于ethbase
                        console.log(`${item}属于eth阵营`);
                        eth.push(item);
                    }
                });
            });
            GetKline.onRequestClear(()=>{
                console.log('更新完毕');
                Symbol = jsonfile.readFileSync(jsonPath);
                Symbol['usdt']=usdt;
                Symbol['btc']=btc;
                Symbol['eth']=eth;
                Symbol['all']=coins;
                jsonfile.writeFileSync(jsonPath,Symbol,{spaces: 4, EOL: '\r\n'});
            });
        });
    },
    getSymbol(){
        if(!Symbol){
            Symbol = jsonfile.readFileSync(jsonPath);
        }
        return Symbol;
    }
}