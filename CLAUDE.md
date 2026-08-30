# PPTO-GAM · Memoria del Proyecto

## Contexto General

**Proyecto:** Aplicación de Control de Gestión para el Centro Cultural Gabriela Mistral (GAM)  
**Objetivo:** Reemplazar el flujo Excel → PowerPoint → Qlik por una aplicación web propia con dashboards interactivos y drill-down.  
**Cliente:** GAM (Centro Cultural Gabriela Mistral), Santiago de Chile  
**ERP Actual:** SAP One → migración futura a **Flexline**  
**Estado:** Fase de diseño y planificación. Esperando orden de inicio para ejecutar.

## Decisiones de Arquitectura

### Stack Tecnológico
- **Frontend:** React 18 + TypeScript + Vite
- **Visualización:** Recharts v2.x
- **Estado:** Zustand + React Router v6
- **Backend (Fase 2):** FastAPI (Python 3.12)
- **Base de datos (Fase 2):** PostgreSQL 16 + SQLAlchemy + Alembic
- **Ingesta de datos:** Python + pandas (scripts ETL)
- **Deploy:** Docker + Docker Compose
- **Auth (Fase 3):** JWT con FastAPI OAuth2

### Principio Clave
El prototipo usa los mismos componentes React de producción. Solo cambia la fuente de datos:
- **Fase 0–1 (prototipo):** datos desde archivos JSON locales (generados desde Excel)
- **Fase 2+ (producción):** datos desde FastAPI + PostgreSQL
- **Fase 4 (futuro):** datos desde Flexline API directamente

El código frontend NO cambia entre fases. Solo la capa de datos.

### Multi-tenant
- Arquitectura multi-tenant desde Fase 3
- Aislamiento por `tenant_id` en todas las tablas
- Row-Level Security en PostgreSQL
- GAM es el único tenant activo por ahora

## Archivos de Datos (Fuentes Excel)

Los 5 archivos Excel subidos están en:
```
/root/.claude/uploads/e6ab2290-85dc-5766-b882-e4947c74218b/
```

| Archivo | Descripción | Hojas clave |
|---------|-------------|-------------|
| `dc4312ef-Ppto_GAM_2026___rea_y_CC__V19052026.xlsx` | Presupuesto de Gastos 2026 | Resumen, Adm y Finanzas, Programación, Técnica, Producción, Comercial y Mkt, Comunicaciones, Dirección Ejecutiva, GxD, Inversiones |
| `bc117802-PDC_Ppto_Comercial_2026_Ingresos.xlsx` | Presupuesto de Ingresos 2026 | PDC IC, Auspicios, Locales, Espacios |
| `ee07e43d-Consolidado_Ticketing_20222026.xlsx` | Histórico Ticketing 2022–2026 | INGRESOS POR TICKET, INGRESOS OPERACIONALES |
| `bd9f74b4-Liquidacion_Mensual_GAM_Mensual_7_2026.xlsx` | Liquidación Mensual Julio 2026 | Resumen, Tickets (5316 filas), Pagos (4499 filas), 41 hojas por evento |
| `e68c1c20-Reporte_Ticketing_2026_2.xlsx` | Reporte Ticketing 2026 | Hoja1, PDC |

## Estructura de Datos Extraídos

### Ppto_GAM (Gastos)
- Estructura: `Área → Ítem → SubÍtem → Mes → Real | Ppto`
- Áreas: Admin/GP/Finanzas, Programación, Técnica, Producción, Comercial y Mkt, Comunicaciones, Dirección Ejecutiva, GxD, Inversiones
- Unidad: Miles de Pesos (M$)
- Lógica de % ejecución: `Real / Ppto` (tal como está en los archivos actuales)

### PDC_Ppto_Comercial (Ingresos)
- Líneas: Auspicios/Donaciones, Arriendo Locales, Arriendo Espacios, Ticketing
- Locatarios: FERIA DE ANTIGÜEDADES, BIOPHILIA, CITYLAB, EDÍN, LA JARDÍN, ROBUSTA, SAN SERGIO
- Espacios: Comercial / Artístico
- Auspiciadores actuales: SURA + 2 auspiciadores nuevos planificados

### Ticketing - Campos clave
**Tabla Tickets:**
`cart_id, request_id, sale_detail_id, confirmed_month, confirmed_year, state, event, ticket_name, channel_name, ticket_amount, ticket_charge, commission, parent_ticket, channel_parent, state_ticket_amount, confirmed_date`

**Tabla Pagos:**
`token, payment_id, sale_detail_id, amount, payment_gateway, month, year, event, cost, boxoffice, date`

**Medios de pago:** Pagolatam Fintoc, Getnet Web Checkout, Pagolatam Webpay Plus Débito/Crédito
**Canales:** Internet (GAM web), Boxoffice (taquilla)

### Ingresos Operacionales (Consolidado)
- Líneas: MINCAP ordinario, Otros MINCAP, Auspicios/Donaciones, Locatarios, Espacios Programables, Ticketing
- Comparativas: Año 2025 real | Ppto 2026 | Año 2026 real

## Módulos de la Aplicación

```
PPTO-GAM App
├── Dashboard Ejecutivo (KPIs, semáforos, alertas)
├── Presupuesto de Gastos
│   ├── Resumen por Área (Real vs Ppto con % ejecución)
│   └── Detalle por Área → Ítem → SubÍtem (drill-down)
├── Ingresos Operacionales
│   ├── Resumen Total (todas las líneas)
│   ├── Locatarios (por inquilino)
│   ├── Espacios Programables (Comercial / Artístico)
│   ├── Auspicios y Donaciones (por auspiciador)
│   └── MINCAP (aportes ordinarios y extraordinarios)
└── Ticketing
    ├── Dashboard mensual (vs Ppto)
    ├── Por Evento → Función → Ticket (drill-down)
    ├── Ranking de eventos
    ├── Canales de venta y medios de pago
    └── Histórico 2022–2026
```

## Fases de Desarrollo

| Fase | Descripción | Timeline | Hito |
|------|-------------|----------|------|
| **0** | Setup + Scripts ETL Excel→JSON | Semana 1 | Datos estructurados en JSON |
| **1** | Prototipo con datos reales (sin backend) | Semanas 2–4 | **URL para mostrar al cliente** |
| **2** | FastAPI + PostgreSQL + carga de Excel | Semanas 5–8 | Cliente sube sus propios Excel |
| **3** | Multi-tenant + Auth JWT + Deploy GAM | Semanas 9–11 | **Producción en servidores GAM** |
| **4** | Flexline API + PPTO en la app | Post-migración ERP | Operación 100% sin Excel |

## Estructura de Carpetas del Proyecto (a crear en Fase 0)

```
/home/user/GAM/
├── CLAUDE.md                    ← este archivo
├── frontend/
│   ├── src/
│   │   ├── components/         ← componentes UI reutilizables
│   │   ├── modules/            ← Dashboard, Gastos, Ingresos, Ticketing
│   │   ├── data/               ← archivos JSON generados por ETL
│   │   ├── hooks/              ← hooks de datos
│   │   ├── store/              ← Zustand (filtros, estado global)
│   │   └── types/              ← TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── backend/                    ← FastAPI (Fase 2)
│   ├── app/
│   │   ├── api/               ← endpoints REST
│   │   ├── models/            ← SQLAlchemy models
│   │   ├── schemas/           ← Pydantic schemas
│   │   └── etl/               ← scripts de carga Excel
│   └── requirements.txt
├── data/
│   ├── raw/                   ← Excel originales (no en Git)
│   └── processed/             ← JSON generados (en Git para prototipo)
└── docker-compose.yml
```

## Modelo de Datos PostgreSQL (Fase 2)

Entidades principales (todas con `tenant_id`):
- `Tenant` — organizaciones (GAM + futuros clientes)
- `Area` — áreas presupuestarias
- `ItemGasto` → `EjecucionMensual` — árbol de gastos con valores mensuales
- `LineaIngreso` → `IngresoMensual` — árbol de ingresos con valores mensuales
- `Evento` → `Funcion` → `Ticket` — jerarquía de ticketing
- `Pago` — transacciones de pago por ticket
- `HistoricoTicketing` — tabla consolidada para series históricas

## Convenciones de Código

- Idioma del código: **inglés** (variables, funciones, tipos)
- Idioma de la UI: **español** (etiquetas, mensajes, títulos)
- Moneda: pesos chilenos, en **miles de pesos (M$)** para consistencia con Excel
- Separador de miles: punto (.) — formato chileno
- Decimales: coma (,)
- Formato de fecha: DD/MM/YYYY
- % ejecución: `real / ppto` — nunca `(ppto - real) / ppto`
- Semáforo: verde ≥ 95%, amarillo 80–94%, rojo < 80%

## Comandos de Desarrollo (cuando estén disponibles)

```bash
# Frontend
cd frontend && npm install
npm run dev        # desarrollo local (http://localhost:5173)
npm run build      # build de producción

# Scripts ETL (Fase 0)
cd data && python etl/extract_gastos.py
python etl/extract_ingresos.py
python etl/extract_ticketing.py

# Backend (Fase 2)
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload

# Docker (Fase 2+)
docker compose up -d
docker compose down
```

## Notas Importantes

- Los Excel de GAM están en **miles de pesos (M$)** — no convertir a pesos al mostrar.
- El campo `%` en los Excel originales usa la lógica `Real / Ppto`. Usar la misma.
- Los eventos de ticketing usan el formato `Nombre - CODIGO` (ej: "Velocirraptors - 180849").
- Las cortesías tienen `ticket_amount = 0` y `ticket_charge = 0`.
- Julio 2026 es el mes de datos transaccionales disponibles. Otros meses están en el consolidado.
- El artefacto del plan de desarrollo está en: https://claude.ai/code/artifact/69f7eefd-7df0-40c6-aad2-e6491e038692

## Rama de Desarrollo

```
Branch: claude/proyecto-ppto-gam-cy9oc6
Repo: cmauricioaguilar-del/gam
```
