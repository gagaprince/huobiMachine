const exposiveStrategy = require('../services/explosiveStrategy');
const GetKline = require('../services/GetKline');
module.exports={
    _request(coin,coinb){
        return new Promise((res)=>{
            GetKline.get1MK(coin,coinb,999,(json)=>{
                res(json.data);
            });
        });
    },
    consoleTime(minCha){
        const currentDate = new Date();
        currentDate.setTime(currentDate.getTime()-minCha*60*1000);
        console.log(`${currentDate.getHours()}:${currentDate.getMinutes()}`);
    },
    test(coin,coinb){
        this._request(coin,coinb).then((data)=>{
            let flag = 'find';
            let findObj = null;
            let sumFind = 0;
            let successFind = 0;
            let failFind = 0;
            const length = data.length;
            const testArray = new Array(length).fill(1);
            const ex = exposiveStrategy.test(coin,coinb);
            testArray.forEach((item,index)=>{
                if(index<=length-22){
                    if(flag==='find'){
                        const iArray = data.slice(-22-index,index!==0?-index:undefined);
                        findObj = ex._anysis(iArray);
                        if(findObj){
                            this.consoleTime(length-22-index);
                            console.log('找到一商机');
                            sumFind ++;
                            flag = 'fined';
                        }
                    }else{
                        const current = data.slice(-22-index,-21-index)[0];
                        if(current.high>=findObj.desPrice){
                            this.consoleTime(length-22-index);
                            console.log('止盈卖出');
                            successFind++;
                            flag='find';
                        }else if(current.low<=current.failPrice){
                            this.consoleTime(length-22-index);
                            console.log('止损卖出');
                            failFind++;
                            flag='find';
                        }
                    }
                }
            });
            console.log(`${coin}-${coinb},共发现商机${sumFind}次，成功${successFind}次，失败${failFind}次,当前find状态${flag}`);
        });
    }
}