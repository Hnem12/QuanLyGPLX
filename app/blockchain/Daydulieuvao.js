const { Wallets, Gateway } = require("fabric-network");
const fs = require('fs');

async function pushDataBlockchain(idSignature, signature,  MaGPLX, Tenchusohuu,image, Ngaysinh, CCCD, Ngaytrungtuyen, Ngaycap, Ngayhethan, Email, PhoneNumber, Giamdoc, Status ){
    try {
        const ccpPath = "/home/hnem1/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Initialize in-memory wallet
        const wallet = await Wallets.newInMemoryWallet();
        await wallet.put(idSignature, signature);

        // Setup Gateway connection
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: idSignature, discovery: { enabled: true, asLocalhost: true } });

        // Get network and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');

        // Submit transaction to chaincode
        await contract.submitTransaction('ThemGPLX', MaGPLX, Tenchusohuu,image, Ngaysinh, CCCD, Ngaytrungtuyen, Ngaycap, Ngayhethan, Email, PhoneNumber, Giamdoc, Status);

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

module.exports = {
    pushDataBlockchain
};
