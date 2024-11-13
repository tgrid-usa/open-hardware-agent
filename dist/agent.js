"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolderAgentInitializer = void 0;
const indy_vdr_1 = require("@aries-framework/indy-vdr");
const node_1 = require("@aries-framework/node");
const anoncreds_nodejs_1 = require("@hyperledger/anoncreds-nodejs");
const aries_askar_nodejs_1 = require("@hyperledger/aries-askar-nodejs");
const indy_vdr_nodejs_1 = require("@hyperledger/indy-vdr-nodejs");
const core_1 = require("@aries-framework/core"); // replace with actual module imports
const anoncreds_1 = require("@aries-framework/anoncreds");
const anoncreds_rs_1 = require("@aries-framework/anoncreds-rs");
const askar_1 = require("@aries-framework/askar");
const ws_1 = require("ws");
class HolderAgentInitializer {
    constructor() {
        this.holderAgent = null;
        this.socketServer = new ws_1.Server({ noServer: true });
        this.wsInboundTransport = new node_1.WsInboundTransport({ server: this.socketServer });
        // // When an 'upgrade' to WS is made on our http server, we forward the
        // // request to the WS server
        // httpInboundTransport: any.server: any?.on('upgrade', (request: any, socket: any, head: any) => {
        //   this.socketServer.handleUpgrade(request, socket as Socket, head, (socket: any) => {
        //     this.socketServer.emit('connection', socket, request)
        //   })
        // })
    }
    initializeAgent(seed, IndyDid, label, walletConfig, endpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const seedValue = core_1.TypedArrayEncoder.fromString(seed);
            const indyDid = `did:indy:bcovrin:test:${IndyDid}`;
            const config = {
                label,
                walletConfig,
                endpoints,
                logger: new core_1.ConsoleLogger(core_1.LogLevel.debug)
            };
            this.holderAgent = new core_1.Agent({
                config,
                dependencies: node_1.agentDependencies,
                modules: {
                    // Register the Askar module on the agent
                    // We do this to have access to a wallet
                    askar: new askar_1.AskarModule({
                        ariesAskar: aries_askar_nodejs_1.ariesAskar,
                    }),
                    connections: new core_1.ConnectionsModule({ autoAcceptConnections: true }),
                    anoncredsRs: new anoncreds_rs_1.AnonCredsRsModule({
                        anoncreds: anoncreds_nodejs_1.anoncreds,
                    }),
                    mediationRecipient: new core_1.MediationRecipientModule({
                        mediatorInvitationUrl: "https://public.mediator.indiciotech.io?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiMDVlYzM5NDItYTEyOS00YWE3LWEzZDQtYTJmNDgwYzNjZThhIiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL3B1YmxpYy5tZWRpYXRvci5pbmRpY2lvdGVjaC5pbyIsICJyZWNpcGllbnRLZXlzIjogWyJDc2dIQVpxSktuWlRmc3h0MmRIR3JjN3U2M3ljeFlEZ25RdEZMeFhpeDIzYiJdLCAibGFiZWwiOiAiSW5kaWNpbyBQdWJsaWMgTWVkaWF0b3IifQ==",
                        mediatorPickupStrategy: core_1.MediatorPickupStrategy.Implicit
                    }),
                    indyVdr: new indy_vdr_1.IndyVdrModule({
                        indyVdr: indy_vdr_nodejs_1.indyVdr,
                        networks: [
                            {
                                isProduction: false,
                                indyNamespace: 'bcovrin:test',
                                genesisTransactions: `{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"10.224.0.220","client_port":9702,"node_ip":"10.224.0.220","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node2","blskey":"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk","blskey_pop":"Qr658mWZ2YC8JXGXwMDQTzuZCWF7NK9EwxphGmcBvCh6ybUuLxbG65nsX4JvD4SPNtkJ2w9ug1yLTj6fgmuDg41TgECXjLCij3RMsV8CwewBVgVN67wsA45DFWvqvLtu4rjNnE9JbdFTc1Z4WCPA3Xan44K1HoHAq9EVeaRYs8zoF5","client_ip":"10.224.0.220","client_port":9704,"node_ip":"10.224.0.220","node_port":9703,"services":["VALIDATOR"]},"dest":"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb"},"metadata":{"from":"EbP4aYNeTHL6q385GuVpRV"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node3","blskey":"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5","blskey_pop":"QwDeb2CkNSx6r8QC8vGQK3GRv7Yndn84TGNijX8YXHPiagXajyfTjoR87rXUu4G4QLk2cF8NNyqWiYMus1623dELWwx57rLCFqGh7N4ZRbGDRP4fnVcaKg1BcUxQ866Ven4gw8y4N56S5HzxXNBZtLYmhGHvDtk6PFkFwCvxYrNYjh","client_ip":"10.224.0.220","client_port":9706,"node_ip":"10.224.0.220","node_port":9705,"services":["VALIDATOR"]},"dest":"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya"},"metadata":{"from":"4cU41vWW82ArfxJxHkzXPG"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node4","blskey":"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw","blskey_pop":"RPLagxaR5xdimFzwmzYnz4ZhWtYQEj8iR5ZU53T2gitPCyCHQneUn2Huc4oeLd2B2HzkGnjAff4hWTJT6C7qHYB1Mv2wU5iHHGFWkhnTX9WsEAbunJCV2qcaXScKj4tTfvdDKfLiVuU2av6hbsMztirRze7LvYBkRHV3tGwyCptsrP","client_ip":"10.224.0.220","client_port":9708,"node_ip":"10.224.0.220","node_port":9707,"services":["VALIDATOR"]},"dest":"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA"},"metadata":{"from":"TWwCRQRZ2ZHMJFn9TzLp7W"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008"},"ver":"1"}`,
                                // genesisTransactions: `{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"4.194.26.38","client_port":9702,"node_ip":"4.194.26.38","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}
                                // {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node2","blskey":"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk","blskey_pop":"Qr658mWZ2YC8JXGXwMDQTzuZCWF7NK9EwxphGmcBvCh6ybUuLxbG65nsX4JvD4SPNtkJ2w9ug1yLTj6fgmuDg41TgECXjLCij3RMsV8CwewBVgVN67wsA45DFWvqvLtu4rjNnE9JbdFTc1Z4WCPA3Xan44K1HoHAq9EVeaRYs8zoF5","client_ip":"4.194.26.38","client_port":9704,"node_ip":"4.194.26.38","node_port":9703,"services":["VALIDATOR"]},"dest":"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb"},"metadata":{"from":"EbP4aYNeTHL6q385GuVpRV"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc"},"ver":"1"}
                                // {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node3","blskey":"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5","blskey_pop":"QwDeb2CkNSx6r8QC8vGQK3GRv7Yndn84TGNijX8YXHPiagXajyfTjoR87rXUu4G4QLk2cF8NNyqWiYMus1623dELWwx57rLCFqGh7N4ZRbGDRP4fnVcaKg1BcUxQ866Ven4gw8y4N56S5HzxXNBZtLYmhGHvDtk6PFkFwCvxYrNYjh","client_ip":"4.194.26.38","client_port":9706,"node_ip":"4.194.26.38","node_port":9705,"services":["VALIDATOR"]},"dest":"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya"},"metadata":{"from":"4cU41vWW82ArfxJxHkzXPG"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4"},"ver":"1"}
                                // {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node4","blskey":"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw","blskey_pop":"RPLagxaR5xdimFzwmzYnz4ZhWtYQEj8iR5ZU53T2gitPCyCHQneUn2Huc4oeLd2B2HzkGnjAff4hWTJT6C7qHYB1Mv2wU5iHHGFWkhnTX9WsEAbunJCV2qcaXScKj4tTfvdDKfLiVuU2av6hbsMztirRze7LvYBkRHV3tGwyCptsrP","client_ip":"4.194.26.38","client_port":9708,"node_ip":"4.194.26.38","node_port":9707,"services":["VALIDATOR"]},"dest":"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA"},"metadata":{"from":"TWwCRQRZ2ZHMJFn9TzLp7W"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008"},"ver":"1"}`,
                                connectOnStartup: true,
                            },
                        ],
                    }),
                    proofs: new core_1.ProofsModule({
                        autoAcceptProofs: core_1.AutoAcceptProof.ContentApproved,
                        proofProtocols: [
                            new anoncreds_1.V1ProofProtocol({
                                indyProofFormat: new anoncreds_1.LegacyIndyProofFormatService,
                            }),
                            new core_1.V2ProofProtocol({
                                proofFormats: [new anoncreds_1.LegacyIndyProofFormatService, new anoncreds_1.AnonCredsProofFormatService()],
                            }),
                        ],
                    }),
                    anoncreds: new anoncreds_1.AnonCredsModule({
                        registries: [new indy_vdr_1.IndyVdrAnonCredsRegistry()],
                    }),
                    dids: new core_1.DidsModule({
                        registrars: [new indy_vdr_1.IndyVdrIndyDidRegistrar()],
                        resolvers: [new indy_vdr_1.IndyVdrIndyDidResolver()],
                    }),
                    credentials: new core_1.CredentialsModule({
                        credentialProtocols: [
                            new core_1.V2CredentialProtocol({
                                credentialFormats: [new anoncreds_1.LegacyIndyCredentialFormatService(), new anoncreds_1.AnonCredsCredentialFormatService()],
                            }),
                        ],
                    }),
                },
            });
            // Register modules and transports
            this.registerModules();
            this.registerTransports(endpoints);
            yield this.holderAgent.initialize();
            // await this.holderAgent.dids.import({
            //     did: indyDid,
            //     overwrite: true,
            //     privateKeys: [
            //       {
            //         keyType: KeyType.Ed25519,
            //         privateKey: seedValue,
            //       },
            //     ],
            // });
            return this.holderAgent;
        });
    }
    registerModules() {
        var _a, _b;
        (_a = this.holderAgent) === null || _a === void 0 ? void 0 : _a.registerOutboundTransport(new core_1.WsOutboundTransport());
        (_b = this.holderAgent) === null || _b === void 0 ? void 0 : _b.registerOutboundTransport(new core_1.HttpOutboundTransport());
        // ... register other modules ...
    }
    registerTransports(endpoints) {
        var _a, _b;
        if (endpoints) {
            (_a = this.holderAgent) === null || _a === void 0 ? void 0 : _a.registerInboundTransport(this.wsInboundTransport);
            (_b = this.holderAgent) === null || _b === void 0 ? void 0 : _b.registerInboundTransport(new node_1.HttpInboundTransport({ port: parseInt(endpoints[0].split(':')[2]) }));
        }
    }
}
exports.HolderAgentInitializer = HolderAgentInitializer;
// Example usage:
//const issuerAgentInitializer = new HolderAgentInitializer();
//const initializedAgent = await issuerAgentInitializer.initializeAgent('label', { id: 'someId', key: 'someKey' }, ['http://localhost:3000']);
