// Espera o HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Referências aos Elementos HTML ---
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const reportButton = document.getElementById('report-button');

    // --- 2. Histórico de Decisões do Utilizador ---
    let userPath = [];
    let finalNodeId = ''; // Guarda o ID do nó final para o relatório

    // --- 3. A ÁRVORE DE DECISÕES (Versão 2.0) ---
    // Totalmente reescrita com 3+ opções e explicações simples.
    const decisionTree = {
        'start': {
            question: "Bem-vindo, Doutor(a). A sua missão é desenvolver uma nova terapia. Qual tipo de câncer será o foco inicial da sua pesquisa?",
            options: [
                { text: "Câncer de Pulmão", nextNode: 'approach_type', result: "Foco: Câncer de Pulmão." },
                { text: "Melanoma (Câncer de Pele)", nextNode: 'approach_type', result: "Foco: Melanoma." },
                { text: "Câncer de Pâncreas", nextNode: 'approach_type', result: "Foco: Câncer de Pâncreas." },
                { text: "Câncer de Mama", nextNode: 'approach_type', result: "Foco: Câncer de Mama." },
                { text: "Câncer Colorretal", nextNode: 'approach_type', result: "Foco: Câncer Colorretal." }
            ]
        },
        'approach_type': {
            question: "Qual será a sua abordagem principal? (Como a sua terapia vai funcionar?)",
            options: [
                { text: "Terapia-Alvo (Criar uma 'chave' química que desliga um 'motor' que faz o tumor crescer).", nextNode: 'target_start', result: "Abordagem: Terapia-Alvo." },
                { text: "Imunoterapia - Humoral (Criar 'mísseis teleguiados', como anticorpos, que marcam ou bloqueiam o câncer).", nextNode: 'humoral_start', result: "Abordagem: Imunoterapia Humoral (Anticorpos)." },
                { text: "Imunoterapia - Celular (Usar células de defesa do paciente 'turbinadas' para atacar o tumor).", nextNode: 'cellular_start', result: "Abordagem: Imunoterapia Celular (Ex: CAR-T)." }
            ]
        },

        // --- CAMINHO 1: TERAPIA-ALVO ---
        'target_start': {
            question: "Vamos focar num 'motor' (oncogene) que faz o tumor crescer sem parar. Qual tipo de 'motor' vamos atacar?",
            options: [
                { text: "Um Receptor de Superfície (Uma 'antena' do lado de fora da célula que capta sinais de crescimento).", nextNode: 'target_receptor', result: "Alvo: Receptor de Superfície (ex: HER2)." },
                { text: "Um Sinalizador Interno (Uma 'engrenagem' dentro da célula que transmite o sinal de crescer).", nextNode: 'target_braf', result: "Alvo: Sinalizador Interno (ex: BRAF)." },
                { text: "Um Fator de Transcrição (O 'chefe' no núcleo que dá a ordem para a célula se dividir).", nextNode: 'target_myc_fail', result: "Alvo: Fator de Transcrição (ex: MYC)." }
            ]
        },
        'target_myc_fail': {
            question: "Desafio de Pesquisa. Após 2 anos, a equipa não consegue criar uma droga que desligue este 'chefe' sem matar células normais. É um alvo notoriamente difícil.",
            options: [
                { text: "Pivotar o projeto. Mudar o alvo para um 'Sinalizador Interno' (BRAF).", nextNode: 'target_braf', result: "Decisão: Pivotar para o alvo BRAF." },
                { text: "Pedir mais 5 milhões e tentar uma nova tecnologia de RNA para silenciar o gene.", nextNode: 'end_fail_funding', result: "Decisão: Pedir mais fundos. O pedido foi negado." },
                { text: "Abandonar o projeto.", nextNode: 'end_fail', result: "Decisão: Abandonar o projeto." }
            ]
        },
        'target_receptor': {
            question: "Fase Pré-clínica (Testes em animais). A droga funciona, mas causa problemas cardíacos nos ratos (toxicidade). O que fazer?",
            options: [
                { text: "Ignorar. Ratos são diferentes de humanos. Avançar para Fase 1.", nextNode: 'end_fail_toxicity', result: "Decisão: Ignorar toxicidade. O ensaio falhou em humanos." },
                { text: "Voltar ao laboratório e redesenhar a molécula para ser mais segura (Atraso de 1 ano).", nextNode: 'target_receptor_phase1', result: "Decisão: Priorizar segurança (atraso de 1 ano)." },
                { text: "Mudar o alvo. Tentar um 'Sinalizador Interno' (BRAF).", nextNode: 'target_braf', result: "Decisão: Mudar de alvo para BRAF." }
            ]
        },
        'target_receptor_phase1': {
            question: "Fase 1 (Segurança) e Fase 2 (Eficácia) são um sucesso! A droga (ex: Trastuzumabe) funciona muito bem para pacientes que têm a 'antena' superexpressa!",
            options: [
                { text: "Iniciar a Fase 3 (Confirmação) contra o tratamento padrão.", nextNode: 'end_success_target', result: "Decisão: Iniciar Fase 3. Sucesso! Aprovado!" },
                { text: "Vender a patente para uma grande farmacêutica agora.", nextNode: 'end_success_sellout', result: "Decisão: Vender a patente. Lucro rápido, mas menor." }
            ]
        },
        'target_braf': {
            question: "Fase Pré-clínica (Alvo: BRAF). Sucesso! A sua droga mata 100% das células de melanoma com a mutação BRAF em laboratório.",
            options: [
                { text: "Avançar direto para Fase 1 e 2. (Rápido)", nextNode: 'target_braf_resistance', result: "Decisão: Avançar rápido." },
                { text: "Testar em combinação com outra droga (Inibidor de MEK) para prevenir resistência.", nextNode: 'target_braf_combo_preclinical', result: "Decisão: Testar combinação." },
                { text: "Vender a patente agora. O lucro é garantido, mas menor.", nextNode: 'end_success_sellout', result: "Decisão: Vender a patente. Lucro rápido." }
            ]
        },
        'target_braf_resistance': {
            question: "Sucesso e Problema. A droga é aprovada! Mas 1 ano depois, os tumores de 90% dos pacientes voltam. O câncer 'aprendeu' um desvio (resistência).",
            options: [
                { text: "Aceitar. A droga deu 1 ano extra aos pacientes. (Fim)", nextNode: 'end_partial_success', result: "Resultado: Sucesso parcial. A droga é útil, mas não curativa." },
                { text: "Voltar ao laboratório e desenvolver a droga de combinação (BRAF + MEK) agora.", nextNode: 'target_braf_combo_phase3', result: "Decisão: Desenvolver a combinação agora." },
                { text: "Investigar 'Biópsia Líquida' (exame de sangue) para detetar a resistência mais cedo.", nextNode: 'end_success_diagnostic', result: "Decisão: Pivotar para diagnóstico." }
            ]
        },
        'target_braf_combo_preclinical': {
            question: "Fase Pré-clínica (Combinação). A combinação da sua droga (BRAF) com um 'Inibidor de MEK' (outra engrenagem) previne a resistência nos animais.",
            options: [
                { text: "Avançar direto para Fase 3 com a combinação. (Arriscado, mas rápido)", nextNode: 'target_braf_combo_phase3', result: "Decisão: Avançar direto com a combinação." }
            ]
        },
        'target_braf_combo_phase3': {
            question: "Fase 3 (Combinação). O ensaio testando a sua droga (BRAF) + a droga (MEK) é um sucesso. A combinação impede a resistência por muito mais tempo.",
            options: [
                { text: "Submeter a nova combinação para aprovação!", nextNode: 'end_success_combo', result: "Resultado: Sucesso! A combinação é o novo padrão." }
            ]
        },

        // --- CAMINHO 2: IMUNOTERAPIA HUMORAL ---
        'humoral_start': {
            question: "Vamos criar um 'míssil teleguiado' (anticorpo). Qual será a estratégia deste míssil?",
            options: [
                { text: "Inibidor de Checkpoint (Um anticorpo que 'corta o freio' do sistema imune, para que ele ataque o câncer).", nextNode: 'humoral_checkpoint', result: "Estratégia: Inibidor de Checkpoint (ex: Anti-PD-1)." },
                { text: "Anticorpo 'Armado' (Um anticorpo que carrega uma 'bomba' de quimioterapia e a entrega direto na célula do câncer).", nextNode: 'humoral_armed', result: "Estratégia: Anticorpo 'Armado' (ADC)." },
                { text: "Anticorpo 'Nu' (Um anticorpo que se liga ao tumor e o 'marca' para destruição pelo sistema imune).", nextNode: 'humoral_naked', result: "Estratégia: Anticorpo 'Nu'." }
            ]
        },
        'humoral_checkpoint': {
            question: "Fase Pré-clínica: O seu Inibidor de Checkpoint funciona bem em animais. Precisamos de um 'biomarcador' (exame de seleção) para a Fase 1 em humanos. Qual usar?",
            options: [
                { text: "Testar em pacientes que tenham a 'bandeira' PD-L1 visível no tumor.", nextNode: 'humoral_phase1', result: "Biomarcador: Expressão de PD-L1." },
                { text: "Testar em pacientes com 'Instabilidade de Microssatélite' (MSI-H), que têm muitos erros genéticos.", nextNode: 'humoral_phase1_msi', result: "Biomarcador: MSI-H." },
                { text: "Testar em todos os pacientes, sem seleção. (Mais rápido, mas arriscado)", nextNode: 'humoral_phase1_all', result: "Biomarcador: Nenhum. Testar em todos." }
            ]
        },
        'humoral_phase1_all': {
            question: "Fase 1 e 2: O ensaio sem biomarcador falha. A taxa de resposta foi de apenas 5%, o que não é melhor que o tratamento atual. A agência não aprova.",
             options: [
                { text: "Voltar e re-analisar o sangue dos pacientes para 'descobrir' um biomarcador agora.", nextNode: 'humoral_phase1', result: "Decisão: Tarde demais, mas vamos tentar achar o biomarcador." },
                { text: "Abandonar o projeto.", nextNode: 'end_fail', result: "Decisão: Abandonar. Falha por falta de seleção." }
            ]
        },
        'humoral_phase1': {
            question: "Fase 1/2 (PD-L1+): Em 100 pacientes com PD-L1+, a taxa de resposta é de 25%. É promissor, mas não é espetacular. O que fazer?",
            options: [
                { text: "Avançar para Fase 3 (ensaio caro com 1000 pacientes) só com esta droga.", nextNode: 'humoral_phase3_mono', result: "Decisão: Avançar para Fase 3 (Monoterapia)." },
                { text: "Tentar combinar com Quimioterapia para 'agitar' o tumor e melhorar a resposta.", nextNode: 'humoral_phase3_combo', result: "Decisão: Avançar para Fase 3 (Combinação)." },
                { text: "Abandonar. 25% é muito baixo para competir.", nextNode: 'end_fail', result: "Decisão: Abandonar. Taxa de resposta baixa." }
            ]
        },
         'humoral_phase1_msi': {
            question: "Fase 1/2 (MSI-H): Resultados espetaculares! Em pacientes MSI-H de vários tipos de câncer, a taxa de resposta é de 60%! É uma descoberta!",
            options: [
                { text: "Pedir aprovação acelerada à agência reguladora (para todos os tumores MSI-H).", nextNode: 'end_success_agnostic', result: "Decisão: Pedir aprovação 'Agnóstica'." }
            ]
        },
        'humoral_phase3_mono': {
            question: "Fase 3 (Confirmação - Monoterapia): O ensaio falha. A sua droga sozinha não foi estatisticamente superior à quimioterapia em sobrevida global.",
            options: [
                { text: "Abandonar o projeto.", nextNode: 'end_fail', result: "Resultado: O ensaio de monoterapia falhou." }
            ]
        },
        'humoral_phase3_combo': {
            question: "Fase 3 (Confirmação - Combinação): A combinação de Imunoterapia + Quimioterapia é um sucesso! A sobrevida global aumentou em 6 meses comparado com Quimio sozinha.",
            options: [
                { text: "Submeter para aprovação regulatória!", nextNode: 'end_success_combo_chemo', result: "Resultado: Sucesso! A combinação é o novo padrão." }
            ]
        },
        // (Outros caminhos humorais 'armed' e 'naked' podem ser adicionados aqui)

        // --- CAMINHO 3: IMUNOTERAPIA CELULAR ---
        'cellular_start': {
            question: "Ok, Terapia Celular (CAR-T). Vamos 'turbinar' as células T do paciente. Precisamos de um alvo (uma 'bandeira') na superfície da célula tumoral. Qual a sua prioridade?",
            options: [
                { text: "Escolher um alvo que seja MUITO expresso no tumor, mesmo que exista um pouco em células normais.", nextNode: 'cellular_preclinical_risky', result: "Estratégia: Alta eficácia (risco de toxicidade)." },
                { text: "Escolher um alvo que seja 100% ÚNICO do tumor, mesmo que seja um alvo mais fraco.", nextNode: 'cellular_preclinical_safe', result: "Estratégia: Alta segurança (risco de baixa eficácia)." },
                { text: "Investir em 'Biópsia Líquida' para encontrar alvos únicos para cada paciente.", nextNode: 'end_success_diagnostic', result: "Estratégia: Pivotar para diagnóstico personalizado." }
            ]
        },
        'cellular_preclinical_risky': {
            question: "Fase Pré-clínica: Testes em animais mostram que o CAR-T (anti-Alvo-X) elimina o tumor. Problema: O Alvo-X também existe em níveis baixos em células normais do pulmão. O que fazer?",
            options: [
                { text: "Avançar assim mesmo. A urgência é alta.", nextNode: 'cellular_phase1_fail', result: "Decisão: Risco assumido." },
                { text: "Engenhar a célula CAR-T com um 'freio de segurança' (gene suicida). (Atraso de 1 ano)", nextNode: 'cellular_phase1_safe', result: "Decisão: Adicionar freio de segurança." },
                { text: "Mudar de alvo. Escolher o alvo 100% único e mais fraco.", nextNode: 'cellular_preclinical_safe', result: "Decisão: Mudar para o alvo seguro." }
            ]
        },
        'cellular_preclinical_safe': {
            question: "Fase 1 (Segurança): O CAR-T (anti-Alvo-Seguro) é testado. É 100% seguro. Fase 2 (Eficácia): Os resultados são fracos. Apenas 10% dos pacientes respondem.",
            options: [
                 { text: "Abandonar. A eficácia é muito baixa.", nextNode: 'end_fail', result: "Resultado: Falha por baixa eficácia." },
                 { text: "Tentar combinar com Quimioterapia para 'expor' mais o alvo.", nextNode: 'humoral_phase3_combo', result: "Decisão: Tentar combinação." }
            ]
        },
        'cellular_phase1_fail': {
            question: "Fase 1 (Segurança): O primeiro paciente tratado sofre toxicidade pulmonar severa e morre. A agência reguladora interrompe o ensaio permanentemente.",
            options: [
                { text: "Fim da linha. Um resultado trágico.", nextNode: 'end_fail_toxicity', result: "Resultado: Falha catastrófica por toxicidade." }
            ]
        },
        'cellular_phase1_safe': {
            question: "Fase 1 (Segurança): O CAR-T com 'freio de segurança' é testado. Um paciente tem toxicidade, o freio é ativado e funciona! A segurança é aprovada.",
            options: [
                { text: "Avançar para Fase 2 (Eficácia).", nextNode: 'cellular_phase2', result: "Resultado: Segurança aprovada. Avançar." }
            ]
        },
        'cellular_phase2': {
            question: "Fase 2 (Eficácia): A terapia é testada em pacientes que já falharam tudo. Resultados incríveis: 70% de resposta completa! Mas... o custo de produção é de 500.000 dólares por paciente.",
            options: [
                { text: "Submeter para aprovação acelerada. O custo é um problema para depois.", nextNode: 'cellular_phase2_resistance', result: "Decisão: Aprovar agora, custo depois." },
                { text: "Pausar e investir em otimização de produção (Atraso de 2 anos).", nextNode: 'end_fail_delay', result: "Decisão: Otimizar. A concorrência ultrapassou-nos." },
                { text: "Licenciar a tecnologia para uma 'Big Pharma' que possa otimizar a produção.", nextNode: 'end_success_sellout', result: "Decisão: Licenciar a tecnologia." }
            ]
        },
        'cellular_phase2_resistance': {
            question: "Aprovação Concedida! Mas... após 1 ano, 60% dos pacientes recaem. O câncer 'evoluiu' e agora escondeu o alvo (a 'bandeira' desapareceu).",
            options: [
                { text: "É um sucesso parcial. A terapia deu tempo aos pacientes.", nextNode: 'end_partial_success', result: "Resultado: Sucesso parcial. A resistência é um desafio." },
                { text: "Desenvolver um CAR-T 'duplo', que ataca dois alvos ao mesmo tempo.", nextNode: 'end_success_combo', result: "Decisão: Desenvolver CAR-T duplo." },
                { text: "Combinar o CAR-T com um Inibidor de Checkpoint (Anti-PD-1).", nextNode: 'end_success_combo', result: "Decisão: Combinar com Inibidor de Checkpoint." }
            ]
        },


        // --- NÓS FINAIS ---
        'end_success_target': {
            question: "🎉 SUCESSO! A sua Terapia-Alvo (ex: Trastuzumabe) foi aprovada! Ela mudou o tratamento para pacientes com aquele perfil específico (ex: HER2+).",
            isEnd: true
        },
        'end_success_agnostic': {
            question: "🎉 SUCESSO HISTÓRICO! A sua terapia foi a primeira a receber aprovação 'Agnóstica', tratando o câncer pela sua biologia (MSI-H), não pela sua localização. Um marco na Oncologia de Precisão!",
            isEnd: true
        },
        'end_success_combo': {
            question: "🎉 SUCESSO! A sua estratégia de combinação (ex: BRAF+MEK ou CAR-T duplo) mostrou resultados duradouros, combatendo a resistência. É o futuro!",
            isEnd: true
        },
         'end_success_combo_chemo': {
            question: "🎉 SUCESSO! A combinação de Imunoterapia + Quimioterapia foi aprovada e é o novo padrão de tratamento, oferecendo mais esperança a milhares de pacientes.",
            isEnd: true
        },
        'end_success_diagnostic': {
            question: "💡 SUCESSO (PIVOT)! A sua pesquisa sobre resistência levou ao desenvolvimento de uma 'Biópsia Líquida' revolucionária. A sua empresa agora é líder em diagnóstico de precisão.",
            isEnd: true
        },
        'end_success_sellout': {
            question: "✅ SUCESSO FINANCEIRO. A patente foi vendida por uma grande soma. A sua molécula avançará nas mãos de outra empresa, e você está livre para começar o próximo projeto.",
            isEnd: true
        },
        'end_partial_success': {
            question: "⚠️ SUCESSO PARCIAL. A terapia foi aprovada, mas a resistência é um grande desafio. O seu trabalho salvou vidas e deu tempo precioso, mas a pesquisa deve continuar.",
            isEnd: true
        },
        'end_fail': {
            question: "⛔ FALHA. Infelizmente, o ensaio não atingiu os seus objetivos de eficácia. O grupo de controlo (tratamento padrão) teve resultados semelhantes.",
            isEnd: true
        },
        'end_fail_delay': {
            question: "⛔ FALHA. A decisão de otimizar/pausar atrasou o projeto. Um concorrente publicou resultados primeiro e dominou o mercado. O financiamento foi cortado.",
            isEnd: true
        },
        'end_fail_toxicity': {
            question: "⛔ FALHA CATASTRÓFICA. O ensaio foi interrompido por toxicidade grave. Esta é uma lição trágica sobre a importância da segurança do paciente.",
            isEnd: true
        },
        'end_fail_funding': {
            question: "⛔ FALHA. O pedido de fundos adicionais foi negado. A sua pesquisa foi considerada muito cara ou de alto risco, e o projeto foi arquivado.",
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
                <body class="report-body">
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
                 if (finalNodeId.includes('success')) {
                     finalClass = 'final-success';
                 } else if (finalNodeId.includes('partial')) {
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
