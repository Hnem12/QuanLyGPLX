const fs = require('fs');
const { Wallets, Gateway } = require('fabric-network');
const { FabricCAServices } = require('fabric-ca-client'); // Correct import for newer versions
const { X509WalletMixin } = require('fabric-network');

async function queryGPLXData(MaGPLX, userId) {
    try {
        const ccpPath = "/home/hnem1/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Initialize in-memory wallet
        const wallet = await Wallets.newInMemoryWallet();

        // Check if the 'admin' identity is available in the wallet
        let identity = await wallet.get('admin');  // Look for 'admin' identity in the wallet

        if (!identity) {
            console.log("Identity not found, registering and enrolling...");

            // Fabric CA URL and admin identity details
            const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
            const ca = new FabricCAServices(caURL);  // Correct usage for creating a FabricCAServices instance

            // Admin identity details from the wallet
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                throw new Error('Admin identity not found in wallet');
            }

            // Register a new user (in this case, we use 'admin' for simplicity)
            const registrationRequest = {
                enrollmentID: 'admin',
                affiliation: 'org1.department1',
                role: 'client'
            };

            // Register user with Fabric CA
            const secret = await ca.register(registrationRequest, adminIdentity);

            // Enroll the user (admin in this case)
            const enrollment = await ca.enroll({
                enrollmentID: 'admin', 
                enrollmentSecret: secret // Use the secret received during registration
            });

            // Create identity and store it in wallet
            identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            await wallet.put('admin', identity);
        }

        // Setup Gateway connection
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin',  // Ensure 'admin' identity is used here for querying
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get network and contract from the gateway
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar'); // 'fabcar' is the name of the chaincode

        // Submit the query to the chaincode to get the GPLX data
        const result = await contract.evaluateTransaction('TimGPLX', MaGPLX); // This assumes 'TimGPLX' is the correct function in chaincode

        // Disconnect from the gateway
        await gateway.disconnect();

        // Return the result as a string
        return result.toString();  // Return the result after converting to string

    } catch (error) {
        console.error('Error querying GPLX:', error);
        throw error;  // Rethrow the error to handle it later in the controller
    }
}

module.exports = { queryGPLXData };
