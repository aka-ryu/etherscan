const mysql = require("mysql2/promise");
const pool = require("./lib/pool");
let timez = require("moment-timezone");

const METAWIZ_MINT = 1;
const METAWIZ_EX = 2;
const METAWIZ_APPROVAL = 3;
const METAWIZ_MINT_FAIL = 4;
const METAWIZ_EX_FAIL = 5;
// const TEST_EX = 6;

async function Lookup_Database() {
    let info;
    console.log("전 info", info)
    let sql = `SELECT * FROM test_table;`;
    let connect = await pool.getConnection(async conn => conn);
    try {
        await connect.beginTransaction();
        info = await connect.query(sql);
        await connect.commit();
    } catch (e) {
        console.log(e);
        if (connect) {
            await connect.rollback();
            console.log('Rollback');
        }
    } finally {
        if (connect) {
            await connect.release();
        }
        const result = JSON.stringify(info[0]);
        console.log(result);
    }
    return info;
}

async function Insert_Data(Tx_Hash, blockNumber, event, From, To, TokenID, Token_Amount, Token_Type, Token_Supply, TimeStamp) {
    let info = null;
    let moment = new Date();
    let now = timez.tz(moment, "Asia/Seoul").format("yyyy-MM-DD HH:mm:ss");
    let sql = '';
    sql = ` INSERT INTO metawiz_mint (tx_hash, blocknumber,  eventname, from_address, to_address, tokenid, token_amount, token_type, token_supply, blocktime, created_at) VALUES ("${Tx_Hash}", ${blockNumber},  "${event}", "${From}", "${To}", "${TokenID}", "${Token_Amount}", "${Token_Type}", "${Token_Supply}", "${TimeStamp}", "${now}") ;`;
    let connect = await pool.getConnection(async conn => conn);
    try {
        await connect.beginTransaction();
        info = await connect.query(sql);
        await connect.commit();
    } catch (e) {
        console.log(e);
        if (connect) {
            await connect.rollback();
            console.log("Rollback");
        }
    } finally {
        if (connect) {
            await connect.release();
        }
    }
    return info;
}

async function Insert_Exchange_Data(blockNumber, Tx_Hash, event, Buyer, Seller, tokenid, value, token_type, royalty, royalty_recipient, fee, Actual_Amount, price, blocktime) {
    let info = null;
    let moment = new Date();
    let now = timez.tz(moment, "Asia/Seoul").format("yyyy-MM-DD HH:mm:ss");
    let sql = '';
    sql = `INSERT INTO metawiz_exchange (blocknumber, tx_hash, event, buyer, seller, tokenid, value, token_type, royalty, royalty_recipient, fee, actual_amount, price, blocktime, created_at) VALUES (${blockNumber}, "${Tx_Hash}", "${event}", "${Buyer}", "${Seller}", "${tokenid}", "${value}", "${token_type}", "${royalty}", "${royalty_recipient}", "${fee}", "${Actual_Amount}", "${price}", "${blocktime}", "${now}") ; `;
    let connect = await pool.getConnection(async conn => conn);
    try {
        await connect.beginTransaction();
        info = await connect.query(sql);
        await connect.commit();
    } catch (e) {
        console.log(e);
        if (connect) {
            await connect.rollback();
            console.log("Rollback");
        }
    } finally {
        if (connect) {
            await connect.release();
        }
    }
    return info;
}

async function Get_BlockNum(table) {
    let info = null;
    let sql = null;
    switch (table) {
        case METAWIZ_MINT:
            sql = `SELECT MAX(blocknumber) FROM metawiz_mint ;`;
            break;

        case METAWIZ_EX:
            sql = `SELECT MAX(blocknumber) FROM metawiz_exchange ;`;
            break;

        case METAWIZ_APPROVAL:
            sql = `SELECT MAX(blockNumber) FROM metawiz_approval ;`;
            break;

        case METAWIZ_MINT_FAIL:
            sql = `SELECT MAX(blockNumber) FROM metawiz_fail_mint ;`;
            break;

        case METAWIZ_EX_FAIL:
            sql = `SELECT MAX(blocknumber) FROM metawiz_fail_exchange ;`;
            break;

        // case TEST_EX:
        //     sql = `SELECT MAX(blockNumber) FROM test_penta_exchange ; `;
        //     break;
    }
    connect = await pool.getConnection(async conn => conn);
    try {
        await connect.beginTransaction();
        info = await connect.query(sql);
        await connect.commit();
    } catch (e) {
        console.log(e);
        await connect.rollback();
    }
    finally {
        if (connect) {
            await connect.release();
        }
    }
    return info[0];
}

async function Save_Fail_Mint(blockNumber, tx_hash, status, signer, contract_addr, blocktime) {
    let info = null;
    let moment = new Date();
    let now = timez.tz(moment, "Asia/Seoul").format("yyyy-MM-DD HH:mm:ss");
    let sql = ` INSERT INTO metawiz_fail_mint (blocknumber, tx_hash, status,signer, contract_addr, blocktime, created_at) VALUES (${blockNumber}, "${tx_hash}", "${status}", "${signer}", "${contract_addr}", "${blocktime}", "${now}") ;`;
    let connect = await pool.getConnection(async conn => conn);
    try {
        await connect.beginTransaction();
        await connect.query(sql);
        await connect.commit();
    } catch (e) {
        console.log(e);
        if (connect) {
            await connect.rollback();
            console.log("Rollback");
        }
    } finally {
        if (connect) {
            await connect.release();
        }
    }
}

async function Save_Fail_Exchange(blockNumber, tx_hash, status, signer, contract_addr, price, blocktime) {
    let info = null;
    let moment = new Date();
    let now = timez.tz(moment, "Asia/Seoul").format("yyyy-MM-DD HH:mm:ss");
    let sql = `INSERT INTO metawiz_fail_exchange (blocknumber, tx_hash, status, signer, contract_addr, cancel_payment, blocktime, created_at) VALUES (${blockNumber}, "${tx_hash}", "${status}" ,"${signer}", "${contract_addr}", "${price}", "${blocktime}", "${now}") ;`;
    let connect = await pool.getConnection(async conn => conn);
    try {
        await connect.beginTransaction();
        await connect.query(sql);
        await connect.commit();
    } catch (e) {
        console.log(e);
        if (connect) {
            await connect.rollback();
            console.log("Rollback");
        }
    } finally {
        if (connect) {
            await connect.release();
        }
    }
}

// async function Save_Approval_Data(blockNumber_in, Tx_Hash_in, Event_in, Owner_in, Operator_in, Approved_in, TimeStamp_in)
async function Save_Approve_data(blockNumber, Tx_Hash, Event, Owner, Operator, Approved, CA, TokenID, TimeStamp) {
    let info = null;
    let moment = new Date();
    let now = timez.tz(moment, "Asia/Seoul").format("yyyy-MM-DD HH:mm:ss");
    let sql = `INSERT INTO metawiz_approval (blocknumber, tx_hash, event, owner, operator, approved,ca, tokenid, blocktime, created_at) VALUES (${blockNumber}, "${Tx_Hash}", "${Event}", "${Owner}", "${Operator}", "${Approved}", "${CA}", "${TokenID}", "${TimeStamp}", "${now}") ;`;
    let connect = await pool.getConnection(async conn => conn);
    try {
        await connect.beginTransaction();
        await connect.query(sql);
        await connect.commit();
    } catch (e) {
        console.log(e);
        if (connect) {
            await connect.rollback();
            console.log("Rollback");
        }
    } finally {
        if (connect) {
            await connect.release();
        }
    }
}

const DEPOSIT_CHECK = async (blocknumber, tx_hash, tx_id) => {

    let info;
    let sql = `INSERT INTO test_table (blocknumber, tx_hash, tx_id) VALUES (${blocknumber}, "${tx_hash}", "${tx_id}")`
    let connect = await pool.getConnection(async conn => conn);

    try{
        await connect.beginTransaction();
        info = await connect.query(sql);
        await connect.commit();
    
    } catch (e) {
        console.log(e);
        if (connect) {
            await connect.rollback();
            console.log("Rollback");
        }

    } finally {
        if(connect) {
            connect.release();
        }
    }

}

// async function test_Insert(blockNumber, Tx_Hash, event, Buyer, Seller, tokenid, value, token_type, royalty, royalty_recipient, fee, Actual_Amount, price, blocktime) {
//     let info = null;
//     let sql = '';
//     sql = `INSERT INTO test_penta_exchange (blocknumber, tx_hash, event, buyer, seller, tokenid, value, token_type, royalty, royalty_recipient, fee, actual_amount, price, blocktime, created_at) VALUES (${blockNumber}, "${Tx_Hash}", "${event}", "${Buyer}", "${Seller}", "${tokenid}", "${value}", "${token_type}", "${royalty}", "${royalty_recipient}", "${fee}", "${Actual_Amount}", "${price}", "${blocktime}", NOW()) ; `;
//     let connect = await pool.getConnection(async conn => conn);
//     try{
//         await connect.beginTransaction();
//         info = await connect.query(sql);
//         await connect.commit();
//     }catch(e){
//         console.log(e);
//         if (connect){
//             await connect.rollback();
//             console.log("Rollback");
//         }
//     }finally{
//         if(connect){
//             await connect.release();
//         }
//     }
//     return info;
// }

module.exports = {
    Insert_Data, Insert_Exchange_Data, Get_BlockNum, Save_Fail_Mint, Save_Fail_Exchange, Save_Approve_data, Lookup_Database, DEPOSIT_CHECK
}