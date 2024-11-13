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
exports.stopAgent = exports.proofAcceptedListener = exports.sendProofRequest = exports.getClaimList = exports.createClaim = exports.getIssuedCredentialById = exports.getIssuedCredential = exports.rejectProofRequest = exports.getRequestedAttributes = exports.selectCredentialsForRequest = exports.acceptProofRequest = exports.proofRequestListener = exports.getProofRecord = exports.acceptOffer = exports.setupCredentialListener = exports.findPresentationById = exports.proofRequestList = exports.getDids = exports.deleteConnectionById = exports.getConnectionById = exports.getAllConnections = exports.getConnectionRecord = exports.receiveInvitation = exports.createNewInvitation = void 0;
const core_1 = require("@aries-framework/core");
const createNewInvitation = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    const goutOfBandRecord = yield agent.oob.createInvitation({ multiUseInvitation: true });
    let outOfBandId = goutOfBandRecord.id;
    setupConnectionListener(agent, outOfBandId, (agent_lable) => console.log(`We now have an active connection for outOfBandId:${outOfBandId} with ${agent_lable} agent`));
    return {
        invitationUrl: goutOfBandRecord.outOfBandInvitation.toUrl({ domain: 'https://example.org' }),
        outOfBandId: goutOfBandRecord.id
    };
});
exports.createNewInvitation = createNewInvitation;
const receiveInvitation = (agent, invitationUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const { outOfBandRecord, connectionRecord } = yield agent.oob.receiveInvitationFromUrl(invitationUrl);
    let outOfBandId = outOfBandRecord.id;
    let threadId = connectionRecord === null || connectionRecord === void 0 ? void 0 : connectionRecord.threadId;
    setupConnectionListener(agent, outOfBandId, (agent_lable) => console.log(`We now have an active connection for outOfBandId:${outOfBandId} with ${agent_lable} agent`));
    return { "threadId": threadId, "oobId": outOfBandId };
});
exports.receiveInvitation = receiveInvitation;
const setupConnectionListener = (agent, outOfBandId, cb) => {
    agent.events.on(core_1.ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
        if (payload.connectionRecord.outOfBandId !== outOfBandId)
            return;
        if (payload.connectionRecord.state === core_1.DidExchangeState.Completed) {
            cb(payload.connectionRecord.theirLabel);
            // process.exit(0);
        }
    });
};
const getConnectionRecord = (agent, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        return "missing connection record";
    }
    const connection = yield agent.connections.findById(id);
    if (!connection) {
        return "missing connection record, No agent connected..!!";
    }
    return connection.id;
});
exports.getConnectionRecord = getConnectionRecord;
const mapConnection = (connection) => {
    return {
        // If we use auto accept, we can't include the state as we will move quicker than the calls in the test harness. This will
        // make verification fail. The test harness recognizes the 'N/A' state.
        state: connection.state === core_1.DidExchangeState.Completed ? connection.rfc0160State : 'N/A',
        connection_id: connection.id,
        connection,
    };
};
//getAllConnection method
const getAllConnections = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    const connections = yield agent.connections.getAll();
    return connections.map((conn) => mapConnection(conn));
});
exports.getAllConnections = getAllConnections;
//get method conection record
const getConnectionById = (agent, connectionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connectionRecord = yield agent.connections.getById(connectionId);
        return { status: true, connectionRecord };
    }
    catch (error) {
        return { status: false, error };
    }
});
exports.getConnectionById = getConnectionById;
//deleteConnection by connectionId
const deleteConnectionById = (agent, connectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const connectionRecord = yield (0, exports.getConnectionById)(agent, connectionId);
    if (connectionRecord.status) {
        const connection = yield agent.connections.deleteById(connectionId);
        return connection;
    }
    else {
        return { message: `${connectionRecord.error}` };
    }
});
exports.deleteConnectionById = deleteConnectionById;
// get list of DIDs with did-document getDidRecodes 
const getDids = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    const DidRecord = agent.dids.getCreatedDids();
    return DidRecord;
});
exports.getDids = getDids;
// get list of createdProofRequest
const proofRequestList = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield agent.proofs.getAll();
    return list;
});
exports.proofRequestList = proofRequestList;
//fetch presentation based on proofRecord Id
const findPresentationById = (agent, proofRecordId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield agent.proofs.findPresentationMessage(proofRecordId);
    console.log(JSON.stringify(data, null, 2));
    return data;
});
exports.findPresentationById = findPresentationById;
// setup credential listener method
const setupCredentialListener = (holder) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (obj) => { return obj; };
    holder.events.on(core_1.CredentialEventTypes.CredentialStateChanged, ({ payload }) => __awaiter(void 0, void 0, void 0, function* () {
        switch (payload.credentialRecord.state) {
            case core_1.CredentialState.OfferReceived:
                console.log('received a credential');
                // custom logic here
                yield holder.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id, autoAcceptCredential: core_1.AutoAcceptCredential.Always, });
            case core_1.CredentialState.Done:
                console.log(`Credential for credential id ${payload.credentialRecord.id} is accepted`);
                console.log("Credential Data:", payload.credentialRecord);
                result(payload.credentialRecord); // this will return obj.
            // For demo purposes we exit the program here.
            // process.exit(0)
        }
    }));
});
exports.setupCredentialListener = setupCredentialListener;
//
const acceptOffer = (holder, credentialRecordId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield holder.credentials.acceptOffer({ credentialRecordId, autoAcceptCredential: core_1.AutoAcceptCredential.Always, });
    console.log("offer accepted..");
    return result;
});
exports.acceptOffer = acceptOffer;
let proofRecord = null;
//getProofRecord -method
const getProofRecord = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Proof Record:", proofRecord);
    return proofRecord;
});
exports.getProofRecord = getProofRecord;
// proofRequestListener - method
const proofRequestListener = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    const getResult = (data) => { proofRecord = data; console.log(data); return data; };
    agent.events.on(core_1.ProofEventTypes.ProofStateChanged, ({ payload }) => __awaiter(void 0, void 0, void 0, function* () {
        if (payload.proofRecord.state === core_1.ProofState.RequestReceived) {
            getResult(payload.proofRecord);
        }
    }));
});
exports.proofRequestListener = proofRequestListener;
//acceptProofRequest -method
const acceptProofRequest = (agent, proofRecordId) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedCredentials = yield agent.proofs.selectCredentialsForRequest({
        proofRecordId: proofRecordId,
    });
    // console.log("Printing requestedCredentials...")
    // console.log(JSON.stringify(requestedCredentials,null,2))
    const result = yield agent.proofs.acceptRequest({
        proofRecordId: proofRecordId,
        proofFormats: requestedCredentials.proofFormats,
    });
    console.log("Proof request accepted...");
    return result;
});
exports.acceptProofRequest = acceptProofRequest;
//selectCredentialsForRequest -method
const selectCredentialsForRequest = (agent, proofRecordId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield agent.proofs.selectCredentialsForRequest({ proofRecordId: proofRecordId });
    console.log(" selectCredentialsForRequest...", result);
    return result;
});
exports.selectCredentialsForRequest = selectCredentialsForRequest;
//getCredentialsForRequest -method
const getRequestedAttributes = (agent, proofRecordId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield agent.proofs.findRequestMessage(proofRecordId);
    if (data != null) {
        const obj = data.requestAttachments[0];
        const base64String = obj.data.base64;
        // console.log("base64", base64String)
        const decodeString = Buffer.from(JSON.stringify(base64String), 'base64').toString('utf-8');
        // console.log(decodeString);
        const decodeData = JSON.parse(decodeString);
        console.log(" getRequestedAttributes...", decodeData);
        return decodeData;
    }
    else {
        return null;
    }
});
exports.getRequestedAttributes = getRequestedAttributes;
//rejectProofRequest -method
const rejectProofRequest = (agent, proofRecordId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield agent.proofs.declineRequest({ proofRecordId: proofRecordId });
    console.log("Proof request Rejected...");
    return result;
});
exports.rejectProofRequest = rejectProofRequest;
//list of issued credentials
const getIssuedCredential = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    const context = agent.credentials.getAll();
    return context;
});
exports.getIssuedCredential = getIssuedCredential;
//credential details by Id of issued credentials
const getIssuedCredentialById = (agent, recordId) => __awaiter(void 0, void 0, void 0, function* () {
    const context = agent.credentials.getById(recordId);
    return context;
});
exports.getIssuedCredentialById = getIssuedCredentialById;
// ==== Verifier flow ===
// generate proofAttributes
const proofAttributes = (attributes, credDefId) => __awaiter(void 0, void 0, void 0, function* () {
    let arrayOfObjects = attributes.map((item) => {
        let temp = {
            name: item,
            restrictions: [
                {
                    cred_def_id: credDefId
                }
            ]
        };
        return temp;
    });
    const proofAttribute = {};
    arrayOfObjects.forEach((obj, idx) => {
        proofAttribute[`attr_${idx}`] = obj;
    });
    console.log("Proof obj:", proofAttribute);
    return proofAttribute;
});
const claimList = [];
// create claim
// formate -> attributes = ["name","age","Id number"]
const createClaim = (claimName, version, attributes, credDefId) => __awaiter(void 0, void 0, void 0, function* () {
    const proofAttribute = yield proofAttributes(attributes, credDefId);
    claimList.push({ claimName, version, proofAttribute });
    return claimList;
});
exports.createClaim = createClaim;
// getClaimList
const getClaimList = () => {
    return claimList;
};
exports.getClaimList = getClaimList;
// sendProofRequest
// sendProofRequest method
const sendProofRequest = (agent, connectionRecordId) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield agent.proofs.requestProof({
        protocolVersion: 'v2',
        connectionId: connectionRecordId,
        proofFormats: {
            anoncreds: {
                name: claimList[0].requestName,
                version: claimList[0].version,
                requested_attributes: claimList[0].proofAttribute,
            },
        },
    });
    const proofListenerStatus = yield (0, exports.proofAcceptedListener)(agent);
    return { result, proofListenerStatus: proofListenerStatus };
});
exports.sendProofRequest = sendProofRequest;
// proofAcceptedListener - method
const proofAcceptedListener = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    const getResult = (data) => {
        console.log(data);
        return data;
    };
    agent.events.on(core_1.ProofEventTypes.ProofStateChanged, ({ payload }) => __awaiter(void 0, void 0, void 0, function* () {
        if (payload.proofRecord.state === core_1.ProofState.Done) {
            getResult(payload.proofRecord);
        }
    }));
});
exports.proofAcceptedListener = proofAcceptedListener;
// get all proofRequestList
const stopAgent = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    const result = agent.shutdown;
    return result;
});
exports.stopAgent = stopAgent;
