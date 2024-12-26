"use strict";

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");

async function revokeUserKey(accountId, signature) {
    try {
        // Load the connection profile
        const ccpPath = "/home/hnem/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Initialize in-memory wallet and add the provided identity
        const wallet = await Wallets.newInMemoryWallet();
        await wallet.put(accountId, signature);

        // Set up the Fabric CA client
        const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
        const ca = new FabricCAServices(caURL);

        // Retrieve the identity from the wallet
        const provider = wallet.getProviderRegistry().getProvider(signature.type);
        const identityUser = await provider.getUserContext(signature, accountId);

        // Revoke the certificate associated with the accountId
        const resultRevoke = await ca.revoke(
            { enrollmentID: accountId, gencrl: true },
            identityUser
        );

        // Get the CRL (Certificate Revocation List)
        const crlString = resultRevoke.result.CRL;
        if (crlString) {
            console.log(`Successfully revoked key for user: ${accountId}`);
            return { success: true, message: "User key revoked successfully!" };
        } else {
            console.error("Revocation failed; no CRL generated.");
            return { success: false, message: "Revocation failed; no CRL generated." };
        }
    } catch (error) {
        console.error(`Failed to revoke user key: ${error.message}`);
        return { success: false, message: "Failed to revoke user key due to error." };
    }
}

module.exports = {
    revokeUserKey
};
