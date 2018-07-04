const GetAllCoin = require('./GetAllCoin');
const GetKline = require('./GetKline');
const Promise = require('bluebird');


const HistoryAnalysis = {
    analysisByCoin(ct1,ct2,size){
        GetKline.get15MK(ct1,ct2,size).then((ret)=>{
            this.analysisHistory(ret.data);
        });
    },
    analysisHistory(kData){
        let length = kData.length;
        const ret = [];
        kData.forEach((data,index)=>{
            if(index<length-3){
                this.analysisYesAndTo(kData[index+3],kData[index+2],kData[index+1],data,ret,index);
            }
        });

        ret.forEach((re)=>{
            if(re.flag){
                // console.log(re);
            }
        });
        if(ret.length>0){
            const length = ret.length;
            const suret = ret.filter((re)=>{
                return re.flag;
            });
            const sulen = suret.length;
            console.log(ret);
            console.log('成功率：'+sulen/length);
        }else{
            console.log('没有出现策略中的k线');
        }

    },
    analysisYesAndTo(yess,yes,to,next,res,index){
        if(yes&&to&&next){
            // console.log('分析单个单元');
            // console.log(to);
            if (this.highPercent(yes.close,to.close,5) && !this.highPercent(yess.close,yes.close,5)){
                if (this.highPercent(to.close,next.high,3)){
                    res.push({
                        index,
                        yess,
                        yestoday:yes,
                        today:to,
                        next,
                        flag:true
                    });
                }else{
                    res.push({
                        index,
                        yess,
                        yestoday:yes,
                        today:to,
                        next,
                        flag:false
                    });
                }
            }
        }
    },
    highPercent(yes,to,score){
        if(to && yes){
            let higher = (to/yes - 1)*100;
            if(higher>score){
                return true;
            }
        }
        return false;
    }
}

module.exports = HistoryAnalysis;