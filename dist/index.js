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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agent_1 = require("./agent");
const handler_1 = require("./handler");
const app = (0, express_1.default)();
const port = process.env.PORT || 3002;
app.use(express_1.default.json());
let agent;
app.get('/stopAgent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { connectionId } = req.body;
        const result = yield (0, handler_1.stopAgent)(agent);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /stopAgent:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// generate DID on test net 
app.post('/createDID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, alias, seed } = req.body;
    const formData = {
        "role": role, // always null for holder and holder - remove this for endorser role - default endorser for tgrid-net
        "alias": alias,
        // "did":"", //not required
        "seed": seed // 32 char string as seed
    };
    // const apiUrl = "http://test.bcovrin.vonx.io/register";
    // const apiUrl = "http://4.194.26.38:9000/register";
    const apiUrl = "https://tgrid-network.uat.trustgrid.com/register";
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any other headers as needed
        },
        body: JSON.stringify(formData),
    }).then(response => response.json())
        .then(data => {
        console.log('Success:', data);
        const result = { message: "holder DID created on test network...", data };
        res.status(200).json({ success: true, result });
    })
        .catch(error => {
        console.error('Error in /createDID:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    });
}));
// getConnectionRecord
app.post('/getConnectionRecord', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connectionId } = req.body;
        const result = yield (0, handler_1.getConnectionRecord)(agent, connectionId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /getConnectionRecord:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// createNewInvitation
app.post('/createNewInvitation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { agent } = req.body;
        const result = yield (0, handler_1.createNewInvitation)(agent);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /createNewInvitation:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// receiveInvitation
app.post('/receiveInvitation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invitationUrl } = req.body;
        const result = yield (0, handler_1.receiveInvitation)(agent, invitationUrl);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /receiveInvitation:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// getAllConnections
app.get('/getAllConnections', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, handler_1.getAllConnections)(agent);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /getAllConnections:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// list of generated DIDs
app.get('/getDids', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { credentialDefinitionId } = req.body;
        const result = yield (0, handler_1.getDids)(agent);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /getDids:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// getProofRecord
app.get('/getProofRecord', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proofRecord = yield (0, handler_1.getProofRecord)();
        res.status(200).json({ success: true, proofRecord });
    }
    catch (error) {
        console.error('Error in /getIssuedCredential:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
app.get('/getIssuedCredential', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { credentialDefinitionId } = req.body;
        const result = yield (0, handler_1.getIssuedCredential)(agent);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /getIssuedCredential:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
app.post('/getIssuedCredentialById', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recordId } = req.body;
        const result = yield (0, handler_1.getIssuedCredentialById)(agent, recordId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /getIssuedCredential:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
//acceptOffer - post
app.post('/acceptOffer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credentialRecordId } = req.body;
        const result = yield (0, handler_1.acceptOffer)(agent, credentialRecordId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// acceptProofRequest - post
app.post('/acceptProofRequest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proofRecordId } = req.body;
        const sendProof = yield (0, handler_1.acceptProofRequest)(agent, proofRecordId);
        res.status(200).json({ success: true, sendProof });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// rejectProofRequest - post
app.post('/rejectProofRequest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proofRecordId } = req.body;
        const result = yield (0, handler_1.rejectProofRequest)(agent, proofRecordId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// proofRequestListener - get api
app.get('/proofRequestListener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield (0, handler_1.proofRequestListener)(agent);
        res.status(200).json({ success: true, message });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// setupCredentialListener method - api get
app.get('/setupCredentialListener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, handler_1.setupCredentialListener)(agent);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// getAllConnections - api get
app.get('/getAllConnections', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, handler_1.getAllConnections)(agent);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// getConnectionRecord - api get
app.post('/getConnectionRecord', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connectionId } = req.body;
        const result = yield (0, handler_1.getConnectionRecord)(agent, connectionId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// deleteConnectionById
app.post('/deleteConnectionById', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connectionId } = req.body;
        const result = yield (0, handler_1.deleteConnectionById)(agent, connectionId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /deleteConnectionById:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// findPresentation - api get
app.post('/findPresentationById', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proofRecordId } = req.body;
        const result = yield (0, handler_1.findPresentationById)(agent, proofRecordId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// getRequestedAttributes - api get
app.post('/getRequestedAttributes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proofRecordId } = req.body;
        const result = yield (0, handler_1.getRequestedAttributes)(agent, proofRecordId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// initializeAgent - post
app.post('/initializeAgent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { seed, IndyDid, label, walletConfig, endpoints } = req.body;
        const holderAgentInitializer = new agent_1.HolderAgentInitializer();
        agent = yield holderAgentInitializer.initializeAgent(seed, IndyDid, label, walletConfig, endpoints);
        const cache = [];
        const jsonString = JSON.stringify(agent, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.includes(value)) {
                    return '[Circular Reference]';
                }
                cache.push(value);
            }
            return value;
        });
        res.status(200).json({ success: true, jsonString });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// Root endpoint - get
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = "Holder aries agent is ready to go...!!!";
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// ========== verifier API ===============
// create cliam
app.post('/createClaim', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { claimName, version, attributes, credDefId } = req.body;
        const result = yield (0, handler_1.createClaim)(claimName, version, attributes, credDefId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /createClaim:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
//get calim list
app.get('/getClaimList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, handler_1.getClaimList)();
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /getClaimList:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// sendProofRequest
app.post('/sendProofRequest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connectionRecordId } = req.body;
        const result = yield (0, handler_1.sendProofRequest)(agent, connectionRecordId);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /sendproofRequest:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// get all proofRequestList
app.get('/proofRequestList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, handler_1.proofRequestList)(agent);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error('Error in /getDids:', error);
        res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    }
}));
// Generic error handler for unhandled errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});
app.listen(port, () => {
    console.log(`Holder API Server is running at http://localhost:${port}`);
});
