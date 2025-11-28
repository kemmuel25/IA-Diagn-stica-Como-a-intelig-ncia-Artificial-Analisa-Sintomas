function analisar() {
    console.log("👉 Função analisar() foi chamada!");

    let txt = document.getElementById("inputSintomas");
    console.log("Elemento textarea encontrado?", txt);

    let texto = txt.value;
    console.log("Texto original digitado:", texto);

    if (!texto.trim()) {
        mostrar("⚠ Digite algum sintoma.", "text-red-300");
        return;
    }

    // Normalizar
    texto = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    console.log("Texto normalizado:", texto);

    let resposta = "Os sintomas não correspondem a nenhum padrão simples.";

    if (texto.includes("febre")) console.log("🎯 Detectou: FEBRE");
    if (texto.includes("dor")) console.log("🎯 Detectou: DOR");
    if (texto.includes("nausea")) console.log("🎯 Detectou: NAUSEA");
    if (texto.includes("vomito")) console.log("🎯 Detectou: VOMITO");

    const regras = [
        { cond: texto.includes("febre") && texto.includes("dor"), msg: "Quadro infeccioso leve." },
        { cond: texto.includes("tosse") && texto.includes("catarro"), msg: "Irritação respiratória." },
        { cond: texto.includes("nausea") || texto.includes("vomito"), msg: "Possível desconforto gastrointestinal." },
        { cond: texto.includes("falta de ar") || texto.includes("dor no peito"), msg: "Atenção imediata recomendada." }
    ];

    for (let r of regras) {
        if (r.cond) {
            resposta = r.msg;
            break;
        }
    }

    mostrar(`
        <strong>Sintomas:</strong> ${texto}<br>
        <strong>Interpretação:</strong> ${resposta}
    `);
}

function mostrar(html, cor = "text-gray-200") {
    const box = document.getElementById("resultado");
    box.classList.remove("hidden");
    box.innerHTML = `<div class="${cor}">${html}</div>`;
}
