## What does your project do?
Be sure to clearly explain what your dApp is, why you are building it and what the evaluator needs to do to in order to successfully evaluate it in the project README.md.

### User Stories
Creating  several user stories can help the evaluator understand what your dApp is and how potential users are supposed to interact with it. User stories outline how users will interact with the application. They should be descriptions of end goals of the application rather than descriptions of features.

## How to set it up
We ask that you develop your application and run the other projects during evaluation in a VirtualBox VM running Ubuntu 16.04 to reduce the chances of run time environment variables.

## Requirements

### User Interface Requirements:
- Run the app on a dev server locally for testing/grading
- You should be able to visit a URL and interact with the application
- App recognizes current account
  - Sign transactions using MetaMask / uPort
  - Contract state is updated
  - Update reflected in UI

### Test Requirements:
- Write 5 tests for each contract you wrote
- Solidity or JavaScript
  - Explain why you wrote those tests
- Tests run with truffle test
 
### Design Pattern Requirements:
- Implement emergency stop
- What other design patterns have you used / not used?
  - Why did you choose the patterns that you did?
  - Why not others?
 
### Security Tools / Common Attacks:
- Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
 
### Use a library
- Via EthPM or write your own

  
### Stretch requirements (for bonus points, not required):
- Deploy your application onto the Rinkeby test network. Include a document called deployed_addresses.txt that describes where your contracts live on the test net.
- Integrate with an additional service, maybe even one we did not cover in this class
- For example:
  - IPFS
  - uPort
  - Ethereum Name Service
  - Oracle
