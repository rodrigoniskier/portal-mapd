// Espera o HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Referências aos Elementos HTML ---
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const reportButton = document.getElementById('report-button');

    // --- 2. Histórico de Decisões do Utilizador ---
    // Guarda cada passo dado pelo utilizador para o relatório final
    let userPath = [];
    // Guarda o ID do nó final para referência no relatório
    let finalNodeId = '';

    // --- 3. A ÁRVORE DE DECISÕES ---
    // O coração do simulador, com dados do biocancer.pdf
    const decisionTree = {
        'start': {
            question: "Bem-vindo. Qual tipo de câncer será o foco da sua pesquisa? (Escolha um dos mais comuns)",
            options: [
                { text: "Câncer de Pulmão", nextNode: 'immunotherapy_type', result: "Foco: Câncer de Pulmão. [cite: 274]" },
                { text: "Câncer de Mama", nextNode: 'immunotherapy_type', result: "Foco: Câncer de Mama. [cite: 273]" },
                { text: "Câncer Colorretal", nextNode: 'immunotherapy_type', result: "Foco: Câncer Colorretal. [cite: 271]" },
                { text: "Melanoma", nextNode: 'immunotherapy_type', result: "Foco: Melanoma. (Ex: Alvo BRAF) [cite: 98]" },
                { text: "Câncer de Pâncreas", nextNode: 'immunotherapy_type', result: "Foco: Câncer de Pâncreas. (Ex: Alvo KRAS) [cite: 100]" }
            ]
        },
        'immunotherapy_type': {
            question: "Qual a sua estratégia principal de imunoterapia? (Inspirado no Módulo 5.2)",
            options: [
                { text: "Terapia Celular (ex: Células T CAR)", nextNode: 'cellular_start', result: "Estratégia: Terapia Celular. [cite: 325]" },
                { text: "Terapia Humoral (ex: Inibidores de Checkpoint)", nextNode: 'humoral_start', result: "Estratégia: Terapia Humoral (Anticorpos). [cite: 404]" }
            ]
        },

        // --- CAMINHO 1: TERAPIA HUMORAL (Inibidores de Checkpoint) ---
        'humoral_start': {
            question: "Excelente. Vamos desenvolver um Inibidor de Checkpoint. Qual será o alvo? (Módulo 5.2)",
            options: [
                { text: "Bloquear o PD-1 (no Linfócito T)", nextNode: 'humoral_biomarker', result: "Alvo: PD-1. Vamos 'proteger o freio' do Linfócito T. [cite: 349, 407]" },
                { text: "Bloquear o PD-L1 (na Célula Tumoral)", nextNode: 'humoral_biomarker', result: "Alvo: PD-L1. Vamos 'esconder o sinal de desligar' do tumor. [cite: 350, 409]" }
            ]
        },
        'humoral_biomarker': {
            question: "Fase Pré-clínica: Precisamos de um biomarcador preditivo para selecionar pacientes (Módulo 6.3). Qual usar?",
            options: [
                { text: "Expressão de PD-L1 (Imuno-histoquímica)", nextNode: 'humoral_phase1', result: "Biomarcador: Expressão de PD-L1. [cite: 413]" },
                { text: "Instabilidade de Microssatélites (MSI-H)", nextNode: 'humoral_phase1_msi', result: "Biomarcador: MSI-H. Tumores com alta carga mutacional. [cite: 414, 418, 419]" }
            ]
        },
        'humoral_phase1': {
            question: "Fase 1 (Segurança): O fármaco (Anti-PD-1) é testado em 20 pacientes. É bem tolerado, mas 3 pacientes desenvolvem colite autoimune (toxicidade esperada). O que fazer?",
            options: [
                { text: "Continuar para Fase 2 com a mesma dose.", nextNode: 'humoral_phase2', result: "Decisão: Avançar. A toxicidade é manejável." },
                { text: "Reduzir a dose e repetir a Fase 1 (atraso de 1 ano).", nextNode: 'end_fail_delay', result: "Decisão: Reduzir dose. A concorrência ultrapassou-nos. O projeto falhou." }
            ]
        },
        'humoral_phase1_msi': {
            question: "Fase 1 (Segurança): O fármaco (Anti-PD-1) é testado em pacientes MSI-H. A segurança é boa.",
            options: [
                { text: "Avançar direto para um ensaio de Fase 2 'agnóstico'.", nextNode: 'humoral_phase2_msi', result: "Decisão: Avançar com ensaio agnóstico. [cite: 421]" }
            ]
        },
        'humoral_phase2': {
            question: "Fase 2 (Eficácia): Em 100 pacientes (PD-L1+), a taxa de resposta é de 25% (vs 10% da quimio). Parece promissor, mas não é espetacular. O que fazer?",
            options: [
                { text: "Avançar para Fase 3 (ensaio caro com 1000 pacientes).", nextNode: 'humoral_phase3', result: "Decisão: Avançar para Fase 3." },
                { text: "Tentar combinar com Quimioterapia (Módulo 6.1) para melhorar a resposta.", nextNode: 'humoral_phase3_combo', result: "Decisão: Criar um ensaio de combinação (Imuno + Quimio)." }
            ]
        },
        'humoral_phase2_msi': {
            question: "Fase 2 (Eficácia): Resultados espetaculares! Em pacientes MSI-H [cite: 416] de vários tipos de câncer (cólon, endométrio), a taxa de resposta é de 60%!",
            options: [
                { text: "Pedir aprovação acelerada à agência reguladora.", nextNode: 'end_success_agnostic', result: "Decisão: Pedir aprovação acelerada (Agnóstica)." }
            ]
        },
        'humoral_phase3': {
            question: "Fase 3 (Confirmação): O ensaio de Anti-PD-1 sozinho falha. Não foi estatisticamente superior à quimioterapia em sobrevida global.",
            options: [
                { text: "Abandonar o projeto.", nextNode: 'end_fail', result: "Resultado: O ensaio de monoterapia falhou." }
            ]
        },
        'humoral_phase3_combo': {
            question: "Fase 3 (Confirmação): A combinação de Anti-PD-1 + Quimioterapia [cite: 370] é um sucesso! A sobrevida global aumentou em 6 meses comparado com Quimio sozinha.",
            options: [
                { text: "Submeter para aprovação regulatória!", nextNode: 'end_success', result: "Resultado: Sucesso! A combinação é o novo padrão de tratamento." }
            ]
        },

        // --- CAMINHO 2: TERAPIA CELULAR (CAR-T) ---
        'cellular_start': {
            question: "Ok, Terapia Celular (ex: CAR-T). Precisamos de um alvo (neoantígeno) [cite: 327] na superfície da célula tumoral. A pesquisa identifica o 'Antígeno-X'.",
            options: [
                { text: "Avançar para testes pré-clínicos com 'Antígeno-X'.", nextNode: 'cellular_preclinical', result: "Decisão: Focar no Antígeno-X." }
            ]
        },
        'cellular_preclinical': {
            question: "Fase Pré-clínica: Testes em ratos mostram que o CAR-T (anti-Antígeno-X) elimina o tumor. Problema: O Antígeno-X também é expresso em níveis baixos em células normais do pulmão. Risco de toxicidade 'on-target, off-tumor'.",
            options: [
                { text: "Avançar assim mesmo (riscado).", nextNode: 'cellular_phase1_fail', result: "Decisão: Risco assumido. A velocidade é tudo." },
                { text: "Engenharia da célula CAR-T para ser menos sensível (atraso de 1 ano).", nextNode: 'cellular_phase1_safe', result: "Decisão: Priorizar segurança (atraso de 1 ano)." }
            ]
        },
        'cellular_phase1_fail': {
            question: "Fase 1 (Segurança): O primeiro paciente tratado sofre toxicidade pulmonar severa e morre. O ensaio é interrompido permanentemente.",
            options: [
                { text: "Fim da linha.", nextNode: 'end_fail_toxicity', result: "Resultado: Falha catastrófica por toxicidade." }
            ]
        },
        'cellular_phase1_safe': {
            question: "Fase 1 (Segurança): O CAR-T 'seguro' é testado. Os pacientes têm febre (Tempestade de Citocinas leve), mas é manejável. A segurança é aceitável.",
            options: [
                { text: "Avançar para Fase 2.", nextNode: 'cellular_phase2', result: "Resultado: Segurança aprovada. Avançar." }
            ]
        },
        'cellular_phase2': {
            question: "Fase 2 (Eficácia): A terapia é testada em pacientes que já falharam quimio e imuno. Resultados incríveis: 70% de resposta completa!",
            options: [
                { text: "Submeter para aprovação acelerada!", nextNode: 'cellular_phase2_issue', result: "Resultado: Eficácia impressionante. Pedir aprovação." }
            ]
        },
        'cellular_phase2_issue': {
            question: "Aprovação Concedida! Mas... após 1 ano, 60% dos pacientes recaem. A 'Evolução Darwiniana Somática' (Módulo 1.3) [cite: 48, 59] atacou. Qual é a causa da resistência?",
            options: [
                { text: "Biópsia mostra: O tumor perdeu o 'Antígeno-X' (Perda de Alvo). [cite: 337]", nextNode: 'end_partial_success', result: "Resistência: Perda de Antígeno. A terapia é boa, mas não curativa." },
                { text: "Biópsia mostra: O tumor aumentou a expressão de PD-L1 (Evasão Imune). [cite: 351]", nextNode: 'cellular_phase3_combo', result: "Resistência: Evasão por PD-L1. [cite: 353]" }
            ]
        },
        'cellular_phase3_combo': {
            question: "Nova Ideia! Vamos fazer um ensaio de Fase 3: (CAR-T 'Seguro') + (Inibidor de Checkpoint Anti-PD-1) [cite: 407] para prevenir a resistência.",
            options: [
                { text: "Iniciar o ensaio de combinação.", nextNode: 'end_success_combo', result: "Decisão: Iniciar ensaio de combinação de última geração." }
            ]
        },

        // --- NÓS FINAIS ---
        'end_success': {
            question: "🎉 SUCESSO! A sua terapia foi aprovada e tornar-se-á o novo padrão de tratamento! Milhares de vidas serão impactadas.",
            isEnd: true
        },
        'end_success_agnostic': {
            question: "🎉 SUCESSO ESPETACULAR! A sua terapia foi a primeira a receber aprovação 'agnóstica'[cite: 421], tratando o câncer pela sua biologia (MSI-H), não pela sua localização. Um marco na Oncologia de Precisão. [cite: 360]",
            isEnd: true
        },
        'end_success_combo': {
            question: "🎉 SUCESSO! A combinação de CAR-T + Anti-PD-1 mostrou resultados duradouros, combatendo a resistência. É o futuro da imunoterapia!",
            isEnd: true
        },
        'end_partial_success': {
            question: "⚠️ SUCESSO PARCIAL. A terapia foi aprovada, mas a resistência é um grande desafio[cite: 59, 60]. O seu trabalho salvou vidas, mas a 'Evolução Somática' (Módulo 1.3) [cite: 48] mostra que a pesquisa deve continuar.",
            isEnd: true
        },
        'end_fail': {
            question: "⛔ FALHA. Infelizmente, o ensaio não atingiu os seus objetivos de eficácia. O grupo de controlo (quimioterapia) teve resultados semelhantes. A pesquisa é assim.",
            isEnd: true
        },
        'end_fail_delay': {
            question: "⛔ FALHA. A decisão de priorizar a segurança atrasou o projeto. Um concorrente publicou resultados primeiro e dominou o mercado. O financiamento foi cortado.",
            isEnd: true
        },
        'end_fail_toxicity': {
            question: "⛔ FALHA CATASTRÓFICA. O ensaio foi interrompido por toxicidade grave. Esta é uma lição trágica sobre a importância dos testes pré-clínicos rigorosos.",
            isEnd: true
        }
    };

    // --- 4. Função Principal: Mostrar o Nó da Decisão ---
    function showNode(nodeName) {
        // Encontra o nó atual na árvore de decisões
        const node = decisionTree[nodeName];

        // Atualiza o texto da pergunta
        questionText.textContent = node.question;

        // Limpa as opções anteriores
        optionsContainer.innerHTML = '';

        // Esconde o botão de relatório por padrão
        reportButton.style.display = 'none';

        // Verifica se é um nó final
        if (node.isEnd) {
            finalNodeId = nodeName; // Guarda o ID do nó final
            reportButton.style.display = 'block'; // Mostra o botão de relatório
            reportButton.onclick = generateReport; // Atribui a função ao clique
            return; // Para a execução
        }

        // Cria os botões para as novas opções
        node.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.className = 'option-btn';

            // O que acontece ao clicar num botão:
            button.onclick = () => {
                // 1. Guarda a decisão no histórico
                userPath.push({
                    step: node.question,       // A pergunta que foi feita
                    choice: option.text,      // A resposta do utilizador
                    result: option.result || 'Próxima etapa...' // O resultado (se houver)
                });

                // 2. Avança para o próximo nó
                showNode(option.nextNode);
            };

            optionsContainer.appendChild(button);
        });
    }

    // --- 5. Função de Gerar Relatório ---
    function generateReport() {
        // Abre um novo separador (aba) no navegador
        const reportWindow = window.open('', '_blank');
        
        if (reportWindow) {
            // Constrói o HTML do relatório
            let htmlReport = `
                <html>
                <head>
                    <title>Relatório Final da Estratégia</title>
                    <style>
                        /* Copia os estilos do 'style.css' para o relatório */
                        body { font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; }
                        .report-slide { background-color: #fff; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin: 20px auto; padding: 25px; max-width: 900px; }
                        .report-slide h1 { color: #333; }
                        .report-slide h2 { color: #005a9c; border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 1.6rem; }
                        .report-slide p { font-size: 1.1rem; line-height: 1.5; }
                        .report-slide .step { font-weight: bold; color: #333; }
                        .report-slide .choice { font-weight: bold; color: #d9534f; }
                        .report-slide .outcome { font-style: italic; color: #5cb85c; }
                        .report-slide .final-success { font-size: 1.3rem; font-weight: bold; color: #28a745; }
                        .report-slide .final-fail { font-size: 1.3rem; font-weight: bold; color: #d9534f; }
                        .report-slide .final-partial { font-size: 1.3rem; font-weight: bold; color: #f0ad4e; } /* Laranja para parcial */
                    </style>
                </head>
                <body>
                    <div class="report-slide">
                        <h1>Relatório da Estratégia Terapêutica</h1>
                        <p>Abaixo está o percurso decisório completo, desde a concepção até o resultado final.</p>
                    </div>
            `;

            // Adiciona um "slide" para cada passo no histórico
            userPath.forEach((step, index) => {
                htmlReport += `
                    <div class="report-slide">
                        <h2>Etapa ${index + 1}</h2>
                        <p class="step"><strong>Cenário:</strong> ${step.step}</p>
                        <p class="choice"><strong>Decisão Tomada:</strong> ${step.choice}</p>
                        <p class="outcome"><strong>Resultado/Discussão:</strong> ${step.result}</p>
                    </div>
                `;
            });
            
            // Adiciona o slide final (o último passo)
            const finalNode = decisionTree[finalNodeId];
            if(finalNode) {
                 // Determina a classe CSS com base no nome do nó final
                 let finalClass = 'final-fail'; // Padrão
                 if (finalNodeId.includes('success_agnostic') || finalNodeId.includes('success_combo') || finalNodeId.includes('end_success')) {
                     finalClass = 'final-success';
                 } else if (finalNodeId.includes('partial_success')) {
                     finalClass = 'final-partial';
                 }

                 htmlReport += `
                    <div class="report-slide">
                        <h2>Resultado Final</h2>
                        <p class="${finalClass}">
                            ${finalNode.question}
                        </p>
                    </div>
                `;
            }

            htmlReport += '</body></html>';

            // Escreve o HTML no novo separador
            reportWindow.document.write(htmlReport);
            reportWindow.document.close();
        } else {
            alert('Por favor, permita pop-ups para ver o relatório.');
        }
    }

    // --- 6. Iniciar a Simulação ---
    // Começa o jogo no nó 'start'
    showNode('start');

});
