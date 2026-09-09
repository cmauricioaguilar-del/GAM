"""Generación del reporte HTML de análisis salarial."""

from datetime import datetime
from pathlib import Path
from jinja2 import Environment, BaseLoader

TEMPLATE_HTML = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Análisis Salarial GAM</title>
<style>
  :root {
    --primary: #2563EB;
    --secondary: #10B981;
    --accent: #F59E0B;
    --danger: #EF4444;
    --bg: #F9FAFB;
    --card: #FFFFFF;
    --text: #111827;
    --text-muted: #6B7280;
    --border: #E5E7EB;
    --female: #EC4899;
    --male: #3B82F6;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); }
  header {
    background: linear-gradient(135deg, var(--primary), #1e40af);
    color: white; padding: 2rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  header h1 { font-size: 1.8rem; font-weight: 700; }
  header p { font-size: 0.9rem; opacity: 0.85; margin-top: 0.25rem; }
  .badge { background: rgba(255,255,255,0.2); padding: 0.35rem 0.9rem; border-radius: 999px; font-size: 0.8rem; }
  main { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
  section { margin-bottom: 3rem; }
  h2 { font-size: 1.3rem; font-weight: 700; color: var(--primary); border-left: 4px solid var(--primary);
       padding-left: 0.75rem; margin-bottom: 1.5rem; }
  h3 { font-size: 1rem; font-weight: 600; color: var(--text-muted); margin-bottom: 1rem; }

  /* KPI cards */
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
  .kpi-card {
    background: var(--card); border-radius: 12px; padding: 1.25rem 1.5rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07); border: 1px solid var(--border);
  }
  .kpi-card .label { font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .kpi-card .value { font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-top: 0.4rem; }
  .kpi-card .sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem; }

  /* Charts */
  .chart-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(520px, 1fr)); gap: 1.5rem; }
  .chart-card {
    background: var(--card); border-radius: 12px; padding: 1.5rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07); border: 1px solid var(--border);
  }
  .chart-card img { width: 100%; border-radius: 6px; }

  /* Tables */
  .table-card {
    background: var(--card); border-radius: 12px; padding: 1.5rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07); border: 1px solid var(--border);
    overflow-x: auto;
  }
  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  th { background: var(--bg); color: var(--text-muted); font-weight: 600; font-size: 0.78rem;
       text-transform: uppercase; letter-spacing: 0.04em; padding: 0.75rem 1rem; text-align: left;
       border-bottom: 2px solid var(--border); }
  td { padding: 0.7rem 1rem; border-bottom: 1px solid var(--border); color: var(--text); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg); }

  /* Equidad */
  .equidad-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .equidad-stat {
    background: var(--card); border-radius: 12px; padding: 1.5rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07); border: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 0.5rem;
  }
  .equidad-stat .big { font-size: 2.2rem; font-weight: 800; }
  .equidad-stat .desc { font-size: 0.85rem; color: var(--text-muted); }
  .brecha-positiva { color: var(--danger); }
  .brecha-nula { color: var(--secondary); }

  /* Alert */
  .alert {
    border-radius: 8px; padding: 0.9rem 1.2rem; font-size: 0.88rem;
    display: flex; align-items: flex-start; gap: 0.6rem; margin-top: 1rem;
  }
  .alert-warn { background: #FEF3C7; border: 1px solid #FDE68A; color: #92400E; }
  .alert-ok { background: #D1FAE5; border: 1px solid #6EE7B7; color: #065F46; }

  footer { text-align: center; padding: 2rem; font-size: 0.8rem; color: var(--text-muted);
           border-top: 1px solid var(--border); margin-top: 2rem; }

  @media (max-width: 720px) {
    .chart-grid { grid-template-columns: 1fr; }
    .equidad-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<header>
  <div>
    <h1>Análisis Salarial GAM</h1>
    <p>Reporte ejecutivo de compensaciones y equidad</p>
  </div>
  <span class="badge">Generado: {{ fecha }}</span>
</header>

<main>

  <!-- KPIs -->
  <section>
    <h2>Resumen General</h2>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="label">Total Empleados</div>
        <div class="value">{{ stats.total_empleados }}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Salario Promedio</div>
        <div class="value">${{ "{:,.0f}".format(stats.salario_promedio) }}</div>
        <div class="sub">Mensual (MXN)</div>
      </div>
      <div class="kpi-card">
        <div class="label">Salario Mediana</div>
        <div class="value">${{ "{:,.0f}".format(stats.salario_mediana) }}</div>
        <div class="sub">Mensual (MXN)</div>
      </div>
      <div class="kpi-card">
        <div class="label">Salario Mínimo</div>
        <div class="value">${{ "{:,.0f}".format(stats.salario_min) }}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Salario Máximo</div>
        <div class="value">${{ "{:,.0f}".format(stats.salario_max) }}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Desv. Estándar</div>
        <div class="value">${{ "{:,.0f}".format(stats.desviacion_estandar) }}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Percentil 25</div>
        <div class="value">${{ "{:,.0f}".format(stats.percentil_25) }}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Percentil 75</div>
        <div class="value">${{ "{:,.0f}".format(stats.percentil_75) }}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Percentil 90</div>
        <div class="value">${{ "{:,.0f}".format(stats.percentil_90) }}</div>
      </div>
    </div>
  </section>

  <!-- Distribución -->
  <section>
    <h2>Distribución Salarial</h2>
    <div class="chart-grid">
      <div class="chart-card">
        <img src="data:image/png;base64,{{ graficas.distribucion }}" alt="Distribución de Salarios">
      </div>
      <div class="chart-card">
        <img src="data:image/png;base64,{{ graficas.experiencia }}" alt="Experiencia vs Salario">
      </div>
    </div>
  </section>

  <!-- Por Departamento y Nivel -->
  <section>
    <h2>Análisis por Departamento y Nivel</h2>
    <div class="chart-grid">
      <div class="chart-card">
        <img src="data:image/png;base64,{{ graficas.departamento }}" alt="Por Departamento">
      </div>
      <div class="chart-card">
        <img src="data:image/png;base64,{{ graficas.nivel }}" alt="Por Nivel">
      </div>
    </div>

    <div style="margin-top:1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
      <div class="table-card">
        <h3>Salarios por Departamento</h3>
        <table>
          <thead><tr>
            <th>Departamento</th><th>Empleados</th><th>Promedio</th><th>Mediana</th>
          </tr></thead>
          <tbody>
          {% for _, r in dept.iterrows() %}
          <tr>
            <td>{{ r.departamento }}</td>
            <td>{{ r.empleados | int }}</td>
            <td>${{ "{:,.0f}".format(r.promedio) }}</td>
            <td>${{ "{:,.0f}".format(r.mediana) }}</td>
          </tr>
          {% endfor %}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>Salarios por Nivel</h3>
        <table>
          <thead><tr>
            <th>Nivel</th><th>Empleados</th><th>Promedio</th><th>Mediana</th>
          </tr></thead>
          <tbody>
          {% for _, r in nivel.iterrows() %}
          <tr>
            <td>{{ r.nivel }}</td>
            <td>{{ r.empleados | int }}</td>
            <td>${{ "{:,.0f}".format(r.promedio) }}</td>
            <td>${{ "{:,.0f}".format(r.mediana) }}</td>
          </tr>
          {% endfor %}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Bandas Salariales -->
  <section>
    <h2>Bandas Salariales</h2>
    <div class="chart-grid">
      <div class="chart-card">
        <img src="data:image/png;base64,{{ graficas.bandas }}" alt="Bandas Salariales">
      </div>
      <div class="table-card" style="align-self:start;">
        <h3>Rangos P25-P75 por Nivel</h3>
        <table>
          <thead><tr>
            <th>Nivel</th><th>Mínimo (P25)</th><th>Punto Medio</th><th>Máximo (P75)</th>
          </tr></thead>
          <tbody>
          {% for _, r in bandas.iterrows() %}
          <tr>
            <td>{{ r.nivel }}</td>
            <td>${{ "{:,.0f}".format(r.banda_minima) }}</td>
            <td>${{ "{:,.0f}".format(r.punto_medio) }}</td>
            <td>${{ "{:,.0f}".format(r.banda_maxima) }}</td>
          </tr>
          {% endfor %}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Equidad de Género -->
  <section>
    <h2>Equidad de Género</h2>
    <div class="equidad-grid">
      <div class="equidad-stat">
        <div class="label" style="font-size:0.78rem; color:var(--text-muted); text-transform:uppercase;">Brecha Salarial de Género</div>
        <div class="big {{ 'brecha-positiva' if equidad.brecha_salarial_pct > 0 else 'brecha-nula' }}">
          {{ equidad.brecha_salarial_pct }}%
        </div>
        <div class="desc">
          Diferencia porcentual del salario promedio masculino vs femenino.
          {% if equidad.brecha_salarial_pct > 0 %}
          Las mujeres ganan en promedio {{ equidad.brecha_salarial_pct }}% menos que los hombres.
          {% else %}
          No se detecta brecha negativa para mujeres.
          {% endif %}
        </div>
        <div class="alert {{ 'alert-warn' if equidad.diferencia_significativa else 'alert-ok' }}" style="margin-top:0.5rem;">
          <span>{{ '⚠️' if equidad.diferencia_significativa else '✅' }}</span>
          <span>
            {% if equidad.diferencia_significativa %}
            La diferencia es <strong>estadísticamente significativa</strong> (p={{ equidad.p_valor_significancia }}).
            Se recomienda revisar las políticas de compensación.
            {% else %}
            La diferencia <strong>no es estadísticamente significativa</strong> (p={{ equidad.p_valor_significancia }}).
            {% endif %}
          </span>
        </div>
      </div>

      <div class="equidad-stat">
        <div class="label" style="font-size:0.78rem; color:var(--text-muted); text-transform:uppercase;">Correlación Experiencia-Salario</div>
        <div class="big" style="color:var(--primary);">r = {{ corr.correlacion }}</div>
        <div class="desc">{{ corr.interpretacion }} (p={{ corr.p_valor }})</div>
        <div class="alert alert-ok" style="margin-top:0.5rem;">
          <span>📈</span>
          <span>
            {% if corr.significativa %}
            La experiencia tiene una relación <strong>significativa</strong> con el salario.
            {% else %}
            La experiencia no explica significativamente la variación salarial.
            {% endif %}
          </span>
        </div>
      </div>
    </div>
    <div style="margin-top:1.5rem;" class="chart-card">
      <img src="data:image/png;base64,{{ graficas.genero }}" alt="Equidad de Género">
    </div>
  </section>

  <!-- Top Salarios -->
  <section>
    <h2>Top 10 Salarios</h2>
    <div class="table-card">
      <table>
        <thead><tr>
          <th>#</th><th>Nombre</th><th>Puesto</th><th>Departamento</th><th>Nivel</th><th>Salario</th>
        </tr></thead>
        <tbody>
        {% for _, r in top.iterrows() %}
        <tr>
          <td style="color:var(--text-muted);">{{ loop.index }}</td>
          <td>{{ r.nombre }}</td>
          <td>{{ r.puesto }}</td>
          <td>{{ r.departamento }}</td>
          <td>{{ r.nivel }}</td>
          <td><strong style="color:var(--primary);">${{ "{:,.0f}".format(r.salario_mensual) }}</strong></td>
        </tr>
        {% endfor %}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Ubicación -->
  <section>
    <h2>Análisis por Ubicación</h2>
    <div class="table-card" style="max-width:500px;">
      <table>
        <thead><tr>
          <th>Ciudad</th><th>Empleados</th><th>Promedio</th><th>Mediana</th>
        </tr></thead>
        <tbody>
        {% for _, r in ubicacion.iterrows() %}
        <tr>
          <td>{{ r.ubicacion }}</td>
          <td>{{ r.empleados | int }}</td>
          <td>${{ "{:,.0f}".format(r.promedio) }}</td>
          <td>${{ "{:,.0f}".format(r.mediana) }}</td>
        </tr>
        {% endfor %}
        </tbody>
      </table>
    </div>
  </section>

</main>

<footer>
  Análisis Salarial GAM &nbsp;·&nbsp; Generado el {{ fecha }} &nbsp;·&nbsp; Datos confidenciales
</footer>
</body>
</html>
"""


def generar_reporte(datos: dict, ruta_salida: str = "output/reporte_salarial.html") -> str:
    env = Environment(loader=BaseLoader())
    template = env.from_string(TEMPLATE_HTML)
    html = template.render(**datos, fecha=datetime.now().strftime("%d/%m/%Y %H:%M"))
    Path(ruta_salida).parent.mkdir(parents=True, exist_ok=True)
    Path(ruta_salida).write_text(html, encoding="utf-8")
    return ruta_salida
