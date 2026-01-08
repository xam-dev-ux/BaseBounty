# 🚀 Configuración de Vercel - BaseBounty

## ✅ App Deployada

**URL:** https://base-bounty.vercel.app/

---

## 🔧 Pasos de Configuración Necesarios

### 1. Configurar Variables de Entorno en Vercel

Ve a tu dashboard de Vercel:
https://vercel.com/xam-dev-ux/base-bounty/settings/environment-variables

Agrega estas variables:

```env
VITE_CONTRACT_ADDRESS=0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1
VITE_BASE_RPC_URL=https://mainnet.base.org
```

**Importante:** Después de agregar las variables, debes **Re-deploy** la app.

### 2. Re-Deploy la Aplicación

Opción A - Desde Vercel Dashboard:
1. Ve a: https://vercel.com/xam-dev-ux/base-bounty/deployments
2. Click en los 3 puntos del último deployment
3. Click "Redeploy"
4. Confirma

Opción B - Trigger desde GitHub:
```bash
# Haz un commit vacío
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

### 3. Actualizar URLs en Farcaster Manifest

Edita `frontend/public/.well-known/farcaster.json`:

Busca y reemplaza todas las instancias de:
```
https://basebounty.vercel.app
```

Por:
```
https://base-bounty.vercel.app
```

Campos a actualizar:
- `miniapp.homeUrl`
- `miniapp.iconUrl`
- `miniapp.splashImageUrl`
- `miniapp.screenshotUrls`
- `miniapp.heroImageUrl`
- `miniapp.ogImageUrl`

### 4. Actualizar URLs en index.html

Edita `frontend/index.html`:

Busca y reemplaza en las meta tags:
```
https://basebounty.vercel.app
```

Por:
```
https://base-bounty.vercel.app
```

### 5. Commit y Push Cambios

```bash
cd /home/xabier/basedev/BaseBounty
git add frontend/public/.well-known/farcaster.json
git add frontend/index.html
git commit -m "Update URLs to production Vercel domain"
git push origin main
```

Vercel re-deployará automáticamente.

---

## 🖼️ Crear Imágenes Requeridas

Antes de configurar Farcaster Mini App, necesitas crear estas imágenes:

### Imágenes Necesarias

1. **logo.png** (512x512px)
   - Ruta: `frontend/public/logo.png`
   - Icono de la app

2. **splash.png** (1080x1920px)
   - Ruta: `frontend/public/splash.png`
   - Pantalla de carga

3. **embed.png** (1200x630px)
   - Ruta: `frontend/public/embed.png`
   - Imagen para compartir en redes

4. **hero.png** (flexible)
   - Ruta: `frontend/public/hero.png`
   - Imagen hero de la landing

5. **screenshots/** (3 imágenes, ~1170x2532px)
   - `frontend/public/screenshots/1.png`
   - `frontend/public/screenshots/2.png`
   - `frontend/public/screenshots/3.png`

### Opciones para Crear Imágenes

**Opción A - Placeholder Rápido:**
```bash
cd frontend/public

# Logo SVG ya existe, convertir a PNG
# Puedes usar https://cloudconvert.com/svg-to-png

# O usar placeholders temporales
curl "https://placehold.co/512x512/10b981/ffffff.png?text=BaseBounty" -o logo.png
curl "https://placehold.co/1080x1920/10b981/ffffff.png?text=BaseBounty" -o splash.png
curl "https://placehold.co/1200x630/10b981/ffffff.png?text=BaseBounty" -o embed.png
curl "https://placehold.co/1200x600/10b981/ffffff.png?text=BaseBounty" -o hero.png

mkdir -p screenshots
curl "https://placehold.co/1170x2532/10b981/ffffff.png?text=Screenshot+1" -o screenshots/1.png
curl "https://placehold.co/1170x2532/10b981/ffffff.png?text=Screenshot+2" -o screenshots/2.png
curl "https://placehold.co/1170x2532/10b981/ffffff.png?text=Screenshot+3" -o screenshots/3.png
```

**Opción B - Diseño Profesional:**
- Usa Figma, Canva o Photoshop
- Ver guía: `frontend/public/IMAGES_README.md`

### Commit Imágenes

```bash
git add frontend/public/*.png
git add frontend/public/screenshots/*.png
git commit -m "Add Mini App images (logo, splash, screenshots)"
git push origin main
```

---

## 🎯 Verificar que la App Funciona

### 1. Visita la App
https://base-bounty.vercel.app/

### 2. Verifica que Carga
- ✅ Sin errores en consola
- ✅ UI se ve correctamente
- ✅ Botón "Connect Wallet" visible

### 3. Prueba Conexión de Wallet
- Click "Connect Wallet"
- Aprueba en MetaMask
- Verifica que cambia a Base network

### 4. Verifica Contract Address
Abre la consola del navegador (F12) y busca:
- ¿Hay errores sobre "CONTRACT_ADDRESS"?
- Si sí, las variables de entorno no están configuradas

---

## 🔍 Troubleshooting

### App Muestra Error de Contract

**Problema:**
```
Contract address not configured
```

**Solución:**
1. Verifica variables en Vercel
2. Re-deploy la app
3. Espera 2-3 minutos
4. Recarga la página (Ctrl+Shift+R)

### Imágenes No Cargan

**Problema:**
```
404 Not Found - /logo.png
```

**Solución:**
1. Verifica que las imágenes existen en `frontend/public/`
2. Commit y push
3. Vercel re-deploy automático
4. Verifica en: https://base-bounty.vercel.app/logo.png

### Manifest No Accesible

**Problema:**
```
404 - /.well-known/farcaster.json
```

**Solución:**
1. Verifica que `frontend/vercel.json` existe
2. Verifica rewrites en vercel.json
3. Re-deploy

---

## 📱 Configurar Farcaster Mini App

### Después de tener imágenes y URLs actualizadas:

### 1. Generar Account Association

1. Ve a: https://www.base.dev/preview
2. Busca "Account association"
3. Ingresa: `https://base-bounty.vercel.app`
4. Click "Verify" y firma con tu wallet
5. Copia los valores generados:
   - `header`
   - `payload`
   - `signature`

### 2. Actualizar Manifest

Edita `frontend/public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "eyJ...",
    "payload": "eyJ...",
    "signature": "MHg..."
  },
  "miniapp": {
    ...
  }
}
```

### 3. Commit y Push

```bash
git add frontend/public/.well-known/farcaster.json
git commit -m "Add Farcaster account association"
git push origin main
```

### 4. Verificar en Base Preview

1. Ve a: https://www.base.dev/preview
2. Ingresa: `https://base-bounty.vercel.app`
3. Verifica que todo funciona:
   - ✅ Manifest se carga
   - ✅ Imágenes se muestran
   - ✅ Account association válida
   - ✅ Mini App se puede previsualizar

---

## 🎊 Publicar en Base App

### Cuando todo esté verificado:

1. Ve a: https://base.app (o Warpcast)
2. Crea un nuevo post
3. Incluye tu URL: `https://base-bounty.vercel.app`
4. Agrega descripción:
   ```
   🎯 Just launched BaseBounty on @base!

   A decentralized marketplace for micro-tasks:
   ✅ Post tasks with ETH payments
   ✅ Build onchain reputation
   ✅ Secure dispute resolution

   Try it now! 👇
   ```
5. Publica

Tu Mini App aparecerá automáticamente como un frame interactivo! 🎉

---

## 📊 Checklist de Configuración

### Vercel
- [ ] Variables de entorno configuradas
- [ ] Re-deploy realizado
- [ ] App carga sin errores
- [ ] Contract address correcto

### URLs
- [ ] farcaster.json actualizado con URL de producción
- [ ] index.html actualizado con URL de producción
- [ ] Committed y pusheado

### Imágenes
- [ ] logo.png creado (512x512)
- [ ] splash.png creado (1080x1920)
- [ ] embed.png creado (1200x630)
- [ ] hero.png creado
- [ ] screenshots (3 imágenes) creados
- [ ] Committed y pusheado

### Farcaster
- [ ] Account association generada
- [ ] Manifest actualizado
- [ ] Verificado en base.dev/preview
- [ ] Publicado en Base App

---

## 🔗 Enlaces Útiles

- **Tu App:** https://base-bounty.vercel.app/
- **Vercel Dashboard:** https://vercel.com/xam-dev-ux/base-bounty
- **Contrato en Base:** https://basescan.org/address/0x629633bD173ef8a39AaC4E9dc447Df1C7fE88bc1
- **Base Preview Tool:** https://www.base.dev/preview
- **GitHub Repo:** https://github.com/xam-dev-ux/BaseBounty

---

## 🎯 Próximos Pasos Inmediatos

1. **Configurar variables de entorno en Vercel** ⬅️ URGENTE
2. **Re-deploy la app**
3. **Actualizar URLs en manifest e index.html**
4. **Crear imágenes (o usar placeholders)**
5. **Generar account association**
6. **Publicar en Base App**

---

**Status:** 🚀 Deployado en Vercel - Configuración pendiente

Ver guía completa paso a paso arriba ☝️
