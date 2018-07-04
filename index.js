// const GetAllCoin = require('./src/services/GetAllCoin');
//
// GetAllCoin.allCoin().then((coins)=>{
//     console.log(coins);
//     console.log(coins.length);
// });

// const Task = require('./src/services/Monitor');
// Task.start();


// const HistoryAnalysis = require('./src/services/HistoryAnalysis');
// HistoryAnalysis.analysisByCoin('iost','btc',500);

const updateCoin = require('./src/util/updateCoin');
// updateCoin.updateSymbol();
updateCoin.getSymbol();