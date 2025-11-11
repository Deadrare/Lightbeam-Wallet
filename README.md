# Lightbeam Wallet

Chrome extension wallet for Keeta Network's BlockDAG blockchain.

## Features

- Secure BIP-39 mnemonic wallet generation and import
- Password-protected encrypted storage
- Send and receive KTA tokens
- Network switching (Testnet/Mainnet)
- dApp integration via `window.keeta` provider

## Development

```bash
# Install dependencies
yarn install

# Build for development (with watch)
yarn dev

# Build for production
yarn build

# Lint
yarn lint
yarn lint-fix

# Type check
yarn type
```

## Installation

1. Build the extension:
   ```bash
   yarn build
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (top right)

4. Click "Load unpacked" and select the `dist` folder

## Usage

### Creating a Wallet

1. Click the Lightbeam extension icon
2. Choose "Create New Wallet"
3. Save your 12-word recovery phrase securely
4. Set a password

### Importing a Wallet

1. Click the Lightbeam extension icon
2. Choose "Import Wallet"
3. Enter your 12 or 24-word recovery phrase
4. Set a password

### Sending KTA

1. Unlock your wallet
2. Click "Send"
3. Enter recipient address (keeta_...)
4. Enter amount
5. Confirm transaction

### Receiving KTA

1. Unlock your wallet
2. Click "Receive"
3. Copy your address and share with sender

### dApp Integration

Websites can interact with Lightbeam Wallet using the `window.keeta` API:

```javascript
// Connect wallet
const accounts = await window.keeta.connect()

// Get accounts
const accounts = await window.keeta.getAccounts()
```

## Security

- Seeds are encrypted with PBKDF2 (100k iterations) + AES-256-GCM
- Passwords never leave the extension
- Auto-lock after 15 minutes of inactivity
- Transactions require explicit user approval

## License

All Rights Reserved. See [LICENSE](LICENSE) file for details.

## Legal Notice

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.

---

**Disclaimer**: This is experimental software. Use at your own risk. Always verify transactions before signing.
