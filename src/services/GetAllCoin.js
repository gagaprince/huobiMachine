const rp = require('request-promise');
const config = require('../../config/config');

module.exports={
    allCoin(){
        const options = {
            uri: config.ALL_COIN,
            headers: {
                'content-type': 'application/json;charset=utf-8',
            },
            json: true
        };
        return rp(options)
        .then((json) => {
            if(json.status==='ok'){
                return json.data;
            }else{
                return [];
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
}
