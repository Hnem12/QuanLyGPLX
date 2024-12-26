const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');
const { FabricCAServices } = require('fabric-ca-client');

async function queryGPLXData(MaGPLX, userId) {
    try {
        const ccpPath = "/home/hnem/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Use a file-based wallet instead of an in-memory wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if 'admin' identity is already in the wallet
        let identity = await wallet.get('admin');
        if (!identity) {
            console.log("Admin identity not found in wallet, registering and enrolling...");

            const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
            const ca = new FabricCAServices(caURL);

            // Enroll the admin user if not found in wallet
            const enrollment = await ca.enroll({
                enrollmentID: 'admin',
                enrollmentSecret: 'adminpw',  // Admin password as configured in Fabric CA
            });

            identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };

            await wallet.put('admin', identity);
            console.log("Successfully enrolled admin and imported it into the wallet");
        }

        // Setup Gateway connection
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get network and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');  // Replace 'fabcar' with your chaincode if different

        // Submit the query
        const result = await contract.evaluateTransaction('TimGPLX', MaGPLX);
        
        // Disconnect from the gateway
        await gateway.disconnect();

        return result.toString();  // Return the query result as a string

    } catch (error) {
        console.error('Error querying GPLX:', error);
        throw error;
    }
}

module.exports = { queryGPLXData };
