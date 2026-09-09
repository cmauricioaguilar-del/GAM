"""Punto de entrada del análisis salarial GAM."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.analisis import (
    cargar_datos,
    estadisticas_generales,
    analisis_por_departamento,
    analisis_por_nivel,
    analisis_equidad_genero,
    bandas_salariales,
    correlacion_experiencia_salario,
    top_salarios,
    distribucion_por_ubicacion,
)
from src.visualizaciones import (
    grafica_distribucion_salarios,
    grafica_salario_por_departamento,
    grafica_salario_por_nivel,
    grafica_equidad_genero,
    grafica_experiencia_vs_salario,
    grafica_bandas_salariales,
)
from src.reporte import generar_reporte


def main():
    ruta_datos = Path(__file__).parent / "data" / "salarios.csv"
    ruta_reporte = Path(__file__).parent / "output" / "reporte_salarial.html"

    print("📊 Cargando datos...")
    df = cargar_datos(str(ruta_datos))

    print("🔢 Calculando estadísticas...")
    stats = estadisticas_generales(df)
    dept = analisis_por_departamento(df)
    nivel = analisis_por_nivel(df)
    equidad = analisis_equidad_genero(df)
    bandas = bandas_salariales(df)
    corr = correlacion_experiencia_salario(df)
    top = top_salarios(df)
    ubicacion = distribucion_por_ubicacion(df)

    print("📈 Generando gráficas...")
    graficas = {
        "distribucion": grafica_distribucion_salarios(df),
        "departamento": grafica_salario_por_departamento(dept),
        "nivel": grafica_salario_por_nivel(nivel),
        "genero": grafica_equidad_genero(df),
        "experiencia": grafica_experiencia_vs_salario(df),
        "bandas": grafica_bandas_salariales(bandas),
    }

    print("📝 Generando reporte HTML...")
    ruta = generar_reporte(
        datos={
            "stats": type("Stats", (), stats)(),
            "dept": dept,
            "nivel": nivel,
            "equidad": equidad,
            "bandas": bandas,
            "corr": corr,
            "top": top,
            "ubicacion": ubicacion,
            "graficas": graficas,
        },
        ruta_salida=str(ruta_reporte),
    )

    print(f"\n✅ Reporte generado: {ruta}")
    print(f"   Empleados analizados: {stats['total_empleados']}")
    print(f"   Salario promedio:      ${stats['salario_promedio']:,.0f} MXN/mes")
    print(f"   Salario mediana:       ${stats['salario_mediana']:,.0f} MXN/mes")
    brecha = equidad.get("brecha_salarial_pct")
    if brecha is not None:
        print(f"   Brecha salarial:       {brecha}%")


if __name__ == "__main__":
    main()
