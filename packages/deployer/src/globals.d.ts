declare module 'solc' {
    export interface SolcInstance {
        compile(sources: any, optimizerEnabled: number, findImports: (importPath: string) => any): any; // TODO
    }
    export function loadRemoteVersion(versionName: string, cb: (err: Error | null, res?: SolcInstance) => void): void;
    export function setupMethods(solcBin: any): SolcInstance;
}

declare module 'web3-eth-abi' {
    // tslint:disable-next-line:completed-docs
    export function encodeParameters(typesArray: string[], parameters: any[]): string;
}
