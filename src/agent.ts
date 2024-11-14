import { IndyVdrAnonCredsRegistry, IndyVdrIndyDidRegistrar, IndyVdrIndyDidResolver, IndyVdrModule } from '@aries-framework/indy-vdr';
import { HttpInboundTransport, WsInboundTransport, agentDependencies } from '@aries-framework/node';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { indyVdr } from '@hyperledger/indy-vdr-nodejs';
import { Agent, InitConfig, DidsModule, CredentialsModule, V2CredentialProtocol, WsOutboundTransport, HttpOutboundTransport, ConnectionsModule, AutoAcceptProof, ProofsModule, V2ProofProtocol, ConsoleLogger, LogLevel, TypedArrayEncoder, MediationRecipientModule, MediatorPickupStrategy, KeyType } from '@aries-framework/core'; // replace with actual module imports
import { AnonCredsModule, LegacyIndyCredentialFormatService, AnonCredsCredentialFormatService, V1ProofProtocol, LegacyIndyProofFormatService, AnonCredsProofFormatService } from '@aries-framework/anoncreds';
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs';
import { AskarModule } from '@aries-framework/askar';
import { Server } from 'ws'

export class HolderAgentInitializer {
  private holderAgent: Agent | null = null;

  public async initializeAgent(seed: string, IndyDid: string, label: string, walletConfig: { id: string; key: string }, endpoints?: string[]): Promise<Agent> {
    
    const seedValue = TypedArrayEncoder.fromString(seed)
    const indyDid = `did:indy:bcovrin:test:${IndyDid}`
    // const indyDid = `did:indy:trustgrid_net:test:${IndyDid}`
    const config: InitConfig = {
      label,
      walletConfig,
      endpoints,
      logger: new ConsoleLogger(LogLevel.debug)
    };

    this.holderAgent = new Agent({
        config,
        dependencies: agentDependencies,
        modules: {
          // Register the Askar module on the agent
          // We do this to have access to a wallet
          askar: new AskarModule({
            ariesAskar,
          }),
          connections: new ConnectionsModule({ autoAcceptConnections: true }),
          anoncredsRs: new AnonCredsRsModule({
            anoncreds,
          }),
          // mediationRecipient: new MediationRecipientModule({
          //   mediatorInvitationUrl: "https://mediator.dev.trustgrid.com/invite?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiI3YzM5MTlhOC03OTkyLTQ3ZGUtYTQ4Zi01ZjE0YmI5NWQxZTgiLCJsYWJlbCI6IlRydXN0R3JpZCBNZWRpYXRvciIsImFjY2VwdCI6WyJkaWRjb21tL2FpcDEiLCJkaWRjb21tL2FpcDI7ZW52PXJmYzE5Il0sImhhbmRzaGFrZV9wcm90b2NvbHMiOlsiaHR0cHM6Ly9kaWRjb21tLm9yZy9kaWRleGNoYW5nZS8xLjEiLCJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMCJdLCJzZXJ2aWNlcyI6W3siaWQiOiIjaW5saW5lLTAiLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwczovL21lZGlhdG9yLmRldi50cnVzdGdyaWQuY29tIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWt0Rlg5bWdiYW9xdGJBbVFNQVJiTmRYMlB5YTlYYXBNeTF6ZTFVc3FkUVk4WSJdLCJyb3V0aW5nS2V5cyI6W119LHsiaWQiOiIjaW5saW5lLTEiLCJzZXJ2aWNlRW5kcG9pbnQiOiIgd3NzOi8vbWVkaWF0b3IuZGV2LnRydXN0Z3JpZC5jb20iLCJ0eXBlIjoiZGlkLWNvbW11bmljYXRpb24iLCJyZWNpcGllbnRLZXlzIjpbImRpZDprZXk6ejZNa3RGWDltZ2Jhb3F0YkFtUU1BUmJOZFgyUHlhOVhhcE15MXplMVVzcWRRWThZIl0sInJvdXRpbmdLZXlzIjpbXX1dfQ",
          //   mediatorPickupStrategy: MediatorPickupStrategy.PickUpV2
          // }),
          indyVdr: new IndyVdrModule({
            indyVdr,
            networks: [
              {
                isProduction: false,
                // indyNamespace: 'trustgrid_net:test',
                indyNamespace: 'bcovrin:test',

//                 genesisTransactions: `{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"20.205.160.7","client_port":9702,"node_ip":"20.205.160.7","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}
// {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node2","blskey":"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk","blskey_pop":"Qr658mWZ2YC8JXGXwMDQTzuZCWF7NK9EwxphGmcBvCh6ybUuLxbG65nsX4JvD4SPNtkJ2w9ug1yLTj6fgmuDg41TgECXjLCij3RMsV8CwewBVgVN67wsA45DFWvqvLtu4rjNnE9JbdFTc1Z4WCPA3Xan44K1HoHAq9EVeaRYs8zoF5","client_ip":"20.205.160.7","client_port":9704,"node_ip":"20.205.160.7","node_port":9703,"services":["VALIDATOR"]},"dest":"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb"},"metadata":{"from":"EbP4aYNeTHL6q385GuVpRV"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc"},"ver":"1"}
// {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node3","blskey":"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5","blskey_pop":"QwDeb2CkNSx6r8QC8vGQK3GRv7Yndn84TGNijX8YXHPiagXajyfTjoR87rXUu4G4QLk2cF8NNyqWiYMus1623dELWwx57rLCFqGh7N4ZRbGDRP4fnVcaKg1BcUxQ866Ven4gw8y4N56S5HzxXNBZtLYmhGHvDtk6PFkFwCvxYrNYjh","client_ip":"20.205.160.7","client_port":9706,"node_ip":"20.205.160.7","node_port":9705,"services":["VALIDATOR"]},"dest":"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya"},"metadata":{"from":"4cU41vWW82ArfxJxHkzXPG"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4"},"ver":"1"}
// {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node4","blskey":"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw","blskey_pop":"RPLagxaR5xdimFzwmzYnz4ZhWtYQEj8iR5ZU53T2gitPCyCHQneUn2Huc4oeLd2B2HzkGnjAff4hWTJT6C7qHYB1Mv2wU5iHHGFWkhnTX9WsEAbunJCV2qcaXScKj4tTfvdDKfLiVuU2av6hbsMztirRze7LvYBkRHV3tGwyCptsrP","client_ip":"20.205.160.7","client_port":9708,"node_ip":"20.205.160.7","node_port":9707,"services":["VALIDATOR"]},"dest":"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA"},"metadata":{"from":"TWwCRQRZ2ZHMJFn9TzLp7W"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008"},"ver":"1"}`,
                 genesisTransactions:`{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"20.205.160.7","client_port":9702,"node_ip":"20.205.160.7","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node2","blskey":"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk","blskey_pop":"Qr658mWZ2YC8JXGXwMDQTzuZCWF7NK9EwxphGmcBvCh6ybUuLxbG65nsX4JvD4SPNtkJ2w9ug1yLTj6fgmuDg41TgECXjLCij3RMsV8CwewBVgVN67wsA45DFWvqvLtu4rjNnE9JbdFTc1Z4WCPA3Xan44K1HoHAq9EVeaRYs8zoF5","client_ip":"20.205.160.7","client_port":9704,"node_ip":"20.205.160.7","node_port":9703,"services":["VALIDATOR"]},"dest":"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb"},"metadata":{"from":"EbP4aYNeTHL6q385GuVpRV"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node3","blskey":"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5","blskey_pop":"QwDeb2CkNSx6r8QC8vGQK3GRv7Yndn84TGNijX8YXHPiagXajyfTjoR87rXUu4G4QLk2cF8NNyqWiYMus1623dELWwx57rLCFqGh7N4ZRbGDRP4fnVcaKg1BcUxQ866Ven4gw8y4N56S5HzxXNBZtLYmhGHvDtk6PFkFwCvxYrNYjh","client_ip":"20.205.160.7","client_port":9706,"node_ip":"20.205.160.7","node_port":9705,"services":["VALIDATOR"]},"dest":"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya"},"metadata":{"from":"4cU41vWW82ArfxJxHkzXPG"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node4","blskey":"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw","blskey_pop":"RPLagxaR5xdimFzwmzYnz4ZhWtYQEj8iR5ZU53T2gitPCyCHQneUn2Huc4oeLd2B2HzkGnjAff4hWTJT6C7qHYB1Mv2wU5iHHGFWkhnTX9WsEAbunJCV2qcaXScKj4tTfvdDKfLiVuU2av6hbsMztirRze7LvYBkRHV3tGwyCptsrP","client_ip":"20.205.160.7","client_port":9708,"node_ip":"20.205.160.7","node_port":9707,"services":["VALIDATOR"]},"dest":"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA"},"metadata":{"from":"TWwCRQRZ2ZHMJFn9TzLp7W"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008"},"ver":"1"}`, 
                connectOnStartup: true,
              },
            ],
          }),
          proofs: new ProofsModule({
            autoAcceptProofs: AutoAcceptProof.ContentApproved,
            proofProtocols: [
              new V1ProofProtocol({
                indyProofFormat: new LegacyIndyProofFormatService,
              }),
              new V2ProofProtocol({
                proofFormats: [new LegacyIndyProofFormatService, new AnonCredsProofFormatService()],
              }),
            ],
          }),
          anoncreds: new AnonCredsModule({
            registries: [new IndyVdrAnonCredsRegistry()],
          }),
          dids: new DidsModule({
            registrars: [new IndyVdrIndyDidRegistrar()],
            resolvers: [new IndyVdrIndyDidResolver()],
          }),
          credentials: new CredentialsModule({
            credentialProtocols: [
              new V2CredentialProtocol({
                credentialFormats: [new LegacyIndyCredentialFormatService(), new AnonCredsCredentialFormatService()],
              }),
            ],
          }),
      
        },
    });

    // Register modules and transports
    this.registerModules();
    this.registerTransports(endpoints);

    
    await this.holderAgent.initialize();
    await this.holderAgent.dids.import({
        did: indyDid,
        overwrite: true,
        privateKeys: [
          {
            keyType: KeyType.Ed25519,
            privateKey: seedValue,
          },
        ],
    });

    return this.holderAgent;
  }

  private registerModules() {
    this.holderAgent?.registerOutboundTransport(new WsOutboundTransport());
    this.holderAgent?.registerOutboundTransport(new HttpOutboundTransport());
    // ... register other modules ...
  }

   socketServer = new Server({ noServer: true })
   wsInboundTransport = new WsInboundTransport({ server: this.socketServer })
  
  private registerTransports(endpoints?: string[]) {
    if (endpoints) {
      this.holderAgent?.registerInboundTransport(this.wsInboundTransport)
      this.holderAgent?.registerInboundTransport(new HttpInboundTransport({ port: parseInt(endpoints[0].split(':')[2]) }));
    }
  }

  // // When an 'upgrade' to WS is made on our http server, we forward the
  // // request to the WS server
  // httpInboundTransport: server: any?.on('upgrade', (request: any, socket: any, head: any) => {
  //   socketServer.handleUpgrade(request, socket as Socket, head, (socket: any) => {
  //     socketServer.emit('connection', socket, request)
  //   })
  // })

}


// Example usage:
//const issuerAgentInitializer = new HolderAgentInitializer();
//const initializedAgent = await issuerAgentInitializer.initializeAgent('label', { id: 'someId', key: 'someKey' }, ['http://localhost:3000']);
