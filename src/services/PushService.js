const commonUtil = require('../util/commonUtil');
const rp = require('request-promise');
module.exports={
    pushText(zt,desc){
        const url = 'http://gagalulu.wang/brain/pushHuoBiMsg';
        const time = commonUtil.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
        const openId = 'ou47z0CB-3Hjdl1MlRhrBAtaAC4c';
        const options = {
            uri: url,
            qs:{
                time,openId,zt,desc
            },
            method:'POST',
            timeout:10000
        };
        console.log(options);
        return rp(options)
        .then((json) => {
           console.log(json);
        });
    }
}