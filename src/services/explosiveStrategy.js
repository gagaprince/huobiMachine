// 起爆策略
// 策略内容  选择1分钟k线 拿到过去20段k线，如果最后一根k线明显比之前k线强 则报警
const HClass = require('../base/HClass');
const GetKline = require('./GetKline');
const MailService = require('./MailService');
const commonUtil = require('../util/commonUtil');

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
            GetKline.get1MK(this.coin,this.coinb,32,(json)=>{
                res(json.data);
            });
        });
    },
    _anysis(data){
        console.log('*******************');
        // data = data.splice(40,20);
        const max = this.max(data.map(item=>item.amount),25);
        const junDate = this.jun(data.map(item=>item.amount),20);
        const preJun20 = junDate[1];
        const curJun20 = junDate[0];
        const curVal = data[0].amount;
        const curPrice = data[0].close;
        const prePrice = data[1].close;
        const curInc = ((curPrice/prePrice - 1)*100).toFixed(4);
        const highInc = ((data[0].high/prePrice-1)*100).toFixed(4);
        // console.log('当前id:'+data[0].id);
        // console.log('最大量极值:'+max);
        // console.log('平均量:'+preJun20);
        // console.log('当前平均量:'+curJun20);
        // console.log('当前量:'+curVal);
        // console.log('当前价:'+curPrice);
        // console.log('当前涨跌幅:'+curInc);
        // console.log('当前最高涨幅:'+highInc);

        if(curInc>1.5 && curVal>2*max){
            console.log('*******************');
            const text =`当前${this.coin}涨幅超过1.5% 且 有放量 可以关注`;
            console.log(`当前时间${commonUtil.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')}`)
            console.log(text);
            const desPrice = curPrice*1.05;
            const failPrice = curPrice*0.95;
            MailService.sendMailText(text,`当前价格${curPrice}，目标价格${desPrice}，止损价格${failPrice}~`);
            return {
                curPrice,
                desPrice,
                failPrice
            };
        }
        return false;
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
    },
    max(data,num){
        if(data && data.length>num){
            let max = 0;
            data.forEach((item,index)=>{
                if(index===0)return;
                if(index<=num){
                    max = item>max?item:max;
                }
                return index>num;
            });
            return max;
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
    },
    test(coin,coinb){
        return new Explosive(coin,coinb);
    }
}