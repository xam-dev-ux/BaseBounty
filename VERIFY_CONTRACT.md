# 🔍 Cómo Verificar tu Contrato en Basescan

## ✅ Opción 1: Variables de Entorno (Recomendado)

```bash
# Exporta las variables
export CONTRACT_ADDRESS=0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1
export PLATFORM_WALLET=0x8f058fe6b568d97f85d517ac441b52b95722fdde

# Ejecuta verificación
npx hardhat run scripts/verify.js --network base
```

## ✅ Opción 2: Comando Directo de Hardhat

```bash
npx hardhat verify --network base \
  0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1 \
  0x8f058fe6b568d97f85d517ac441b52b95722fdde
```

## ✅ Opción 3: Agregar al .env (Más Seguro)

```bash
# Edita tu archivo .env
nano .env
```

Agrega estas líneas:
```env
CONTRACT_ADDRESS=0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1
PLATFORM_WALLET=0x8f058fe6b568d97f85d517ac441b52b95722fdde
```

Luego ejecuta:
```bash
npx hardhat run scripts/verify.js --network base
```

## 📋 Valores que Necesitas

Basado en tu comando anterior:
- **Contract Address**: `0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1`
- **Platform Wallet**: `0x8f058fe6b568d97f85d517ac441b52b95722fdde`

## 🔑 Asegúrate de tener

En tu `.env`:
```env
BASESCAN_API_KEY=tu_api_key_de_basescan
```

Si no tienes API key:
1. Ve a https://basescan.org/myapikey
2. Crea una cuenta (gratis)
3. Genera un API key
4. Agrégalo al .env

## ⚡ Comando Rápido (Copia y Pega)

```bash
npx hardhat verify --network base 0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1 0x8f058fe6b568d97f85d517ac441b52b95722fdde
```

## 🎯 Resultado Esperado

Si todo funciona correctamente, verás:

```
🔍 Verifying contract on Basescan...
📍 Contract: 0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1
🏦 Platform Wallet: 0x8f058fe6b568d97f85d517ac441b52b95722fdde
🔗 Network: base

✅ Contract verified successfully!
🔗 View on Basescan: https://basescan.org/address/0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1
```

## ❌ Si Recibes Errores

### "Already Verified"
```
✅ Contract is already verified!
```
¡Perfecto! Ya está verificado.

### "Invalid API Key"
Necesitas agregar `BASESCAN_API_KEY` a tu `.env`

### "Unable to locate ContractCode"
Espera 1-2 minutos después del deployment y reintenta.

### "Compilation errors"
El código en Basescan no coincide. Verifica que estés usando el mismo código deployado.

## 🔗 Ver tu Contrato

Una vez verificado:
https://basescan.org/address/0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1

Podrás:
- ✅ Ver el código fuente
- ✅ Leer funciones del contrato
- ✅ Escribir/ejecutar funciones
- ✅ Ver eventos y transacciones

## 📝 Notas

- La verificación puede tardar 10-30 segundos
- Si falla, reintenta después de 1 minuto
- Basescan API V1 sigue funcionando (ignorar warning)
