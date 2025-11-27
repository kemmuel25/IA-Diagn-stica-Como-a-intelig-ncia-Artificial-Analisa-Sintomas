"""
IA Diagnóstica — Versão X
Servidor Flask simples com motor baseado em regras (educacional).
Aviso: Este código é apenas para fins educativos. Não fornece diagnóstico médico.
"""

from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

# -------------------------
# Banco de padrões (educativo)
# -------------------------
PATTERNS = [
    {
        "id": "p1",
        "name": "Infecção viral",
        "conditions": {"febre", "dor_de_cabeca", "cansaco"},
        "urgency": "Baixa",
        "explanation": "Combinação típica de infecções virais leves."
    },
    {
        "id": "p2",
        "name": "Infecção respiratória",
        "conditions": {"tosse", "febre", "catarro"},
        "urgency": "Média",
        "explanation": "Padrão compatível com infecção respiratória possível."
    },
    {
        "id": "p3",
        "name": "Gastroenterite",
        "conditions": {"dor_intensa", "vomito"},
        "urgency": "Média",
        "explanation": "Vômito acompanhado de dor intensa pode indicar gastroenterite."
    },
    {
        "id": "p4",
        "name": "Emergência (possível problema cardiopulmonar)",
        "conditions": {"falta_de_ar", "dor_no_peito"},
        "urgency": "Alta",
        "explanation": "Falta de ar com dor no peito é sinal de alerta — procurar emergência."
    }
]

# Lista de sintomas para exibição
SYMPTOMS = [
    ("febre", "Febre"),
    ("dor_de_cabeca", "Dor de cabeça"),
    ("cansaco", "Cansaço / Prostração"),
    ("tosse", "Tosse"),
    ("catarro", "Catarro / Secreção"),
    ("dor_intensa", "Dor intensa"),
    ("vomito", "Vômito"),
    ("falta_de_ar", "Falta de ar"),
    ("dor_no_peito", "Dor no peito"),
    ("nausea", "Náusea")
]

# -------------------------
# Motor de regras (educativo)
# -------------------------
def analyze_symptoms(selected_symptoms, duration_days=None, intensity=None, extra_text=""):
    """
    selected_symptoms: set of keys (e.g., {'febre','tosse'})
    Returns a dict com sugestões educativas, triagem e recomendações gerais.
    """
    results = []
    for p in PATTERNS:
        overlap = len(p["conditions"].intersection(selected_symptoms))
        score = overlap / max(1, len(p["conditions"]))
        if overlap > 0:
            results.append({"pattern": p, "overlap": overlap, "score": score})

    # ordenar por score (desc), depois overlap (desc)
    results.sort(key=lambda r: (r["score"], r["overlap"]), reverse=True)

    # mapear urgência para nível numérico
    urgency_map = {"Baixa": 1, "Média": 2, "Alta": 3}
    overall_level = 1
    for r in results:
        lvl = urgency_map.get(r["pattern"]["urgency"], 1)
        if lvl > overall_level:
            overall_level = lvl
    triage = {1: "Leve", 2: "Moderada", 3: "Alta"}[overall_level]

    # montar sugestões (top 2)
    suggestions = []
    for r in results[:2]:
        p = r["pattern"]
        suggestions.append({
            "name": p["name"],
            "confidence": f"{r['score']*100:.0f}%",
            "explanation": p["explanation"]
        })

    # recomendações gerais (educacionais)
    recommendations = [
        "Hidrate-se e descanse.",
        "Procure atendimento médico se os sintomas piorarem ou surgirem sinais de alerta.",
        "Este sistema não substitui avaliação médica profissional."
    ]

    # regra de segurança: falta de ar ou dor no peito -> alerta imediato
    if "falta_de_ar" in selected_symptoms or "dor_no_peito" in selected_symptoms:
        triage = "Alta"
        if "Procure emergência imediatamente." not in recommendations:
            recommendations.insert(0, "Sinais de alerta: procure emergência imediatamente.")

    return {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "selected_symptoms": sorted(list(selected_symptoms)),
        "matches": results,
        "suggestions": suggestions,
        "triage": triage,
        "recommendations": recommendations,
        "note": "Resultado educacional — não é um diagnóstico."
    }

# -------------------------
# Rotas Flask
# -------------------------
@app.route('/')
def index():
    return render_template("index.html", symptoms=SYMPTOMS)

@app.route('/analyze', methods=['POST'])
def analyze():
    selected = set(request.form.getlist("symptom"))
    # opcional: ler duration/intensity se quiser usar
    # duration = request.form.get('duration')
    # intensity = request.form.get('intensity')
    analysis = analyze_symptoms(selected)
    label_map = {k: v for k, v in SYMPTOMS}
    return render_template("result.html", data=analysis, labels=label_map)

@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    payload = request.get_json() or {}
    selected = set(payload.get("symptoms", []))
    return jsonify(analyze_symptoms(selected))

if __name__ == '__main__':
    app.run(debug=True)
