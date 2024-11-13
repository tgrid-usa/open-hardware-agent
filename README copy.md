# holder-cloud-agent
rest api for holder so, it should consume in mobile app. [ afj cloud agent ] 

"data": {
      "did": "HfTq7SmrNxnmGdEakeg4Zs",
      "seed": "gbortramrrysercure00000000000000",
      "verkey": "A5knfeQtgZeFDboY48tqU1AEYhgZwVhpWp9V89j5cuyT"
    }


===== local-agent
# Date: 03-08-2024 - using in holder demo agent

### body: 
{
   "alias":"test-holder",
   "seed":"sportmoverysercure00000000000000"
}

### response:
{
  "success": true,
  "result": {
    "message": "holder DID created on test network...",
    "data": {
      "did": "GnSQL7M7b1yXdZQGvZ3RCj",
      "seed": "sportmoverysercure00000000000000",
      "verkey": "9bwoLVjHVbPt7hqpLrP2RgJuJz7XL1waUPSpKTuaNowX"
    }
  }
}

## Agent init details for test holder
{
    "seed": "sportmoverysercure00000000000000",
    "IndyDid": "GnSQL7M7b1yXdZQGvZ3RCj",
    "label": "Test Holder",
    "walletConfig": {
      "id": "Test Holder",
      "key": "password#holder"
    },
    "endpoints": ["http://hagent.dev.trustgrid.com:9080"]
}


new holder agent on: 9081 & 9080 - hagent.dev.trustgrid.com to 9080 port in backend vm

issuer agent on 8050 and 8010 - dns  iagent.uat.trustgrid.com to 8010 port in uat vm

## ============ Message Object ================

### send message
response: { "success": true, "result": { "_tags": {}, "metadata": {}, "id": "137730f2-0708-4907-932d-b1108f63b160", "createdAt": "2024-09-23T10:59:42.119Z", "content": "yes verifier all good", "sentTime": "2024-09-23T10:59:42.119Z", "connectionId": "06e16577-888b-4990-863a-81d5a60cf600", "role": "sender", "threadId": "be715b82-851c-4fe6-816d-a6d5d65b05b6", "updatedAt": "2024-09-23T10:59:42.120Z" } }

### getMessageByThreadId
response: { "success": true, "result": { "_tags": { "connectionId": "06e16577-888b-4990-863a-81d5a60cf600", "role": "sender", "threadId": "be715b82-851c-4fe6-816d-a6d5d65b05b6" }, "metadata": {}, "id": "137730f2-0708-4907-932d-b1108f63b160", "createdAt": "2024-09-23T10:59:42.119Z", "content": "yes verifier all good", "sentTime": "2024-09-23T10:59:42.119Z", "connectionId": "06e16577-888b-4990-863a-81d5a60cf600", "role": "sender", "threadId": "be715b82-851c-4fe6-816d-a6d5d65b05b6", "updatedAt": "2024-09-23T10:59:42.120Z" } }