const { Wallets, Gateway } = require("fabric-network");
const fs = require('fs');

async function updateDataBlockchain(idSignature, signature, MaGPLX, newNgayhethan) {
    try {
        const ccpPath = "/home/hnem/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
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

        // Submit transaction to chaincode for updating data
        // await contract.submitTransaction('SuaGPLX', MaGPLX, Name, DateOfBirth, CCCD, Address, HangGPLX, PhoneNumber, Email, Ngaycap, Ngayhethan, Ngaytrungtuyen, Status, Giamdoc, Loivipham);
        await contract.submitTransaction('SuaGPLX',MaGPLX, newNgayhethan);

        console.log('Data has been updated on the blockchain');

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to update data: ${error}`);
    }
}

module.exports = {
    updateDataBlockchain
};
