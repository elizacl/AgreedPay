# AgreedPay — Testnet Deployment

## Contract ID
```
CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR
```

## Links
- **StellarExpert**: https://stellar.expert/explorer/testnet/contract/CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR
- **Stellar Lab**: https://lab.stellar.org/r/testnet/contract/CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR
- **Deploy TX**: https://stellar.expert/explorer/testnet/tx/0b368bb48c51e698e237044a0c95c372d980162ff88928fcac6899c41aec442e

## Configuración de despliegue
| Campo              | Valor                                          |
|--------------------|------------------------------------------------|
| WASM Hash          | `9376506ed445239beb653d8389e77af667cd66b0486060cc1122766bd0151940` |
| WASM Size          | 7167 bytes optimizados                         |
| Network            | Testnet (Test SDF Network ; September 2015)    |
| Protocol           | 22                                             |
| Cliente (alice)    | `GA6MBBMLUQQ2KHAESUEAE67WMCMI64AXRVJGAJRCF2EQDFGVKE55MMRU` |
| Freelancer (bob)   | `GD43REI5DWYIHVIWO2XHWODU4Y4K4PXC3IV53Y6M5EEF53I4AFUL3QSR` |
| Token USDC SAC     | `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA` |
| dispute_resolver   | `GA6MBBMLUQQ2KHAESUEAE67WMCMI64AXRVJGAJRCF2EQDFGVKE55MMRU` (alice) |
| timeout_duration   | `1209600` (14 días en segundos)                |
| progress_threshold | `80` (%)                                       |

## Funciones exportadas
- `__constructor`
- `deposit_and_create_milestones`
- `submit_milestone`
- `approve_milestone`
- `claim_timeout`
- `grant_revision_extension`
- `resolve_dispute`

## Comandos de prueba en Testnet

### Variables de entorno
```powershell
$CONTRACT = "CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR"
$ALICE    = "GA6MBBMLUQQ2KHAESUEAE67WMCMI64AXRVJGAJRCF2EQDFGVKE55MMRU"
$BOB      = "GD43REI5DWYIHVIWO2XHWODU4Y4K4PXC3IV53Y6M5EEF53I4AFUL3QSR"
```

### Invocar funciones
```powershell
# Ver estado de un hito
stellar contract invoke --id $CONTRACT --source alice --network testnet `
  -- approve_milestone --milestone_id 0
```

## Notas
- El bug de `cargo test` es un conflicto upstream en `soroban-env-host v22.1.3` entre `ed25519-dalek v3.0.0` (rand_core 0.9) y `ChaCha20Rng` (rand_core 0.6). No es un error del contrato.
- Las pruebas de integración pueden realizarse directamente en Testnet con `stellar contract invoke`.
