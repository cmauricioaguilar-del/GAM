"""Generación de gráficas para el análisis salarial."""

import io
import base64
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
import pandas as pd
import numpy as np

PALETTE = {
    "primary": "#2563EB",
    "secondary": "#10B981",
    "accent": "#F59E0B",
    "danger": "#EF4444",
    "neutral": "#6B7280",
    "female": "#EC4899",
    "male": "#3B82F6",
    "bg": "#F9FAFB",
}

sns.set_theme(style="whitegrid", font="DejaVu Sans")


def _fig_to_b64(fig) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=130, bbox_inches="tight", facecolor=PALETTE["bg"])
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)
    return encoded


def _fmt_mxn(x, _):
    return f"${x:,.0f}"


def grafica_distribucion_salarios(df: pd.DataFrame) -> str:
    fig, ax = plt.subplots(figsize=(9, 4.5), facecolor=PALETTE["bg"])
    ax.set_facecolor(PALETTE["bg"])
    ax.hist(df["salario_mensual"], bins=15, color=PALETTE["primary"], edgecolor="white", alpha=0.85)
    med = df["salario_mensual"].median()
    prom = df["salario_mensual"].mean()
    ax.axvline(med, color=PALETTE["secondary"], linewidth=2, linestyle="--", label=f"Mediana: ${med:,.0f}")
    ax.axvline(prom, color=PALETTE["accent"], linewidth=2, linestyle="--", label=f"Promedio: ${prom:,.0f}")
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(_fmt_mxn))
    ax.set_title("Distribución de Salarios Mensuales", fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Salario Mensual (MXN)", fontsize=11)
    ax.set_ylabel("Número de Empleados", fontsize=11)
    ax.legend(fontsize=10)
    fig.tight_layout()
    return _fig_to_b64(fig)


def grafica_salario_por_departamento(df_dept: pd.DataFrame) -> str:
    fig, ax = plt.subplots(figsize=(9, 4.5), facecolor=PALETTE["bg"])
    ax.set_facecolor(PALETTE["bg"])
    colors = sns.color_palette("Blues_d", len(df_dept))
    bars = ax.barh(df_dept["departamento"], df_dept["promedio"], color=colors, edgecolor="white")
    for bar, val in zip(bars, df_dept["promedio"]):
        ax.text(val + 500, bar.get_y() + bar.get_height() / 2,
                f"${val:,.0f}", va="center", fontsize=10)
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(_fmt_mxn))
    ax.set_title("Salario Promedio por Departamento", fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Salario Promedio Mensual (MXN)", fontsize=11)
    fig.tight_layout()
    return _fig_to_b64(fig)


def grafica_salario_por_nivel(df_nivel: pd.DataFrame) -> str:
    fig, ax = plt.subplots(figsize=(9, 4.5), facecolor=PALETTE["bg"])
    ax.set_facecolor(PALETTE["bg"])
    colors = sns.color_palette("viridis", len(df_nivel))
    bars = ax.bar(df_nivel["nivel"], df_nivel["promedio"], color=colors, edgecolor="white", width=0.6)
    for bar, val in zip(bars, df_nivel["promedio"]):
        ax.text(bar.get_x() + bar.get_width() / 2, val + 500,
                f"${val:,.0f}", ha="center", va="bottom", fontsize=9, fontweight="bold")
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(_fmt_mxn))
    ax.set_title("Salario Promedio por Nivel", fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Nivel", fontsize=11)
    ax.set_ylabel("Salario Promedio Mensual (MXN)", fontsize=11)
    fig.tight_layout()
    return _fig_to_b64(fig)


def grafica_equidad_genero(df: pd.DataFrame) -> str:
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.5), facecolor=PALETTE["bg"])
    for ax in axes:
        ax.set_facecolor(PALETTE["bg"])

    # Boxplot por género y nivel
    orden = ["Junior", "Semi-Senior", "Senior", "Gerente", "Director"]
    df_plot = df[df["nivel"].isin(orden)].copy()
    df_plot["nivel"] = pd.Categorical(df_plot["nivel"], categories=orden, ordered=True)
    sns.boxplot(data=df_plot, x="nivel", y="salario_mensual", hue="genero",
                palette={"F": PALETTE["female"], "M": PALETTE["male"]},
                ax=axes[0], order=orden)
    axes[0].yaxis.set_major_formatter(mticker.FuncFormatter(_fmt_mxn))
    axes[0].set_title("Salario por Nivel y Género", fontsize=12, fontweight="bold")
    axes[0].set_xlabel("Nivel")
    axes[0].set_ylabel("Salario (MXN)")
    handles, labels = axes[0].get_legend_handles_labels()
    axes[0].legend(handles, ["Femenino", "Masculino"], title="Género")

    # Promedio por género
    prom_genero = df.groupby("genero")["salario_mensual"].mean()
    labels_g = ["Femenino (F)", "Masculino (M)"]
    valores = [prom_genero.get("F", 0), prom_genero.get("M", 0)]
    colors_g = [PALETTE["female"], PALETTE["male"]]
    bars = axes[1].bar(labels_g, valores, color=colors_g, edgecolor="white", width=0.5)
    for bar, val in zip(bars, valores):
        axes[1].text(bar.get_x() + bar.get_width() / 2, val + 300,
                     f"${val:,.0f}", ha="center", fontsize=11, fontweight="bold")
    axes[1].yaxis.set_major_formatter(mticker.FuncFormatter(_fmt_mxn))
    axes[1].set_title("Salario Promedio por Género", fontsize=12, fontweight="bold")
    axes[1].set_ylabel("Salario Promedio Mensual (MXN)")

    fig.tight_layout()
    return _fig_to_b64(fig)


def grafica_experiencia_vs_salario(df: pd.DataFrame) -> str:
    fig, ax = plt.subplots(figsize=(9, 4.5), facecolor=PALETTE["bg"])
    ax.set_facecolor(PALETTE["bg"])
    orden_niveles = ["Junior", "Semi-Senior", "Senior", "Gerente", "Director"]
    palette_niveles = dict(zip(orden_niveles, sns.color_palette("viridis", 5)))
    for nivel, grupo in df.groupby("nivel"):
        color = palette_niveles.get(nivel, PALETTE["neutral"])
        ax.scatter(grupo["experiencia_anos"], grupo["salario_mensual"],
                   label=nivel, color=color, s=70, alpha=0.8, edgecolors="white", linewidth=0.5)
    # Línea de tendencia
    m, b = np.polyfit(df["experiencia_anos"], df["salario_mensual"], 1)
    x_line = np.linspace(df["experiencia_anos"].min(), df["experiencia_anos"].max(), 100)
    ax.plot(x_line, m * x_line + b, color=PALETTE["danger"], linewidth=2, linestyle="--", label="Tendencia")
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(_fmt_mxn))
    ax.set_title("Experiencia vs Salario", fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Años de Experiencia", fontsize=11)
    ax.set_ylabel("Salario Mensual (MXN)", fontsize=11)
    ax.legend(fontsize=9, title="Nivel", title_fontsize=10)
    fig.tight_layout()
    return _fig_to_b64(fig)


def grafica_bandas_salariales(df_bandas: pd.DataFrame) -> str:
    fig, ax = plt.subplots(figsize=(9, 4.5), facecolor=PALETTE["bg"])
    ax.set_facecolor(PALETTE["bg"])
    y = range(len(df_bandas))
    for i, row in df_bandas.iterrows():
        ax.barh(i, row["rango"], left=row["banda_minima"],
                color=PALETTE["primary"], alpha=0.3, edgecolor="white", height=0.5)
        ax.scatter(row["punto_medio"], i, color=PALETTE["primary"], s=80, zorder=5)
        ax.text(row["banda_minima"] - 500, i, f"${row['banda_minima']:,.0f}",
                va="center", ha="right", fontsize=9)
        ax.text(row["banda_maxima"] + 500, i, f"${row['banda_maxima']:,.0f}",
                va="center", ha="left", fontsize=9)
    ax.set_yticks(list(y))
    ax.set_yticklabels(df_bandas["nivel"])
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(_fmt_mxn))
    ax.set_title("Bandas Salariales por Nivel (P25-P75)", fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Salario Mensual (MXN)", fontsize=11)
    fig.tight_layout()
    return _fig_to_b64(fig)
