import express, { NextFunction, Request, Response } from 'express';
import { HolderAgentInitializer } from './agent';
import { Agent } from '@aries-framework/core';

import { createNewInvitation, proofRequestList, findPresentationById, getAllConnections, getConnectionRecord, getDids, getIssuedCredential, getIssuedCredentialById, getProofRecord, receiveInvitation, getRequestedAttributes, setupCredentialListener, proofRequestListener, acceptProofRequest, rejectProofRequest, stopAgent, deleteConnectionById, acceptOffer, sendProofRequest, createClaim, getClaimList, getAgentInfo, sendMessage, getMessageByThreadId, setupMessageListener, createSchema, setIssuerConfig  } from './handler'
const app = express();
require('dotenv').config();

app.use(express.json());

const port = process.env.PORT || 3002;

let agent: Agent 

app.get('/stopAgent',async (req: Request, res: Response) => {
  try {
    // const { connectionId } = req.body;
     const result = await stopAgent(agent);
     res.status(200).json({ success: true, result }); 
   } catch (error) {
     console.error('Error in /stopAgent:', error);
     res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
   }
})

// generate DID on test net 
app.post('/createDID', async (req: Request, res: Response) => {
  const { role, alias, seed } = req.body;
  const formData = { 
    "role":role, // always null for holder and holder - remove this for endorser role - default endorser for tgrid-net
    "alias":alias,
    // "did":"", //not required
    "seed":seed // 32 char string as seed
   };
  // const apiUrl = "http://test.bcovrin.vonx.io/register";

  // const apiUrl = "http://4.194.26.38:9000/register";
//   const apiUrl = "https://tgrid-network.uat.trustgrid.com/register";

  const apiUrl = "https://tgridnetwork.dev.trustgrid.com/register";

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
      const result = {message: "holder DID created on test network...", data}
      res.status(200).json({ success: true, result });
    })
    .catch(error => {
      console.error('Error in /createDID:', error);
      res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
    });  
});

// getConnectionRecord
app.post('/getConnectionRecord', async (req: Request, res: Response) => {
  try {
   const { connectionId } = req.body;
    const result = await getConnectionRecord(agent, connectionId);
    res.status(200).json({ success: true, result }); 
  } catch (error) {
    console.error('Error in /getConnectionRecord:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// createNewInvitation
app.post('/createNewInvitation', async (req: Request, res: Response) => {
  try {
    // const { agent } = req.body;
    const result = await createNewInvitation(agent);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /createNewInvitation:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// receiveInvitation
app.post('/receiveInvitation', async (req: Request, res: Response) => {
  try {
    const { invitationUrl } = req.body;
    const result = await receiveInvitation(agent, invitationUrl);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /receiveInvitation:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});


// getAllConnections
app.get('/getAllConnections', async (req: Request, res: Response) => {
  try {
    const result = await getAllConnections(agent);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /getAllConnections:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// list of generated DIDs
app.get('/getDids', async (req: Request, res: Response) => {
  try {
    // const { credentialDefinitionId } = req.body;
    const result = await getDids(agent);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /getDids:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// getProofRecord
app.get('/getProofRecord', async (req: Request, res: Response) => {
  try {
    const proofRecord = await getProofRecord();
    res.status(200).json({ success: true, proofRecord });
  } catch (error) {
    console.error('Error in /getIssuedCredential:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

app.get('/getIssuedCredential', async (req: Request, res: Response) => {
  try {
    // const { credentialDefinitionId } = req.body;
    const result = await getIssuedCredential(agent);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /getIssuedCredential:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

app.post('/getIssuedCredentialById', async (req: Request, res: Response) => {
  try {
    const { recordId } = req.body;
    const result = await getIssuedCredentialById(agent,recordId); 
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /getIssuedCredential:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

//acceptOffer - post
app.post('/acceptOffer', async (req: Request, res: Response) => {
  try {
    const {credentialRecordId} = req.body;
    const result = await acceptOffer(agent, credentialRecordId);
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// acceptProofRequest - post
app.post('/acceptProofRequest', async (req: Request, res: Response) => {
  try {
    const {proofRecordId} = req.body;
    const sendProof = await acceptProofRequest(agent, proofRecordId);
    res.status(200).json({ success: true, sendProof });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// rejectProofRequest - post
app.post('/rejectProofRequest', async (req: Request, res: Response) => {
  try {
    const { proofRecordId } = req.body;
    const result = await rejectProofRequest(agent, proofRecordId);
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// proofRequestListener - get api
app.get('/proofRequestListener', async (req: Request, res: Response) => {
  try {
    const message = await proofRequestListener(agent);
    res.status(200).json({ success: true, message });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// setupCredentialListener method - api get
app.get('/setupCredentialListener', async (req: Request, res: Response) => {
  try {
    const result = await setupCredentialListener(agent);
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// getAllConnections - api get
app.get('/getAllConnections', async (req: Request, res: Response) => {
  try {
    const result = await getAllConnections(agent);
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// getConnectionRecord - api get
app.post('/getConnectionRecord', async (req: Request, res: Response) => {
  try {
    const { connectionId} = req.body;
    const result = await getConnectionRecord(agent, connectionId);
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// deleteConnectionById
app.post('/deleteConnectionById', async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.body;
    const result = await deleteConnectionById(agent, connectionId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /deleteConnectionById:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// findPresentation - api get
app.post('/findPresentationById', async (req: Request, res: Response) => {
  try {
    const { proofRecordId} = req.body;
    const result = await findPresentationById(agent, proofRecordId);
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// getRequestedAttributes - api get
app.post('/getRequestedAttributes', async (req: Request, res: Response) => {
  try {
    const { proofRecordId} = req.body;
    const result = await getRequestedAttributes(agent, proofRecordId);
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// initializeAgent - post
app.post('/initializeAgent', async (req: Request, res: Response) => {
  try {
    const {seed, IndyDid, label, walletConfig, endpoints } = req.body;
    const holderAgentInitializer = new HolderAgentInitializer();
    agent = await holderAgentInitializer.initializeAgent(seed, IndyDid, label, walletConfig, endpoints);

    const cache: any[] = [];
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
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root endpoint - get
app.get('/', async (req: Request, res: Response) => {
  try {
    const result = "Holder aries agent is ready to go...!!!";
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });
  }
});


// ========== verifier API ===============

// create cliam
app.post('/createClaim',async (req: Request, res: Response) => {
  try {
    const {claimName, version, attributes, credDefId} = req.body;
    const result = await createClaim(claimName, version, attributes, credDefId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /createClaim:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
}); 

//get calim list
app.get('/getClaimList', async (req: Request, res: Response) => {
  try {
    const result = await getClaimList();
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /getClaimList:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// sendProofRequest
app.post('/sendProofRequest',async (req: Request, res: Response) => {
  try {
    const {connectionRecordId} = req.body;
    const result = await sendProofRequest(agent, connectionRecordId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /sendproofRequest:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
}); 

// get all proofRequestList
app.get('/proofRequestList', async (req: Request, res: Response) => {
  try {
    const result = await proofRequestList(agent);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /getDids:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// get all sendMessage
app.post('/sendMessage', async (req: Request, res: Response) => {
  try {
    const { connId, message } = req.body;
    const result = await sendMessage(agent, connId, message);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /sendMessage:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// getMessageByThreadId
app.post('/getMessageByThreadId', async (req: Request, res: Response) => {
  try {
    const { threadId } = req.body;
    const result = await getMessageByThreadId(agent, threadId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /getMessageByThreadId:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// setupMessageListener
app.post('/setupMessageListener', async (req: Request, res: Response) => {
  try {
    const result = await setupMessageListener(agent);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /setupMessageListener:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// Root endpoint - get
app.get('/agent-info', async (req: Request, res: Response) => {
  try {
    const result = await getAgentInfo(agent);
    res.status(200).json({ success: true, result });
  } catch (error:any) { 
     console.log(error.message)
    res.status(500).json({ success: false, error: error.message });

  }
});

// set did config
app.post('/setConfig', async (req: Request, res: Response) => {
  try {
    const {  seed, did } = req.body;
    const result = await setIssuerConfig(seed, did);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /setConfig:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});
//create schema
app.post('/createSchema', async (req: Request, res: Response) => {
  try {
    // attrNames: ['name','age','dob','issue-date','valid-till']
    const {  name, version, attributes } = req.body;
    const result = await createSchema(agent, name, version, attributes);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error in /createSchema:', error);
    res.status(500).json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

// Generic error handler for unhandled errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Holder API Server is running at http://localhost:${port}`);
});

