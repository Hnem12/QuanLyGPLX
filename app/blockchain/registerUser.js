const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

async function DangKyNguoiDung(accountId) {
    try {
        // Load the network configuration
        const ccpPath = "/home/hnem1/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system-based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check if the admin user is enrolled.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            throw new Error('Admin identity is missing in the wallet. Please enroll the admin first.');
        }

        // Build a user object for authenticating with the CA.
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: accountId,
            role: 'client'
        }, adminUser);
        
        const enrollment = await ca.enroll({
            enrollmentID: accountId,
            enrollmentSecret: secret
        });
        
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        
        await wallet.put(accountId, x509Identity);  // Store the identity in the wallet
        console.log(`Successfully registered and enrolled user "${accountId}" and imported it into the wallet`);

        return x509Identity;

    } catch (error) {
        console.error(`Failed to register user "${accountId}": ${error}`);
        throw new Error(`User registration failed: ${error.message}`); // Improved error handling
    }
}

module.exports = {
    DangKyNguoiDung,
};
