function analisar() {
    let texto = document.getElementById("inputSintomas").value.toLowerCase().trim();
    const box = document.getElementById("resultado");

    if (!texto) {
        box.classList.remove("hidden");
        box.innerHTML = `<p class="text-red-300">Você precisa digitar algum sintoma.</p>`;
        return;
    }

    // Normaliza acentos (ex: náusea → nausea)
    texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let resposta = "Os sintomas não correspondem a nenhum padrão simples do sistema.";

    // Regras expandidas e modernas
    const regras = [
        {
            cond: texto.includes("febre") && (texto.includes("dor") || texto.includes("cabeca")),
            msg: "Pode sugerir um quadro infeccioso leve."
        },
        {
            cond: texto.includes("tosse") && texto.includes("catarro"),
            msg: "Possível irritação ou inflamação das vias respiratórias."
        },
        {
            cond: texto.includes("nausea") || texto.includes("vomito"),
            msg: "Pode indicar desconforto gastrointestinal."
        },
        {
            cond: texto.includes("falta de ar") || texto.includes("dificuldade para respirar") || texto.includes("respirar"),
            msg: "Sinal que merece atenção imediata — procure atendimento."
        },
        {
            cond: texto.includes("diarreia"),
            msg: "Pode estar relacionado a irritação intestinal."
        },
        {
            cond: texto.includes("calafrio") || texto.includes("calafrios"),
            msg: "Pode acompanhar quadros febris."
        },
        {
            cond: texto.includes("tontura") || texto.includes("vertigem"),
            msg: "Pode indicar queda de pressão ou desequilíbrio momentâneo."
        }
    ];

    // Verifica regras
    for (let r of regras) {
        if (r.cond) {
            resposta = r.msg;
            break;
        }
    }

    // Exibe resultado
    box.classList.remove("hidden");
    box.innerHTML = `
        <h2 class="text-xl font-bold mb-2 text-indigo-300">Resultado</h2>

        <p class="mb-2 text-gray-200">
            <strong>Sintomas:</strong> ${texto}
        </p>

        <p class="text-gray-100">
            <strong>Interpretação:</strong> ${resposta}
        </p>

        <p class="mt-4 text-yellow-300 text-sm">
            *Este sistema é apenas educativo e não substitui avaliação profissional.*
        </p>
    `;
}
