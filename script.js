console.log("SCRIPT CARREGADO!");
function analisar() {

    console.log("Função analisar foi chamada!");

    let texto = document.getElementById("inputSintomas").value.toLowerCase().trim();
    console.log("Texto digitado antes da normalização:", texto);

    if (!texto) {
        mostrar("Digite algum sintoma antes.", "text-red-300");
        return;
    }

    // Normaliza acentos
    texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    console.log("Texto depois da normalização:", texto);

    // Mensagem padrão
    let resposta = "Os sintomas não correspondem a nenhum padrão simples do sistema.";

    // Regras modernizadas
    const regras = [
        {
            cond: texto.includes("febre") && 
                  (texto.includes("dor") || texto.includes("cabeca")),
            msg: "Pode sugerir um quadro infeccioso leve."
        },
        {
            cond: texto.includes("tosse") && texto.includes("catarro"),
            msg: "Pode indicar inflamação ou irritação respiratória."
        },
        {
            cond: texto.includes("nausea") || texto.includes("vomito"),
            msg: "Possível desconforto gastrointestinal."
        },
        {
            cond: texto.includes("falta de ar") || texto.includes("dor no peito"),
            msg: "Atenção: sintomas que merecem avaliação imediata."
        },
        {
            cond: texto.includes("tontura") || texto.includes("vertigem"),
            msg: "Pode estar relacionado a queda de pressão ou desequilíbrio momentâneo."
        },
        {
            cond: texto.includes("calafrio") || texto.includes("calafrios"),
            msg: "Calafrios podem acompanhar quadros febris."
        },
        {
            cond: texto.includes("diarreia"),
            msg: "Pode indicar irritação intestinal ou sensibilidade alimentar."
        }
    ];

    // Detecta a primeira regra que encaixa
    for (let r of regras) {
        if (r.cond) {
            resposta = r.msg;
            break;
        }
    }

    mostrar(`
        <h2 class="text-xl font-bold mb-2 text-indigo-300">Resultado</h2>
        <p class="text-gray-100"><strong>Sintomas:</strong> ${texto}</p>
        <p class="text-gray-100"><strong>Interpretação:</strong> ${resposta}</p>
        <p class="mt-3 text-yellow-300 text-sm">
            *Este sistema é apenas educativo e não substitui avaliação profissional.*
        </p>
    `);
}

function mostrar(html, cor = "text-gray-200") {
    const box = document.getElementById("resultado");
    box.classList.remove("hidden");
    box.innerHTML = `<div class="${cor}">${html}</div>`;
}
