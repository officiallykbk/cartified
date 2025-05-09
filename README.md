# Cartified

**By KBN**

_Carted, Certified, Verified_

A decentralized shopping platform...


App Flow
 1. Order Placed
Buyer places an order → NFT is minted to their wallet → Payment held in escrow.

NFT = Order receipt + delivery claim token.

🚚 2. Delivery in Progress
Delivery personnel heads out with the package.

Buyer’s app shows the delivery NFT via FloatingActionButton.

📱 3. Buyer Opens App → Confirms Delivery
Buyer clicks FAB → modal lists their NFTs.

Buyer selects the NFT and clicks "Confirm Delivery".

📷 4. QR Code Displayed
App generates a QR code that includes:

tokenId

Buyer’s wallet address

Optional order hash / checksum

This code is shown full-screen for the delivery person to scan.

📱 5. Delivery Personnel Scans QR
They use your delivery-side app (or a DApp scan tool).

The scan triggers a signed request to contract.confirmDelivery(tokenId):

This call can be made from the buyer's wallet (auto-approve inside app), or via a relayer if permissioned.

Could also use session keys / delegated auth to approve burn without re-signing.

🔥 6. Smart Contract Executes
Verifies sender and tokenId.

Burns the NFT (delivery confirmed).

Releases escrowed payment to seller/delivery agent.

✅ 7. App Feedback
Buyer and delivery person see:

“Delivery confirmed”

Burned NFT removed from UI.

Toast: "Delivery confirmed successfully!"