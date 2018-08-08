// 起爆策略
// 策略内容  选择1分钟k线 拿到过去20段k线，如果最后一根k线明显比之前k线强 则报警
const HClass = require('../base/HClass');
const GetKline = require('./GetKline');

const Explosive = HClass.extend({
    coin:null,
    coinb:null,
    interval:null,
    stepTime:10000,
    ctor(coin,coinb){
        this.coin = coin;
        this.coinb = coinb;
    },
    _step(){
        // 请求20段k线
        this._request().then((data)=>{
            this._anysis(data);
        });
    },
    _request(){
        return new Promise((res)=>{
            GetKline.get1MK(this.coin,this.coinb,22,(json)=>{
                res(json.data);
            });
        });
    },
    _anysis(data){
        console.log('*******************');
        // data = data.splice(40,20);
        const junDate = this.jun(data.map(item=>item.amount),20);
        console.log('当前id:'+data[0].id);
        console.log('平均量:'+junDate[1]);
        console.log('当前平均量:'+junDate[0]);
        console.log('当前量:'+data[0].amount);
        console.log('当前价:'+data[0].close);

    },
    start(){
        this.stop();
        this._step();
        this.interval = setInterval(()=>{
            this._step();
        },this.stepTime);
    },
    stop(){
        if(this.interval){
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    //计算除第一个数据外 剩下的平均量
    jun(data,num){
        if(data && data.length>num){
            let sum = 0;
            let count = num;
            const ret = [];
            data.forEach((item,index)=>{
                sum += item;
                return --count==0;
            });
            let jun = sum/num;
            ret.push(jun.toFixed(2));
            for(let i=0;i<data.length-num;i++){
                jun = (data[num+i]-data[i])/num + jun;
                ret.push(jun.toFixed(2));
            }
            return ret;
        }
        return 0;
    }

});

const coinMap = {};

module.exports={
    beginControl(coin,coinb){
        let coinStrategy = null;
        if (!coinMap[coin+coinb]){
            coinStrategy= new Explosive(coin,coinb);
            coinMap[coin+coinb] = coinStrategy;
        }
        coinStrategy.start();
    },
    stopControl(coin,coinb){
        if(coinMap[coin+coinb]){
            let coinStrategy = coinMap[coin+coinb];
            coinStrategy.stop();
        }
    }
}