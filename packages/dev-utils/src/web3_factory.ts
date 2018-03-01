// HACK: web3 injects XMLHttpRequest into the global scope and ProviderEngine checks XMLHttpRequest
// to know whether it is running in a browser or node environment. We need it to be undefined since
// we are not running in a browser env.
// Filed issue: https://github.com/ethereum/web3.js/issues/844
(global as any).XMLHttpRequest = undefined;
import ProviderEngine = require('web3-provider-engine');
import RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

import { CoverageSubprovider } from '@0xproject/sol-cov';
import { EmptyWalletSubprovider, FakeGasEstimateSubprovider, GanacheSubprovider } from '@0xproject/subproviders';
import * as _ from 'lodash';

import { constants } from './constants';

// HACK: web3 leaks XMLHttpRequest into the global scope and causes requests to hang
// because they are using the wrong XHR package.
// importing web3 after subproviders fixes this issue
// Filed issue: https://github.com/ethereum/web3.js/issues/844
// tslint:disable-next-line:ordered-imports
import * as Web3 from 'web3';

export const web3Factory = {
    create(hasAddresses: boolean = true): Web3 {
        const provider = this.getRpcProvider(hasAddresses);
        const web3 = new Web3();
        web3.setProvider(provider);
        return web3;
    },
    getRpcProvider(hasAddresses: boolean = true): Web3.Provider {
        const provider = new ProviderEngine();
        if (_.isUndefined((global as any).__coverage_subprovider__)) {
            const artifactsPath = './src/artifacts';
            const contractsPath = './src/contracts';
            const networkId = 50;
            const coverageSubprovider = new CoverageSubprovider(artifactsPath, contractsPath, networkId);
            (global as any).__coverage_subprovider__ = coverageSubprovider;
        }
        provider.addProvider((global as any).__coverage_subprovider__);
        if (!hasAddresses) {
            provider.addProvider(new EmptyWalletSubprovider());
        }
        provider.addProvider(new FakeGasEstimateSubprovider(constants.GAS_ESTIMATE));
        provider.addProvider(
            new GanacheSubprovider({
                logger: console,
                verbose: false,
                port: 8545,
                networkId: 50,
                mnemonic: 'concert load couple harbor equip island argue ramp clarify fence smart topic',
            }),
        );
        // provider.addProvider(
        //     new RpcSubprovider({
        //         rpcUrl: constants.RPC_URL,
        //     }),
        // );
        provider.start();
        return provider;
    },
};
