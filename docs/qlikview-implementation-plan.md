# Plan de Implementación de QlikView — Proyecto GAM

## Resumen Ejecutivo

Este documento describe el plan completo para implementar QlikView como plataforma de Business Intelligence en el proyecto GAM. El objetivo es proveer dashboards interactivos, reportes analíticos y visualizaciones de datos que permitan tomar decisiones basadas en datos en tiempo real.

---

## 1. Objetivos

| Objetivo | Descripción |
|---|---|
| Centralizar datos | Unificar fuentes de datos heterogéneas en un modelo QlikView |
| Visualización | Crear dashboards interactivos por área de negocio |
| Acceso controlado | Gestionar permisos por rol de usuario |
| Escalabilidad | Arquitectura que soporte crecimiento de datos y usuarios |
| Automatización | ETL y recarga de datos programada sin intervención manual |

---

## 2. Arquitectura General

```
┌────────────────────────────────────────────────────────────┐
│                     FUENTES DE DATOS                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   BBDD   │  │   APIs   │  │  Archivos│  │ Servicios │  │
│  │ SQL/NoSQL│  │  REST    │  │ CSV/XLSX │  │  Nube     │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼──────────────┼─────────┘
        │             │             │              │
┌───────▼─────────────▼─────────────▼──────────────▼─────────┐
│                    CAPA ETL / QlikView Script               │
│        (Extracción, Transformación, Carga de datos)         │
└───────────────────────────┬────────────────────────────────-┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    QlikView Server / QlikSense               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Aplicación │  │  Aplicación  │  │   Aplicación     │   │
│  │  Ventas     │  │  Finanzas    │  │   Operaciones    │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      USUARIOS FINALES                        │
│   Gerentes │ Analistas │ Operativos │ Directivos              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Fases de Implementación

### Fase 1 — Levantamiento y Diseño (Semanas 1–3)

**Objetivo:** Entender necesidades del negocio y diseñar la arquitectura de datos.

**Actividades:**
- [ ] Relevamiento de requerimientos con áreas de negocio
- [ ] Inventario de fuentes de datos disponibles (bases de datos, APIs, archivos)
- [ ] Definición del modelo de datos conceptual
- [ ] Diseño del modelo de datos en QlikView (modelo estrella / copo de nieve)
- [ ] Definición de KPIs e indicadores por área
- [ ] Diseño de wireframes de dashboards
- [ ] Definición de roles y matriz de accesos

**Entregables:**
- Documento de requerimientos (BRD)
- Modelo de datos conceptual
- Wireframes aprobados
- Matriz de roles y permisos

---

### Fase 2 — Infraestructura y Entorno (Semanas 2–4)

**Objetivo:** Instalar y configurar el entorno QlikView.

**Actividades:**
- [ ] Provisionar servidor QlikView (on-premise o cloud)
- [ ] Instalar QlikView Server / QlikView Publisher
- [ ] Configurar QlikView Management Console (QMC)
- [ ] Configurar autenticación (Active Directory / SAML / OAuth)
- [ ] Configurar Section Access para control de acceso por fila
- [ ] Definir entornos: Desarrollo, QA, Producción
- [ ] Establecer pipeline de CI/CD para documentos QlikView (`.qvw`)

**Requisitos de Infraestructura:**

| Componente | Mínimo | Recomendado |
|---|---|---|
| CPU (QV Server) | 4 cores | 8+ cores |
| RAM | 16 GB | 32–64 GB |
| Almacenamiento | 200 GB SSD | 500 GB+ SSD |
| SO | Windows Server 2019 | Windows Server 2022 |
| Red | 100 Mbps | 1 Gbps |

---

### Fase 3 — Desarrollo ETL y Modelo de Datos (Semanas 4–8)

**Objetivo:** Construir los scripts de carga y el modelo de datos en QlikView.

**Actividades:**
- [ ] Desarrollar conectores para cada fuente de datos
- [ ] Escribir scripts QlikView Load Script para extracción
- [ ] Implementar transformaciones y limpieza de datos
- [ ] Construir tablas de hechos y dimensiones
- [ ] Implementar tabla calendario (dimensión fecha)
- [ ] Crear QVDs (QlikView Data Files) intermedios para optimizar cargas
- [ ] Implementar carga incremental para tablas de alto volumen
- [ ] Documentar el modelo de datos final

**Estructura de Carpetas del Proyecto:**
```
GAM/
├── qlikview/
│   ├── scripts/
│   │   ├── 01_conexion_fuentes.qvs
│   │   ├── 02_extraccion_ventas.qvs
│   │   ├── 03_extraccion_finanzas.qvs
│   │   ├── 04_transformaciones.qvs
│   │   └── 05_modelo_datos.qvs
│   ├── qvd/
│   │   ├── raw/          # QVDs de datos crudos
│   │   └── refined/      # QVDs transformados
│   ├── apps/
│   │   ├── ventas.qvw
│   │   ├── finanzas.qvw
│   │   └── operaciones.qvw
│   └── includes/
│       ├── variables.qvs
│       └── subroutines.qvs
├── docs/
│   └── qlikview-implementation-plan.md
└── README.md
```

---

### Fase 4 — Desarrollo de Dashboards (Semanas 7–12)

**Objetivo:** Construir las aplicaciones QlikView con visualizaciones por área de negocio.

#### 4.1 Aplicación de Ventas

- Dashboard ejecutivo de ventas (KPIs principales)
- Análisis de ventas por período, región, producto
- Embudo de conversión
- Comparativo año actual vs año anterior
- Top clientes y productos
- Mapa de calor geográfico

#### 4.2 Aplicación de Finanzas

- Estado de resultados interactivo
- Análisis de flujo de caja
- Presupuesto vs Ejecutado
- Análisis de cuentas por cobrar / pagar
- Indicadores financieros (ROI, margen, EBITDA)

#### 4.3 Aplicación de Operaciones

- Indicadores de producción / servicio
- Tiempos de ciclo y eficiencia
- Gestión de inventarios
- Métricas de calidad
- Seguimiento de SLAs

**Estándares de Diseño:**
- Paleta corporativa consistente en todas las apps
- Layout responsive (desktop y tablet)
- Tooltips descriptivos en todos los gráficos
- Filtros globales en el header de cada aplicación
- Botones de exportación a Excel/PDF

---

### Fase 5 — Seguridad y Accesos (Semanas 10–12)

**Objetivo:** Implementar control de acceso granular.

**Actividades:**
- [ ] Implementar Section Access en cada aplicación
- [ ] Configurar grupos de usuarios por rol
- [ ] Aplicar seguridad a nivel de fila de datos (Row-Level Security)
- [ ] Auditar accesos con logs de QlikView Server
- [ ] Documentar matriz de permisos final

**Roles Definidos:**

| Rol | Aplicaciones | Nivel de Datos |
|---|---|---|
| Administrador | Todas | Sin restricción |
| Gerente General | Todas | Sin restricción |
| Gerente de Área | Su área | Su región / BU |
| Analista | Su área | Sus datos asignados |
| Visualizador | Dashboards ejecutivos | Datos agregados |

---

### Fase 6 — Automatización y Recarga de Datos (Semana 11)

**Objetivo:** Programar recargas automáticas de datos.

**Actividades:**
- [ ] Configurar tareas de recarga en QlikView Publisher / QMC
- [ ] Definir frecuencias de recarga por aplicación
- [ ] Configurar alertas de fallo de recarga (email)
- [ ] Implementar recarga en cascada: primero QVDs, luego aplicaciones
- [ ] Probar recuperación ante fallos de fuentes de datos

**Frecuencias de Recarga:**

| Aplicación | Frecuencia | Horario |
|---|---|---|
| Ventas | Diaria | 06:00 AM |
| Finanzas | Diaria | 05:00 AM |
| Operaciones | Cada 4 horas | 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 |
| KPIs Ejecutivos | Diaria | 07:00 AM |

---

### Fase 7 — Pruebas y QA (Semanas 12–14)

**Objetivo:** Validar calidad de datos, rendimiento y usabilidad.

**Actividades:**
- [ ] Pruebas de integridad de datos (reconciliación con fuentes)
- [ ] Pruebas de rendimiento (tiempo de carga < 10 seg)
- [ ] Pruebas de concurrencia (usuarios simultáneos)
- [ ] Pruebas de seguridad (validar que cada rol solo ve lo autorizado)
- [ ] Pruebas de aceptación con usuarios clave (UAT)
- [ ] Corrección de defectos encontrados

**Criterios de Aceptación:**
- Diferencia datos QlikView vs fuente: ≤ 0.01%
- Tiempo de carga de dashboard: < 10 segundos
- Usuarios simultáneos soportados: ≥ 50
- Disponibilidad del servidor: ≥ 99.5%

---

### Fase 8 — Capacitación y Despliegue (Semanas 14–16)

**Objetivo:** Capacitar usuarios y hacer el go-live en producción.

**Actividades:**
- [ ] Capacitación a administradores QlikView (8 horas)
- [ ] Capacitación a usuarios avanzados / analistas (4 horas)
- [ ] Capacitación a usuarios finales (2 horas)
- [ ] Elaborar manuales de usuario por aplicación
- [ ] Plan de rollback documentado
- [ ] Go-live en producción con acompañamiento
- [ ] Período de hiperatención post-lanzamiento (2 semanas)

---

## 4. Cronograma Resumido

```
Semana:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
Fase 1:  ████████████
Fase 2:     ████████████
Fase 3:           █████████████████
Fase 4:                    █████████████████████
Fase 5:                             ████████████
Fase 6:                                   ████
Fase 7:                                      █████████████
Fase 8:                                               █████████
```

---

## 5. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Calidad de datos fuente deficiente | Alta | Alto | Auditoría de datos en Fase 1; reglas de limpieza en ETL |
| Cambios en requerimientos durante desarrollo | Media | Medio | Control de cambios formal; sprints cortos con demos |
| Rendimiento bajo con volúmenes grandes | Media | Alto | Uso de QVDs incrementales; optimización de modelo |
| Resistencia al cambio de usuarios | Media | Medio | Capacitación temprana; involucrar usuarios en UAT |
| Falta de disponibilidad de fuentes de datos | Baja | Alto | Manejo de errores en ETL; notificaciones automáticas |
| Licencias insuficientes | Baja | Alto | Validar licencias en Fase 2 antes de iniciar desarrollo |

---

## 6. Equipo Requerido

| Rol | Dedicación | Responsabilidad |
|---|---|---|
| Arquitecto QlikView | 100% | Diseño de modelo y arquitectura |
| Desarrollador QlikView (x2) | 100% | Scripts ETL y desarrollo de apps |
| Analista de Datos | 50% | Validación y reglas de negocio |
| Administrador de Infraestructura | 25% | Servidor y seguridad |
| Líder de Proyecto | 25% | Coordinación y seguimiento |
| Usuario Clave por Área | 20% | Validación y UAT |

---

## 7. Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Plataforma BI | QlikView 12.x / QlikSense (evaluar) |
| ETL Complementario | QlikView Load Script + Python/dbt (opcional) |
| Base de Datos Fuente | SQL Server / PostgreSQL / MySQL |
| Almacenamiento QVD | File System local / NAS / S3 |
| Autenticación | Active Directory / SAML 2.0 |
| Monitoreo | QlikView QMC + alertas vía email |
| Control de Versiones | Git (este repositorio) |

---

## 8. Definición de Hecho (Definition of Done)

Una funcionalidad se considera completada cuando:

1. Los datos concilian con la fuente (tolerancia ≤ 0.01%)
2. El dashboard carga en menos de 10 segundos
3. Los permisos de acceso están aplicados y validados
4. El código QlikView está en Git con mensaje descriptivo
5. Existe documentación de usuario
6. Aprobación de usuario clave (sign-off UAT)

---

## 9. Próximos Pasos Inmediatos

1. **Esta semana:** Agendar reunión de kick-off con stakeholders
2. **Esta semana:** Confirmar licencias de QlikView disponibles
3. **Semana 1:** Comenzar relevamiento de requerimientos por área
4. **Semana 2:** Inventario y análisis de fuentes de datos
5. **Semana 2:** Provisionar entorno de desarrollo QlikView

---

*Documento creado: 2026-09-01 | Versión: 1.0 | Estado: Borrador para revisión*
