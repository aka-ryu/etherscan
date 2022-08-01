import io.api.etherscan.core.impl.EtherScanApi;
import io.api.etherscan.executor.IHttpExecutor;
import io.api.etherscan.executor.impl.HttpExecutor;
import io.api.etherscan.model.Abi;
import io.api.etherscan.model.Balance;
import io.api.etherscan.model.EthNetwork;
import io.api.etherscan.model.Log;
import io.api.etherscan.model.proxy.TxProxy;
import io.api.etherscan.model.query.LogOp;
import io.api.etherscan.model.query.impl.LogQuery;
import io.api.etherscan.model.query.impl.LogQueryBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

public class pratice {
    public static void main(String[] args) {

        EtherScanApi api = new EtherScanApi("WYIC9UH9GVDKJTXRDAR24CTUN7RJ6VA7F7",EthNetwork.RINKEBY);

        int connectionTimeout = 10000;
        int readTimeout = 7000;

        Supplier<IHttpExecutor> supplier = () -> new HttpExecutor(connectionTimeout);
        Supplier<IHttpExecutor> supplierFull = () -> new HttpExecutor(connectionTimeout, readTimeout);

//        EtherScanApi api = new EtherScanApi();
        Balance balance = api.account().balance("0x1264476F522f956A53C7AA60D09C1E8Fe8Ee20a7");

//        System.out.println(balance);



        Abi abi = api.contract().contractAbi("0xc778417E063141139Fce010982780140Aa0cD5Ab");
//        System.out.println(abi);

        Optional<TxProxy> tx = api.proxy().tx("0x8142f97949f03bfbdd6b716dcef03ff411d296077edf89e6aba39b91c04b9691");

        System.out.println(tx);

        LogQuery query = LogQueryBuilder.with("0xe66b77027C86816398Dc692f5559c3A1B5fBEC4A")
                .build();
        List<Log> logs = api.logs().logs(query);

        List<String> logList = new ArrayList<>();
        logs.forEach(log -> {
            if(!logList.contains(log.getTransactionHash())) {
                logList.add(log.getTransactionHash());
            }
        });

//        System.out.println(logList.size());
//        System.out.println(logList);
//
//        System.out.println(logs.size());
//        System.out.println(logs);

    }
}
