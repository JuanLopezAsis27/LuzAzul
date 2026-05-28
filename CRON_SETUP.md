# Configuración del Cron Job

El proyecto tiene dos mecanismos para ejecutar el cron job que cierra las cargas diarias a las 00:00 hora Argentina (03:00 UTC):

## 1. Node-Cron (Automático dentro de la app)

Se ejecuta automáticamente cuando el servidor inicia. Este mecanismo se ejecuta en el proceso Node.js de la aplicación.

**Limitaciones:**
- Solo funciona mientras el proceso Node.js está corriendo
- Si el servidor se reinicia, el cron continúa funcionando desde el nuevo inicio
- Si el proceso se suspende/pausa, el cron no se ejecuta

## 2. Cron del Sistema (Recomendado para Producción)

Para mayor confiabilidad, usa el script `cron-trigger.sh` con el crontab del sistema operativo.

### Configuración en Linux/macOS:

1. **Establecer variables de entorno:**
   ```bash
   export APP_URL="https://tu-app.com"
   export CRON_SECRET="tu-secret-key"
   ```

2. **Editar crontab:**
   ```bash
   crontab -e
   ```

3. **Agregar esta línea (ejecuta todos los días a las 00:00 Argentina = 03:00 UTC):**
   ```cron
   0 3 * * * cd /ruta/al/proyecto && ./cron-trigger.sh $APP_URL $CRON_SECRET >> logs/cron.log 2>&1
   ```

### Configuración en Docker (usando cron dentro del contenedor):

Agrega al `Dockerfile`:

```dockerfile
# Instalar cron
RUN apk add --no-cache dcron

# Copiar script del cron
COPY cron-trigger.sh /app/cron-trigger.sh
RUN chmod +x /app/cron-trigger.sh

# Crear archivo crontab
RUN echo "0 3 * * * /app/cron-trigger.sh http://localhost:3000 \$CRON_SECRET >> /var/log/cron.log 2>&1" > /etc/crontabs/root

# Iniciar crond en segundo plano
CMD ["sh", "-c", "crond && node server.js"]
```

### Variables de entorno requeridas:

- `CRON_SECRET`: Token secreto para autenticar llamadas al endpoint de cron
  
Ejemplo en `.env`:
```
CRON_SECRET=tu-secret-muy-seguro
```

## Verificación

1. **Ver logs del cron:**
   ```bash
   # En la app (en los logs de stderr/stdout)
   grep "CRON" logs/app.log
   
   # O si usas crontab:
   cat logs/cron.log
   ```

2. **Verificar base de datos:**
   Comprueba que las cargas de ayer a las 00:00 se hayan cerrado:
   ```sql
   SELECT id, date, isClosed FROM daily_load WHERE date = CURRENT_DATE - 1;
   ```

## Solución de problemas

**El cron no se ejecuta:**
- Verifica que el proceso Node.js esté corriendo (si usas node-cron)
- Verifica que crontab esté configurado correctamente: `crontab -l`
- Revisa los logs: `grep CRON /var/log/syslog`
- Asegúrate de que `CRON_SECRET` sea correcto

**El endpoint falla con 401:**
- Verifica que `CRON_SECRET` sea idéntico en la app y en el script
- Verifica que el header Authorization sea correcto: `Bearer <token>`
