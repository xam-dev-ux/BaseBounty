# 🔍 Guía para Aparecer en Base App Search

## Estado Actual de BaseBounty

### ✅ Requisitos Cumplidos

- ✅ **Manifest accesible**: `https://base-bounty.vercel.app/.well-known/farcaster.json`
- ✅ **Campo `name`**: "BaseBounty"
- ✅ **Primary Category**: "productivity"
- ✅ **Todas las URLs válidas**: iconUrl, splashImageUrl, screenshots, etc.
- ✅ **Base verification tag**: Agregado en index.html
- ✅ **App deployada**: https://base-bounty.vercel.app/

### ❌ Requisitos Faltantes (CRÍTICO)

- ❌ **Account Association**: Campos vacíos en manifest
- ❌ **URL compartida en Base App**: No se ha compartido aún

---

## 🚨 Paso 1: Generar Account Association (URGENTE)

El **account association** es **obligatorio** para que tu app sea indexable. Es una firma criptográfica que verifica que tú controlas el dominio.

### Instrucciones Paso a Paso

1. **Ve a Base Preview Tool**
   ```
   https://www.base.dev/preview
   ```

2. **Busca la sección "Account Association"**
   - Puede estar en un tab o sección específica
   - Busca algo como "Generate Association" o "Sign Account"

3. **Ingresa tu URL**
   ```
   https://base-bounty.vercel.app
   ```

4. **Conecta tu Wallet**
   - Usa la misma wallet que quieres asociar con la app
   - Firma el mensaje cuando te lo pida

5. **Copia los 3 Valores Generados**
   Te dará algo como:
   ```json
   {
     "header": "eyJhbGc...largo...",
     "payload": "eyJkb2...largo...",
     "signature": "0x123...largo..."
   }
   ```

6. **Envíame estos 3 valores** y yo los pondré en el manifest

---

## 🔧 Paso 2: Actualizar Manifest (Lo haré yo)

Una vez que me des los valores del account association, yo actualizaré:

```json
{
  "accountAssociation": {
    "header": "TU_HEADER_AQUI",
    "payload": "TU_PAYLOAD_AQUI",
    "signature": "TU_SIGNATURE_AQUI"
  },
  ...
}
```

Y haré commit + push. Vercel se actualizará automáticamente.

---

## 📱 Paso 3: Compartir URL en Base App

**IMPORTANTE**: Según la documentación oficial de Base, tu app **NO será indexable** hasta que compartas la URL en el feed social.

### Cómo Hacerlo

1. **Abre Base App** (https://base.app) o **Warpcast**

2. **Crea un nuevo post** con tu URL:
   ```
   🎯 Lanzando BaseBounty en @base!

   Marketplace descentralizado para micro-tareas:
   ✅ Publica tareas con pagos en ETH
   ✅ Construye reputación onchain
   ✅ Sistema de resolución de disputas

   ¡Pruébalo ahora en Base L2! 👇
   https://base-bounty.vercel.app
   ```

3. **Publica el post**
   - Base App detectará la URL automáticamente
   - Validará el manifest
   - Comenzará el proceso de indexación

4. **Espera ~10 minutos**
   - La indexación toma hasta 10 minutos
   - Después, tu app será searchable

---

## 🔍 Paso 4: Verificar que Aparece en Search

### Después de 10 minutos:

1. **Abre Base App**

2. **Usa la búsqueda**
   - Busca "BaseBounty"
   - Busca "bounty"
   - Busca "tasks"

3. **Verifica en categorías**
   - Ve a categoría "Productivity"
   - Tu app debería aparecer ahí

### Si NO aparece:

1. **Verifica que el manifest sea accesible**
   ```bash
   curl https://base-bounty.vercel.app/.well-known/farcaster.json
   ```

2. **Usa Base Preview Tool**
   ```
   https://www.base.dev/preview
   ```
   - Ingresa tu URL
   - Verifica que no haya errores

3. **Re-comparte la URL**
   - Cualquier cambio al manifest requiere volver a compartir
   - Crea otro post con la URL

---

## 📋 Checklist Completo

### Pre-Indexación
- [ ] **Account association generada** (ve a base.dev/preview)
- [ ] **Manifest actualizado** con account association
- [ ] **Vercel redployado** con nuevo manifest
- [ ] **Manifest accesible** en https://base-bounty.vercel.app/.well-known/farcaster.json

### Indexación
- [ ] **URL compartida** en Base App o Warpcast
- [ ] **Esperado 10 minutos** después de compartir
- [ ] **Verificado en búsqueda** ("BaseBounty")
- [ ] **Verificado en categoría** (Productivity)

### Post-Indexación
- [ ] **App aparece en search** ✅
- [ ] **Preview se ve bien** (icono, título, descripción)
- [ ] **Launch funciona** (se abre la app correctamente)

---

## 🎯 Superficies de Descubrimiento

Una vez indexada, tu app aparecerá en:

### 1. **Búsqueda Global**
- Usuarios buscan "BaseBounty", "bounty", "tasks", "freelance"
- Matching parcial y exacto

### 2. **Categoría Productivity**
- Ordenado por engagement de 7 días
- Compite con otras apps productivity

### 3. **Apps Guardadas**
- Usuarios pueden "Save" tu app
- Aparece en su lista personal

### 4. **DMs (Direct Messages)**
- Si alguien comparte tu URL en mensaje privado
- Se muestra como embed interactivo

### 5. **Feed Social**
- Posts que incluyan tu URL
- Embeds con preview

---

## 🔧 Troubleshooting

### "Mi app no aparece después de 10 minutos"

**Causas comunes:**

1. **Account Association vacía**
   - Solución: Genera el account association en base.dev/preview

2. **Manifest no accesible**
   - Verifica: `curl https://base-bounty.vercel.app/.well-known/farcaster.json`
   - Debe retornar JSON válido (no 404)

3. **Manifest inválido**
   - Ve a base.dev/preview
   - Ingresa tu URL
   - Verifica errores de validación

4. **URL no compartida**
   - Debes crear un post público con la URL
   - No basta con tener el manifest

5. **Vercel no actualizado**
   - Ve a https://vercel.com/xam-dev-ux/base-bounty/deployments
   - Verifica que el último deploy sea exitoso
   - Verifica timestamp (debe ser reciente)

### "El manifest da error 404"

**Verifica vercel.json:**
```json
{
  "rewrites": [
    {
      "source": "/.well-known/farcaster.json",
      "destination": "/.well-known/farcaster.json"
    }
  ]
}
```

Si falta, Vercel no sirve el archivo correctamente.

### "Account association inválida"

- Regenera en base.dev/preview
- Usa la misma wallet
- Asegúrate de copiar los 3 valores completos
- No modifiques los valores (deben ser exactos)

---

## 📊 Métricas de Engagement

Base App rankea apps por **engagement de 7 días**:
- Lanzamientos de la app
- Tiempo de uso
- Interacciones
- Compartidos

**Tips para mejorar ranking:**
- Pide a usuarios que usen la app
- Comparte actualizaciones regularmente
- Responde a feedback en redes
- Crea contenido educativo

---

## 🎉 Próximos Pasos Inmediatos

### AHORA MISMO:

1. **Ve a**: https://www.base.dev/preview
2. **Genera el Account Association**
3. **Cópiame los 3 valores** (header, payload, signature)

### DESPUÉS (yo lo hago):

4. Actualizar manifest con account association
5. Commit y push
6. Verificar en base.dev/preview

### TÚ HACES:

7. Compartir URL en Base App/Warpcast
8. Esperar 10 minutos
9. Buscar "BaseBounty" en Base App
10. ¡Celebrar! 🎉

---

## 📚 Recursos

- **Base Preview Tool**: https://www.base.dev/preview
- **Base Docs**: https://docs.base.org/mini-apps/
- **Troubleshooting**: https://docs.base.org/mini-apps/troubleshooting/how-search-works
- **Tu App**: https://base-bounty.vercel.app
- **Tu Manifest**: https://base-bounty.vercel.app/.well-known/farcaster.json

---

## ✅ Estado Actual

**Fecha**: 2026-01-09

**Progreso**: 70% completo

**Bloqueador**: Account Association vacía

**Siguiente Paso**: Generar account association en base.dev/preview

---

**Una vez que me des los valores del account association, tu app estará lista para ser indexada en Base App en menos de 15 minutos.** 🚀
