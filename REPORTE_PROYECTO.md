# Informe de Implementación: Sistema de Reportes y Notificaciones

**Asignatura:** Herramientas de Programación
**Fecha:** 05 de Diciembre, 2025
**Proyecto:** API REST con Node.js - Módulo de Reportes

---

## 1. Objetivos de la Práctica

El objetivo principal fue extender la funcionalidad del microservicio REST existente para incluir capacidades de generación de documentos y notificaciones automáticas. Los puntos específicos abordados fueron:

1.  **Conexión de Datos:** Acceder a los recursos (Productos) desde el servicio REST.
2.  **Generación de Reportes:** Crear documentos PDF dinámicos.
3.  **Notificaciones:** Configurar el envío automático vía Email.
4.  **Validación:** Pruebas integrales del flujo.

---

## 2. Arquitectura de la Solución

Se implementó un flujo lineal automatizado:

> **Base de Datos (MySQL)** ➔ **API (Node.js/Sequelize)** ➔ **Motor de Plantillas (Handlebars)** ➔ **Generador PDF (Puppeteer)** ➔ **Servicio de Email (Resend)**

### Tecnologías Utilizadas
*   **Backend:** Node.js + Express
*   **ORM:** Sequelize (para consultas a MySQL)
*   **PDF:** Puppeteer (Headless Chrome)
*   **Templating:** Handlebars (.hbs)
*   **Email:** Resend API

---

## 3. Desarrollo e Implementación

### 3.1. Acceso a Datos (Conexión Microservicio)
Se utilizó el modelo `Producto` definido en Sequelize para extraer el inventario en tiempo real.

**Fragmento de Código (Controlador):**
```javascript
// src/controllers/report.controller.js
const productos = await Producto.findAll();
// Mapeo de datos para el reporte
const mappedProducts = productos.map(p => ({
    code: p.id,
    description: p.nombre,
    unit_Price: p.precio.toFixed(2),
    total: (p.precio * p.stock).toFixed(2)
}));
```

### 3.2. Generación de Reportes (PDF)
Se diseñó una plantilla HTML (`bill.hbs`) que recibe los datos dinámicos. La librería **Puppeteer** renderiza esta plantilla y captura el PDF, almacenándolo temporalmente y/o en la carpeta `Documentospdf`.

**Evidencia de Generación:**
> *[INSTRUCCIÓN PARA EL ALUMNO: Inserta aquí una captura del archivo PDF abierto, mostrando la lista de productos (Coca Cola, Pepsi, etc.)]*
> ![Ejemplo de PDF Generado](./Documentospdf/captura_pdf.png)

### 3.3. Envío de Notificaciones (Email)
Se configuró el servicio **Resend** para enviar correos transaccionales. El sistema adjunta automáticamente el PDF generado en el paso anterior.

**Configuración (`.env`):**
```env
RESEND_API_KEY=re_eVKMtDFx... (Credencial Configurada)
CONTACT_EMAIL=lzamoramoyano@gmail.com
```

---

## 4. Pruebas y Resultados

### 4.1. Ejecución del Endpoint
Se realizó la prueba consumiendo el endpoint creado:
`GET /api/reports/products/email`

**Evidencia de Consumo (Postman/Consola):**
> *[INSTRUCCIÓN: Inserta aquí la captura de tu consola/terminal mostrando el mensaje "✅ Report sent successfully" o la respuesta del Postman]*
> ![Consola de Ejecución](ruta/a/tu/imagen_consola.png)

### 4.2. Recepción del Correo
El sistema entregó exitosamente el correo con el asunto **"📊 Reporte de Productos e Inventario"**.

**Evidencia de Correo Recibido:**
> *[INSTRUCCIÓN: Inserta aquí la captura del correo en tu Gmail (incluso si está en Spam, mostrando el adjunto)]*
> ![Bandeja de Entrada](ruta/a/tu/imagen_correo.png)

---

## 5. Conclusión

Se ha completado exitosamente la integración del módulo de reportes. El sistema ahora es capaz de transformar datos crudos de la base de datos en documentos profesionales (PDF) y distribuirlos automáticamente a los interesados, cumpliendo con todos los requerimientos de la práctica.
