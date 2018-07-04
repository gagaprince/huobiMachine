/*
* 获取k线数据
* */
const rp = require('request-promise');
const config = require('../../config/config');
const MAX_REQUEST = 3;

const requestList = [];
let requestLock = MAX_REQUEST;
let callbacks = [];

module.exports={
    get1MK(ct,ctb,size=5,fun){
        return this._getMK(ct,ctb,size,'1min',fun);
    },
    get15MK(ct,ctb,size=5,fun){
        return this._getMK(ct,ctb,size,'15min',fun);
    },
    getDK(ct,ctb,size=5,fun){
        return this._getMK(ct,ctb,size,'1day',fun);
    },
    _getMK(ct,ctb,size=5,period,fun){
        requestList.push({ct,ctb,size,period,fun});
        return this._beginRequest();
    },
    _beginRequest(){
        if(requestLock>0 && requestList.length>0){
            requestLock-- ;
            let requestArgs = requestList.shift();
            const {ct,ctb,size,period,fun} = requestArgs;
            const options = {
                uri: config.KLINE,
                qs:{
                    period,
                    size,
                    symbol:`${ct}${ctb}`
                },
                timeout:3000,
                headers: {
                    'content-type': 'application/json;charset=utf-8',
                },
                json: true
            };
            console.log(options);
            return rp(options)
            .then((json) => {
                if(json.status==='ok'){
                    fun(json);
                    return json;
                }else{
                    fun();
                    return null;
                }
            })
            .catch((err) => {
                // console.log(err);
                return null;
            }).then((res)=>{
                requestLock++;
                this._beginRequest();
                return res;
            });
        }else {
            if(requestList.length===0 && requestLock === MAX_REQUEST){
                console.log('请求队列执行完毕');
                callbacks.forEach((fun)=>{
                    fun();
                });
                callbacks=[];
            }
            return Promise.resolve();
        }
    },
    onRequestClear(fun){
        callbacks.push(fun);
    }
}
