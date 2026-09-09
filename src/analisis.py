"""Módulo de análisis salarial."""

import pandas as pd
import numpy as np
from scipy import stats


def cargar_datos(ruta: str) -> pd.DataFrame:
    df = pd.read_csv(ruta, parse_dates=["fecha_ingreso"])
    df["antiguedad_anos"] = (pd.Timestamp("today") - df["fecha_ingreso"]).dt.days / 365
    return df


def estadisticas_generales(df: pd.DataFrame) -> dict:
    sal = df["salario_mensual"]
    return {
        "total_empleados": len(df),
        "salario_promedio": round(sal.mean(), 2),
        "salario_mediana": round(sal.median(), 2),
        "salario_min": sal.min(),
        "salario_max": sal.max(),
        "desviacion_estandar": round(sal.std(), 2),
        "percentil_25": round(sal.quantile(0.25), 2),
        "percentil_75": round(sal.quantile(0.75), 2),
        "percentil_90": round(sal.quantile(0.90), 2),
    }


def analisis_por_departamento(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.groupby("departamento")["salario_mensual"]
        .agg(
            empleados="count",
            promedio="mean",
            mediana="median",
            minimo="min",
            maximo="max",
        )
        .round(2)
        .reset_index()
        .sort_values("promedio", ascending=False)
    )


def analisis_por_nivel(df: pd.DataFrame) -> pd.DataFrame:
    orden = ["Junior", "Semi-Senior", "Senior", "Gerente", "Director"]
    resultado = (
        df.groupby("nivel")["salario_mensual"]
        .agg(
            empleados="count",
            promedio="mean",
            mediana="median",
            minimo="min",
            maximo="max",
        )
        .round(2)
        .reset_index()
    )
    resultado["nivel"] = pd.Categorical(resultado["nivel"], categories=orden, ordered=True)
    return resultado.sort_values("nivel").reset_index(drop=True)


def analisis_equidad_genero(df: pd.DataFrame) -> dict:
    por_genero = df.groupby("genero")["salario_mensual"].agg(
        empleados="count", promedio="mean", mediana="median"
    ).round(2)

    femenino = por_genero.loc["F"] if "F" in por_genero.index else None
    masculino = por_genero.loc["M"] if "M" in por_genero.index else None

    brecha = None
    if femenino is not None and masculino is not None:
        brecha = round((masculino["promedio"] - femenino["promedio"]) / masculino["promedio"] * 100, 2)

    # Test estadístico
    sal_f = df[df["genero"] == "F"]["salario_mensual"]
    sal_m = df[df["genero"] == "M"]["salario_mensual"]
    _, p_valor = stats.mannwhitneyu(sal_f, sal_m, alternative="two-sided")

    return {
        "por_genero": por_genero.to_dict(),
        "brecha_salarial_pct": brecha,
        "p_valor_significancia": round(p_valor, 4),
        "diferencia_significativa": p_valor < 0.05,
    }


def bandas_salariales(df: pd.DataFrame) -> pd.DataFrame:
    result = []
    for nivel, grupo in df.groupby("nivel"):
        p25 = grupo["salario_mensual"].quantile(0.25)
        p75 = grupo["salario_mensual"].quantile(0.75)
        mediana = grupo["salario_mensual"].median()
        result.append({
            "nivel": nivel,
            "banda_minima": round(p25, 0),
            "punto_medio": round(mediana, 0),
            "banda_maxima": round(p75, 0),
            "rango": round(p75 - p25, 0),
        })
    orden = ["Junior", "Semi-Senior", "Senior", "Gerente", "Director"]
    df_bandas = pd.DataFrame(result)
    df_bandas["nivel"] = pd.Categorical(df_bandas["nivel"], categories=orden, ordered=True)
    return df_bandas.sort_values("nivel").reset_index(drop=True)


def correlacion_experiencia_salario(df: pd.DataFrame) -> dict:
    r, p = stats.pearsonr(df["experiencia_anos"], df["salario_mensual"])
    return {
        "correlacion": round(r, 4),
        "p_valor": round(p, 4),
        "significativa": p < 0.05,
        "interpretacion": _interpretar_correlacion(r),
    }


def _interpretar_correlacion(r: float) -> str:
    abs_r = abs(r)
    if abs_r >= 0.7:
        return "Correlación fuerte"
    elif abs_r >= 0.4:
        return "Correlación moderada"
    return "Correlación débil"


def top_salarios(df: pd.DataFrame, n: int = 10) -> pd.DataFrame:
    cols = ["nombre", "puesto", "departamento", "nivel", "salario_mensual"]
    return df[cols].sort_values("salario_mensual", ascending=False).head(n).reset_index(drop=True)


def distribucion_por_ubicacion(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.groupby("ubicacion")["salario_mensual"]
        .agg(empleados="count", promedio="mean", mediana="median")
        .round(2)
        .reset_index()
        .sort_values("promedio", ascending=False)
    )
