/* --- 1. O CONTEÚDO DA SIMULAÇÃO --- */
// Extraímos os módulos do PDF e transformámo-los num "Array" de "Objetos".
// Cada objeto representa um passo na nossa simulação.

const etapasSimulacao = [
    {
        etapa: 0,
        titulo: "PASSO 0: A CÉLULA NORMAL",
        icone: "fa-solid fa-shield-heart",
        subtitulo: "O Cidadão Obediente",
        [cite_start]descricao: "Uma célula normal só se divide quando recebe um sinal externo ('fator de crescimento') e para quando recebe um sinal de parada. Ela é uma cidadã obediente.", // [cite: 85]
        caracteristicas: [
            [cite_start]"Mecanismos de controle (freios) funcionam.", // [cite: 85]
            [cite_start]"Reparo de DNA (Zeladores) está ativo.", // [cite: 141]
            "Apoptose (suicídio celular) é ativada se o dano for irreparável." [cite_start]// [cite: 134, 135]
        ]
    },
    {
        etapa: 1,
        titulo: "PASSO 1: O ACELERADOR PRESO",
        icone: "fa-solid fa-rocket",
        subtitulo: "Autossuficiência (Oncogenes)",
        [cite_start]descricao: "O primeiro 'hit' (mutação). A célula agora comporta-se como se estivesse *sempre* a receber sinais para se dividir, mesmo sem eles. Este é o 'acelerador preso'.", // [cite: 89]
        caracteristicas: [
            [cite_start]"Ativação de **Proto-Oncogenes** (aceleradores normais) para **Oncogenes** (hiperativos).", // [cite: 91, 92]
            [cite_start]"Isto é uma mutação de **Ganho de Função**: basta 1 alelo mutado (é dominante).", // [cite: 93, 94]
            "Exemplos: Mutação pontual (BRAF), Amplificação (HER2), Translocação (BCR-ABL)." [cite_start]// [cite: 97, 102, 107]
        ]
    },
    {
        etapa: 2,
        titulo: "PASSO 2: O FREIO QUEBRADO",
        icone: "fa-solid fa-brake",
        subtitulo: "Insensibilidade aos Sinais de Parada",
        [cite_start]descricao: "A célula agora ignora todos os sinais internos ou externos que mandam parar a divisão. Os 'freios' (Genes Supressores de Tumor) estão quebrados.", // [cite: 114]
        caracteristicas: [
            [cite_start]"Mutação de **Perda de Função**: ambos os alelos devem ser inativados (é recessivo).", // [cite: 117, 118]
            [cite_start]"**RB (O Porteiro)**: Perder o RB deixa o 'portão' G1/S cronicamente aberto, forçando a divisão.", // [cite: 122, 124]
            "**TP53 (O Guardião)**: Perder o p53 torna a célula 'cega' ao dano no DNA. Ela não para, não conserta e não morre." [cite_start]// [cite: 136, 137]
        ]
    },
    {
        etapa: 3,
        titulo: "PASSO 3: A IMORTALIDADE",
        icone: "fa-solid fa-infinity",
        subtitulo: "Potencial Replicativo Ilimitado",
        [cite_start]descricao: "Células normais têm um 'relógio' (Telômeros) que encurta a cada divisão, levando à velhice (senescência). A célula maligna precisa parar este relógio.", // [cite: 162, 167]
        caracteristicas: [
            [cite_start]"A célula reativa a enzima **Telomerase**.", // [cite: 173]
            [cite_start]"A Telomerase reconstrói os telômeros nas pontas dos cromossomas.", // [cite: 175]
            "A célula 'rouba' o segredo da imortalidade das células germinativas e pode agora dividir-se infinitamente." [cite_start]// [cite: 177]
        ]
    },
    {
        etapa: 4,
        titulo: "PASSO 4: A LOGÍSTICA",
        icone: "fa-solid fa-truck-fast",
        subtitulo: "Angiogénese Sustentada",
        [cite_start]descricao: "Um tumor não pode crescer além de 1-2mm sem o seu próprio suprimento de sangue. Ele precisa de 'convencer' o corpo a construir-lhe uma rede de vasos.", // [cite: 182, 183]
        caracteristicas: [
            [cite_start]"O tumor ativa o 'Interruptor Angiogénico'.", // [cite: 184]
            [cite_start]"Liberta fatores pró-angiogénicos, como o **VEGF**.", // [cite: 187]
            "Os novos vasos são tortuosos e permeáveis, servindo como 'autoestrada' para a metástase." [cite_start]// [cite: 193, 195]
        ]
    },
    {
        etapa: 5,
        titulo: "PASSO 5: IGNORAR O SUICÍDIO",
        icone: "fa-solid fa-ghost",
        subtitulo: "Evasão da Apoptose",
        [cite_start]descricao: "Mesmo com mutações e sinais para se dividir, a célula deveria ativar o suicídio programado (Apoptose). A célula maligna precisa de desativar esta última rede de segurança.", // [cite: 201]
        caracteristicas: [
            [cite_start]"A célula pode **mutar o p53** (o principal 'sensor' que ativa a apoptose).", // [cite: 215, 217]
            [cite_start]"A célula pode **superexpressar BCL-2** (o 'protetor' da mitocôndria), que impede fisicamente o gatilho da morte.", // [cite: 219, 220]
            "Isto confere resistência direta à quimioterapia e radioterapia (que funcionam causando dano para induzir apoptose)." [cite_start]// [cite: 140, 218]
        ]
    },
    {
        etapa: 6,
        titulo: "PASSO 6: A FUGA",
        icone: "fa-solid fa-person-running",
        subtitulo: "Invasão e Transição (EMT)",
        [cite_start]descricao: "A célula está pronta para sair do tumor primário. Ela precisa de se soltar das suas vizinhas e tornar-se móvel, transformando-se de uma célula epitelial (estática) para mesenquimal (móvel).", // [cite: 251, 261]
        caracteristicas: [
            [cite_start]"**Perda da E-caderina**: A 'cola' que une as células é desativada. As células soltam-se.", // [cite: 253, 257]
            [cite_start]"**EMT (Transição Epitélio-Mesenquimal)**: Um programa genético é ativado, mudando a forma da célula para uma forma móvel.", // [cite: 259, 261]
            "**MMPs (Metaloproteinases)**: A célula secreta enzimas que 'cavam' um túnel através da matriz para alcançar um vaso sanguíneo." [cite_start]// [cite: 266, 267]
        ]
    },
    {
        etapa: 7,
        titulo: "PASSO 7: O MANTO DA INVISIBILIDADE",
        icone: "fa-solid fa-shield-halved",
        subtitulo: "Evasão do Sistema Imune",
        [cite_start]descricao: "O nosso sistema imune (Linfócitos T) é desenhado para encontrar e matar células com mutações (neoantígenos). A célula maligna precisa de se esconder.", // [cite: 325, 327]
        caracteristicas: [
            [cite_start]"**Estratégia PD-L1**: A célula tumoral aprende a expressar **PD-L1** na sua superfície.", // [cite: 351]
            [cite_start]"O Linfócito T (que tem **PD-1**) liga-se ao PD-L1 do tumor.", // [cite: 352]
            "Esta ligação funciona como um 'freio' que 'desliga' o Linfócito T no exato momento do ataque. O atacante é neutralizado." [cite_start]// [cite: 353]
        ]
    },
    {
        etapa: 8,
        titulo: "PASSO 8: A TRANSFORMAÇÃO MALIGNA",
        icone: "fa-solid fa-skull-crossbones",
        subtitulo: "Metástase e Colonização",
        [cite_start]descricao: "A célula escapou, tornou-se invisível e agora viaja pela 'autoestrada' (vasos sanguíneos) para formar novos tumores em órgãos distantes.", // [cite: 234]
        caracteristicas: [
            [cite_start]"**Intravasamento**: A célula entra no vaso sanguíneo.", // [cite: 241]
            [cite_start]"**Sobrevivência**: Sobrevive ao stress da corrente sanguínea (muitas morrem aqui).", // [cite: 242, 243]
            "**Extravasamento e Colonização**: A célula 'ancora' num novo órgão (ex: pulmão, fígado) e 'germina', provando a Teoria da 'Semente e Solo'." [cite_start]// [cite: 245, 249, 277]
        ]
    }
];

/* --- 2. SELETORES DOS ELEMENTOS (DOM) --- */
// Vamos "guardar" os elementos HTML que precisamos de controlar
const etapaView = document.getElementById('etapa-view');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');

// Variável para guardar o estado atual da simulação
let etapaAtual = 0;

/* --- 3. A FUNÇÃO DE RENDERIZAÇÃO --- */
// Esta função "desenha" a etapa no HTML
function renderizarEtapa(etapaIndex) {
    const etapa = etapasSimulacao[etapaIndex];

    // Construir o HTML interno para a nossa 'etapa-view'
    // Usamos 'Template Literals' (acentos graves ``) para construir o bloco de HTML
    etapaView.innerHTML = `
        <span class="etapa-titulo">${etapa.titulo}</span>
        <h2><i class="${etapa.icone}"></i> ${etapa.subtitulo}</h2>
        <p>${etapa.descricao}</p>
        <ul class="lista-caracteristicas">
            ${etapa.caracteristicas.map(item => `<li><i class="fa-solid fa-atom fa-spin"></i> ${item}</li>`).join('')}
        </ul>
    `;
    
    // Disparar a animação de fade-in
    etapaView.classList.add('fade-enter');
    // Remover a classe após a animação para que possa ser re-adicionada no próximo clique
    setTimeout(() => {
        etapaView.classList.remove('fade-enter');
    }, 500); // 500ms (tempo da animação)

    // Atualizar o estado dos botões
    atualizarBotoes();
}

/* --- 4. FUNÇÃO PARA ATUALIZAR BOTÕES --- */
function atualizarBotoes() {
    // Se estiver na primeira etapa (0), desativa o botão "Anterior"
    btnAnterior.disabled = (etapaAtual === 0);
    
    // Se estiver na última etapa, desativa o botão "Próximo"
    btnProximo.disabled = (etapaAtual === etapasSimulacao.length - 1);
}

/* --- 5. "OUVINTES" DE EVENTOS (EVENT LISTENERS) --- */

// O que fazer quando o botão "Próximo" é clicado
btnProximo.addEventListener('click', () => {
    if (etapaAtual < etapasSimulacao.length - 1) {
        etapaAtual++; // Avança a etapa
        renderizarEtapa(etapaAtual);
    }
});

// O que fazer quando o botão "Anterior" é clicado
btnAnterior.addEventListener('click', () => {
    if (etapaAtual > 0) {
        etapaAtual--; // Recua a etapa
        renderizarEtapa(etapaAtual);
    }
});

/* --- 6. INICIALIZAÇÃO --- */
// Quando a página carrega, "desenha" a primeira etapa (etapa 0)
renderizarEtapa(etapaAtual);
