const Mysql = require("./mysqldb/database");
const Web3 = require('web3');

require("dotenv").config();

const INFURA_KEY = process.env.INFURA_KEY;
const NETWORK = process.env.NETWORK;


const web3 = new Web3(new Web3.providers.HttpProvider(`https://${NETWORK}.infura.io/v3/${INFURA_KEY}`));


// const Lookup = async () => {
//     Mysql.Lookup_Database();
// }

// Lookup();

// infura wss 이용 해당내용을 지속적으로 구독하기 위한 변수
let web3ws = new Web3(new Web3.providers.WebsocketProvider(`wss://${NETWORK}.infura.io/ws/v3/${INFURA_KEY}`, {
    // @ts-ignore
    clientConfig: {
        maxReceivedFrameSize: 100000000 * 10,
        maxReceivedMessageSize: 100000000 * 10, // 요청이 많이 발생하면 응답이 오지 않으므로 최대 ReceivedMessageSize를 10배 증가시킨다.
        keepalive: true,
        keepaliveInterval: 60000	// milliseconds
    },
    reconnect: {
        auto: true,
        delay: 5000, //ms
        maxAttempts: 5,
        onTimeout: false
    }
}));


// txid,txhash 로 내용 읽어오기 (txid,txhash 는 같은의미)
const GET_TX_DATA = async () => {
    let info;
    let txReceipt = await web3.eth.getTransactionReceipt('0xd1a22463a0c16e333852301ae7b589044175aac81761fd5e300570fc544b467e');
    if (txReceipt.status) {
        
        let tx = await web3.eth.getTransaction('0xd1a22463a0c16e333852301ae7b589044175aac81761fd5e300570fc544b467e');
        console.log(JSON.stringify(tx, null, 2));
        console.log(JSON.stringify(txReceipt));
        console.log("-------------------------------")
        console.log("-------------------------------")
        console.log("-------------------------------")
        console.log(typeof(txReceipt.transactionHash));
        
        try {
            Mysql.DEPOSIT_CHECK(txReceipt.blockNumber, txReceipt.transactionHash.toString(), txReceipt.transactionHash.toString());
            console.log("DATA SAVE");
        } catch (e) {
            console.log(e);
            console.log("SAVE ERROR");
        }
    } else {
        console.log('거래 실패');
    }


}

GET_TX_DATA();


