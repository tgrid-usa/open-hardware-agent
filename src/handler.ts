import {
  Agent,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  DidExchangeState,
  ConnectionRecord,
  AutoAcceptCredential,
  CredentialEventTypes,
  CredentialState,
  CredentialStateChangedEvent,
  ProofEventTypes,
  ProofExchangeRecord,
  ProofState,
  ProofStateChangedEvent,
  BasicMessageEventTypes,
  BasicMessageRole,
  BasicMessageStateChangedEvent,
} from '@aries-framework/core'
require('dotenv').config();

const domain:any = process.env.DOMAIN!;

export const createNewInvitation = async (agent: Agent) => {
   const goutOfBandRecord = await agent.oob.createInvitation({multiUseInvitation:true});
  let outOfBandId = goutOfBandRecord.id;
  setupConnectionListener(agent, outOfBandId, (agent_lable) =>
  console.log(`We now have an active connection for outOfBandId:${outOfBandId} with ${agent_lable} agent`));
  return {
    invitationUrl: goutOfBandRecord.outOfBandInvitation.toUrl({ domain: domain}),
    outOfBandId: goutOfBandRecord.id
  };
};

export const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
  const { outOfBandRecord, connectionRecord } = await agent.oob.receiveInvitationFromUrl(invitationUrl);
  let outOfBandId = outOfBandRecord.id
  let threadId = connectionRecord?.threadId;
  setupConnectionListener(agent, outOfBandId, (agent_lable) =>
  console.log(`We now have an active connection for outOfBandId:${outOfBandId} with ${agent_lable} agent`));
  return {"threadId":threadId, "oobId":outOfBandId};
};

const setupConnectionListener = (agent: Agent, outOfBandId:string, cb: (agent_lable:any) => void) => {
  agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
    if (payload.connectionRecord.outOfBandId !== outOfBandId) return;
    if (payload.connectionRecord.state === DidExchangeState.Completed) {
      cb(payload.connectionRecord.theirLabel);
      // process.exit(0);
    }
  });
};

export const getConnectionRecord = async (agent: Agent, id:string) => {
  if (!id) {
    return "missing connection record";
  }
  const connection = await agent.connections.findById(id)
  if (!connection) { 
    return "missing connection record, No agent connected..!!";
  }

  return connection.id
}

const mapConnection = (connection: ConnectionRecord) => {
  return {
    // If we use auto accept, we can't include the state as we will move quicker than the calls in the test harness. This will
    // make verification fail. The test harness recognizes the 'N/A' state.
    state: connection.state === DidExchangeState.Completed ? connection.rfc0160State : 'N/A',
    connection_id: connection.id,
    connection,
  }
}

//getAllConnection method
export const getAllConnections = async (agent: Agent) => {
   const connections = await agent.connections.getAll()
 return connections.map((conn: any) => mapConnection(conn))
}

//get method conection record
export const getConnectionById = async (agent: Agent, connectionId:string) => {
  try {
    const connectionRecord = await agent.connections.getById(connectionId)
    return { status:true, connectionRecord};
    
  } catch (error) {
    return { status:false, error};
  }
}

//deleteConnection by connectionId
export const deleteConnectionById = async (agent: Agent, connectionId:string) => {
  const connectionRecord = await getConnectionById(agent, connectionId);
  if(connectionRecord.status){
    const connection = await agent.connections.deleteById(connectionId)
    return connection;
  }else{
    return {message:`${connectionRecord.error}`} 
  }
}

// get list of DIDs with did-document getDidRecodes 
export const getDids = async (agent: Agent) => {
  const DidRecord = agent.dids.getCreatedDids()
  return DidRecord;
}

// get list of createdProofRequest
export const proofRequestList = async (agent:Agent) => {
  const list = await agent.proofs.getAll()
  return list;
}

//fetch presentation based on proofRecord Id
export const findPresentationById = async (agent:Agent, proofRecordId:string) => {
  const data = await agent.proofs.findPresentationMessage(proofRecordId)
  console.log(JSON.stringify(data,null,2))
  return data;
}

// setup credential listener method
export const setupCredentialListener = async (holder:Agent) => {
  const result = (obj:any) => { return obj}

  holder.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {
    switch (payload.credentialRecord.state) {
      case CredentialState.OfferReceived:
        console.log('received a credential')
        // custom logic here
        await holder.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id, autoAcceptCredential: AutoAcceptCredential.Always, })
      case CredentialState.Done:
        console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`)
        console.log("Credential Data:",payload.credentialRecord)
        result(payload.credentialRecord) // this will return obj.
        // For demo purposes we exit the program here.
        // process.exit(0)
    }
  })
}

//
export const acceptOffer = async (holder:Agent, credentialRecordId:string ) => {
  const result = await holder.credentials.acceptOffer({ credentialRecordId, autoAcceptCredential: AutoAcceptCredential.Always, })
  console.log("offer accepted..")

  return result;
}

let proofRecord:any = null;

//getProofRecord -method
export const getProofRecord = async () => {
  console.log("Proof Record:",proofRecord)
  return proofRecord;
}

// proofRequestListener - method
export const proofRequestListener = async (agent:Agent) => {
  const getResult = (data:any) => {  proofRecord = data; console.log(data); return data; }
  agent.events.on(ProofEventTypes.ProofStateChanged, async ({ payload }: ProofStateChangedEvent) => {
    if (payload.proofRecord.state === ProofState.RequestReceived) {
      getResult(payload.proofRecord);
    }
  });
};

//acceptProofRequest -method
export const acceptProofRequest = async (agent:Agent, proofRecordId:string) => {
  const requestedCredentials = await agent.proofs.selectCredentialsForRequest({
    proofRecordId: proofRecordId,
  })
  // console.log("Printing requestedCredentials...")
  // console.log(JSON.stringify(requestedCredentials,null,2))
  const result = await agent.proofs.acceptRequest({
    proofRecordId: proofRecordId,
    proofFormats: requestedCredentials.proofFormats,
  })
  console.log("Proof request accepted...")

  return result;
}

//selectCredentialsForRequest -method
export const selectCredentialsForRequest = async (agent:Agent, proofRecordId:string) => {
  const result = await agent.proofs.selectCredentialsForRequest({ proofRecordId:proofRecordId })
  console.log(" selectCredentialsForRequest...",result)

  return result;
}

//getCredentialsForRequest -method
export const getRequestedAttributes = async (agent:Agent, proofRecordId:string) => {
  const data = await agent.proofs.findRequestMessage(proofRecordId)
  if(data!= null){
    const obj = data.requestAttachments[0];
    const base64String = obj.data.base64;
    // console.log("base64", base64String)
    const decodeString = Buffer.from(JSON.stringify(base64String), 'base64').toString('utf-8');
    // console.log(decodeString);
    const decodeData = JSON.parse(decodeString)
    console.log(" getRequestedAttributes...",decodeData)
    return decodeData;
  }else{
    return null;
  }

}

//rejectProofRequest -method
export const rejectProofRequest = async (agent:Agent, proofRecordId:string) => {
  const result = await agent.proofs.declineRequest({ proofRecordId: proofRecordId })
  console.log("Proof request Rejected...")
  return result;
}

//list of issued credentials
export const getIssuedCredential = async (agent: Agent) => {
  const context = agent.credentials.getAll()
  return context;
}

//credential details by Id of issued credentials
export const getIssuedCredentialById = async (agent: Agent, recordId:string) => {
  const context = agent.credentials.getById(recordId)
  return context;
}

export const sendMessage = async (agent: Agent, connID:string, message:any) => {
  const context = agent.basicMessages.sendMessage(connID, message);
  return context;
}

export const getMessageByThreadId = async (agent: Agent, threadId: string ) =>{
  const result = agent.basicMessages.getByThreadId(threadId);
  return result;
}

export const setupMessageListener = async (agent: Agent ) => {
  // let message:any = {};
  const getMessage = (message:any) => { return message; }
  agent.events.on<BasicMessageStateChangedEvent>(BasicMessageEventTypes.BasicMessageStateChanged, ({ payload }) => {
    if (payload.basicMessageRecord.role === BasicMessageRole.Receiver) {
      const messageData = payload.message.content;
      console.log("message data",messageData);
      getMessage(messageData); 
     }
  });
};

// ==== Verifier flow ===

// generate proofAttributes
const proofAttributes = async (attributes:any,credDefId:any) => {
  let arrayOfObjects = attributes.map((item:any) => {
    let temp = { 
            name: item, 
            restrictions: [
              {
                cred_def_id: credDefId
              }
            ]
          }
      return temp;
  }); 
  interface ProofAttribute {
    [key: string]: any;
  }
  const proofAttribute:ProofAttribute = {};
  arrayOfObjects.forEach((obj:any, idx: any) => {
    proofAttribute[`attr_${idx}`] = obj;
  });   
  console.log("Proof obj:", proofAttribute);
  return proofAttribute;
} 

const claimList:any = [];

// create claim
// formate -> attributes = ["name","age","Id number"]
export const createClaim = async (claimName:string, version:any, attributes:any, credDefId:any) => {
  const proofAttribute = await proofAttributes(attributes, credDefId);
  claimList.push({ claimName, version, proofAttribute })
  return claimList;
}

// getClaimList
export const getClaimList = () => {
  return claimList;
}

// sendProofRequest
// sendProofRequest method
export const sendProofRequest = async (agent:Agent, connectionRecordId:any) => {
  // const proofAttributes = {
  //   name_uid: {
  //     name: 'age', 
  //     restrictions: [
  //       {
  //         cred_def_id: "did:indy:bcovrin:test:CiMTdth8FPFEnJotx3qZFH/anoncreds/v0/CLAIM_DEF/321068/1.8"
  //       }
  //     ]
  //   }
  //   }
  const result =  await agent.proofs.requestProof({
    protocolVersion: 'v2',
    connectionId: connectionRecordId,
    proofFormats: {
      anoncreds: {
        name: claimList[0].requestName,
        version:claimList[0].version,
        requested_attributes: claimList[0].proofAttribute,
      },
    },
  });
  
  const proofListenerStatus = await proofAcceptedListener(agent);
 return {result, proofListenerStatus: proofListenerStatus };
}

// proofAcceptedListener - method
export const proofAcceptedListener = async (agent: Agent) => {
  const getResult = (data:any) => { 
    console.log(data);
    return data; 
  }
  agent.events.on(ProofEventTypes.ProofStateChanged, async ({ payload }: ProofStateChangedEvent) => {
    if (payload.proofRecord.state === ProofState.Done) {
      getResult(payload.proofRecord);
    }
  });
};

// get all proofRequestList

export const stopAgent = async (agent:Agent) => {
  const result = agent.shutdown
  return result;
}

export const getAgentInfo = async (agent:Agent) => {
  const result = agent.config
  return result;
}

let seedValue:any;
let indyDid:any;
//setNetworkConfig
export const setIssuerConfig = async (seed:string, unqualifiedIndyDid:string ) => {
  
  // seedValue = TypedArrayEncoder.fromString(seed) // What you input on bcovrin. Should be kept secure in production!
  seedValue = seed; // What you input on bcovrin. Should be kept secure in production!
  // unqualifiedIndyDid = `WEe8cTdg7cwxRoH8J4YVre` // will be returned after registering seed on bcovrin
  indyDid = `did:indy:trustgrid_net:test:${unqualifiedIndyDid}`; // this will be connection string for indy Network for this agent only.
  return { seedValue, indyDid };
}

// create schema - function
export const createSchema = async (agent: Agent, name:string, version:string, attrNames:Array<string>) => {
  // Register schema
  // console.log("Agent => ",agent);
  // attrNames: ['name','age','dob','issue-date','valid-till']
  const schemaResult = await agent.modules.anoncreds.registerSchema({
    schema: {
      name,
      version,
      issuerId: indyDid,
      attrNames: attrNames,
    },
    options: {},
  })
  
  if (schemaResult.schemaState.state === 'failed') {
     console.log(`Error creating schema: ${schemaResult.schemaState.reason}`);
     return false;
  }
  console.log("schema result => ",schemaResult)
 const schemaId =  `${schemaResult.schemaState.schemaId}`; 
 return schemaId;
} 
