/* ============================================
   CYBER CONSCIENTE — SIPAT 2026
   JavaScript: vanilla JS (sem bibliotecas)
   Funcionalidades:
   1. Toggle de tema claro/escuro
   2. Menu mobile responsivo
   3. Header com sombra ao rolar
   4. Scroll reveal animations
   5. Quiz interativo (5 questões V/F)
   6. Botão "voltar ao topo"
   7. Navegação ativa conforme seção
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       1. TEMA CLARO/ESCURO
       ============================================ */
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Verifica tema salvo ou preferência do sistema
    function getInitialTheme() {
        const savedTheme = localStorage.getItem('cyber-theme');
        if (savedTheme) return savedTheme;
        // Respeita preferência do sistema operacional
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        localStorage.setItem('cyber-theme', theme);
        // Atualiza aria-label do botão
        if (themeToggle) {
            themeToggle.setAttribute('aria-label',
                theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
        }
    }

    // Aplica tema inicial imediatamente
    applyTheme(getInitialTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    /* ============================================
       2. MENU MOBILE
       ============================================ */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            const isActive = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu');
        });

        // Fecha menu ao clicar em link
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Fecha menu ao clicar fora
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Fecha menu ao redimensionar para desktop
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (window.innerWidth > 768) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }, 150);
        });
    }

    /* ============================================
       3. HEADER SHADOW + BACK TO TOP
       ============================================ */
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        if (header) {
            if (scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        if (backToTop) {
            if (scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ============================================
       4. SCROLL REVEAL ANIMATIONS
       ============================================ */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Pequeno delay escalonado para efeito cascata
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(function (el, index) {
            // Adiciona delay incremental baseado em sua posição entre irmãos
            const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
            const localIndex = siblings.indexOf(el);
            if (localIndex > 0 && !el.dataset.delay) {
                el.dataset.delay = Math.min(localIndex * 80, 240);
            }
            revealObserver.observe(el);
        });
    } else {
        // Fallback para navegadores antigos
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ============================================
       5. NAV ATIVA CONFORME SEÇÃO VISÍVEL
       ============================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinksByHref = {};
    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            navLinksByHref[href.substring(1)] = link;
        }
    });

    if ('IntersectionObserver' in window && sections.length) {
        const navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(l => l.classList.remove('active'));
                    if (navLinksByHref[id]) {
                        navLinksByHref[id].classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(function (section) {
            navObserver.observe(section);
        });
    }

    /* ============================================
       6. QUIZ INTERATIVO (5 questões V/F)
       ============================================ */
    const quizData = [
        {
            question: 'O ataque cibernético ao Ministério da Saúde em 2021 ocorreu durante a pandemia de Covid-19 e afetou o sistema ConecteSUS, usado para emitir o certificado nacional de vacinação.',
            answer: true,
            explanation: 'Verdadeiro. O ataque aconteceu em 10 de dezembro de 2021, no auge da campanha de vacinação contra a Covid-19, e o ConecteSUS ficou indisponível por cerca de 13 dias.'
        },
        {
            question: 'O grupo hacker que assumiu o ataque ao Ministério da Saúde se chamava Lapsus$ Group.',
            answer: true,
            explanation: 'Verdadeiro. O grupo Lapsus$ assumiu a autoria do ataque e chegou a deixar uma mensagem nas páginas invadidas afirmando que 50 TB de dados haviam sido copiados e excluídos.'
        },
        {
            question: 'O ataque foi um ransomware tradicional que criptografou todos os bancos de dados do Ministério da Saúde.',
            answer: false,
            explanation: 'Falso. Perícias da Polícia Federal constataram que os bancos de dados NÃO foram criptografados pelos hackers. Eles copiaram e excluíram dados, mas não aplicaram a criptografia característica do ransomware.'
        },
        {
            question: 'Usar a mesma senha forte em todos os serviços é uma boa prática de segurança, desde que a senha tenha mais de 12 caracteres.',
            answer: false,
            explanation: 'Falso. Mesmo uma senha forte NUNCA deve ser reutilizada em vários serviços. Se um site for invadido, os criminosos tentarão a mesma senha em outros serviços (ataque chamado credential stuffing). Use senhas únicas e um gerenciador de senhas.'
        },
        {
            question: 'A autenticação em dois fatores (2FA) protege a conta mesmo se a senha for roubada por um criminoso.',
            answer: true,
            explanation: 'Verdadeiro. Com o 2FA ativado, mesmo que o criminoso consiga a senha, ele precisará de um segundo fator (código no celular, biometria ou token) para conseguir entrar. É uma das defesas mais eficazes contra invasões.'
        }
    ];

    const quizQuestionsContainer = document.getElementById('quizQuestions');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const quizResult = document.getElementById('quizResult');
    const scoreNumber = document.getElementById('scoreNumber');
    const resultMessage = document.getElementById('resultMessage');
    const restartButton = document.getElementById('restartQuiz');

    let quizState = {
        currentQuestion: 0,
        score: 0,
        answered: false
    };

    function renderQuiz() {
        // Estado inicial
        quizState = {
            currentQuestion: 0,
            score: 0,
            answered: false
        };

        // Renderiza todas as perguntas
        quizQuestionsContainer.innerHTML = '';
        quizQuestionsContainer.style.display = 'block';
        quizResult.hidden = true;

        quizData.forEach(function (item, index) {
            const questionEl = document.createElement('div');
            questionEl.className = 'quiz-question';
            questionEl.dataset.index = index;
            questionEl.innerHTML = `
                <p class="question-text">
                    <strong>Afirmativa ${index + 1}:</strong> ${item.question}
                </p>
                <div class="question-options">
                    <button class="option-btn" data-value="true" data-question="${index}" aria-label="Verdadeiro">
                        <svg class="option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Verdadeiro
                    </button>
                    <button class="option-btn" data-value="false" data-question="${index}" aria-label="Falso">
                        <svg class="option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Falso
                    </button>
                </div>
                <div class="question-feedback" id="feedback-${index}"></div>
            `;
            quizQuestionsContainer.appendChild(questionEl);
        });

        // Esconde todas as perguntas exceto a primeira
        updateQuestionVisibility();
        attachQuizListeners();
        updateProgress();
    }

    function attachQuizListeners() {
        const optionButtons = quizQuestionsContainer.querySelectorAll('.option-btn');
        optionButtons.forEach(function (btn) {
            btn.addEventListener('click', handleAnswer);
        });
    }

    function handleAnswer(e) {
        if (quizState.answered) return;

        const btn = e.currentTarget;
        const selectedIndex = parseInt(btn.dataset.question, 10);
        const selectedValue = btn.dataset.value === 'true';
        const correctAnswer = quizData[selectedIndex].answer;

        // Verifica se é a pergunta atual
        if (selectedIndex !== quizState.currentQuestion) return;

        quizState.answered = true;

        // Marca o botão selecionado e o correto
        const allButtonsForQuestion = quizQuestionsContainer.querySelectorAll(
            `.option-btn[data-question="${selectedIndex}"]`
        );

        allButtonsForQuestion.forEach(function (b) {
            b.disabled = true;
            const bValue = b.dataset.value === 'true';
            if (bValue === correctAnswer) {
                b.classList.add('correct');
            }
            if (b === btn && selectedValue !== correctAnswer) {
                b.classList.add('incorrect');
            }
        });

        // Mostra feedback
        const feedback = document.getElementById(`feedback-${selectedIndex}`);
        const isCorrect = selectedValue === correctAnswer;
        feedback.innerHTML = `
            <strong>${isCorrect ? '✓ Resposta correta!' : '✗ Resposta incorreta.'}</strong><br>
            ${quizData[selectedIndex].explanation}
        `;
        feedback.classList.add('visible');
        if (isCorrect) {
            feedback.classList.add('correct');
            quizState.score++;
        } else {
            feedback.classList.add('incorrect');
        }

        // Avança para próxima pergunta ou mostra resultado
        if (quizState.currentQuestion < quizData.length - 1) {
            setTimeout(function () {
                quizState.currentQuestion++;
                quizState.answered = false;
                updateQuestionVisibility();
                updateProgress();
                // Scroll suave até a próxima pergunta
                const nextQuestion = quizQuestionsContainer.querySelector(
                    `.quiz-question[data-index="${quizState.currentQuestion}"]`
                );
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1800);
        } else {
            setTimeout(function () {
                showResult();
            }, 1800);
        }

        updateProgress();
    }

    function updateQuestionVisibility() {
        const questions = quizQuestionsContainer.querySelectorAll('.quiz-question');
        questions.forEach(function (q, i) {
            if (i === quizState.currentQuestion) {
                q.style.display = 'block';
            } else {
                // Mantém perguntas já respondidas visíveis acima, esconde as futuras abaixo
                if (i < quizState.currentQuestion) {
                    q.style.display = 'block';
                    q.style.opacity = '0.55';
                } else {
                    q.style.display = 'none';
                }
            }
        });
    }

    function updateProgress() {
        const total = quizData.length;
        const current = quizState.currentQuestion + 1;
        const percentage = ((quizState.currentQuestion + (quizState.answered ? 1 : 0)) / total) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = quizState.answered && quizState.currentQuestion === total - 1
            ? 'Quiz concluído!'
            : `Pergunta ${current} de ${total}`;
    }

    function showResult() {
        quizQuestionsContainer.style.display = 'none';
        quizResult.hidden = false;

        // Anima a contagem do placar
        const finalScore = quizState.score;
        let counter = 0;
        const increment = Math.max(1, Math.ceil(finalScore / 30));
        const counterInterval = setInterval(function () {
            counter += increment;
            if (counter >= finalScore) {
                counter = finalScore;
                clearInterval(counterInterval);
            }
            scoreNumber.textContent = counter;
        }, 40);

        let message = '';
        if (finalScore === 5) {
            message = 'Excelente! Você tem uma ótima compreensão sobre segurança digital. Compartilhe esse conhecimento com amigos e familiares!';
        } else if (finalScore === 4) {
            message = 'Muito bom! Você acertou quase tudo. Reveja as explicações das questões que errou para fixar o conteúdo.';
        } else if (finalScore === 3) {
            message = 'Bom começo! Você já sabe o básico, mas vale a pena revisar as dicas de prevenção deste site.';
        } else if (finalScore === 2) {
            message = 'Atenção! Você precisa reforçar seus conhecimentos sobre segurança digital. Reveja todas as seções deste site.';
        } else {
            message = 'Cuidado! Seus conhecimentos sobre segurança digital precisam melhorar. Leia com atenção as seções de "Como ocorreu" e "Prevenção" e refaça o quiz.';
        }

        resultMessage.textContent = message;
        progressFill.style.width = '100%';
        progressText.textContent = 'Quiz concluído!';
    }

    if (restartButton) {
        restartButton.addEventListener('click', function () {
            renderQuiz();
            // Scroll suave para o topo do quiz
            const quizSection = document.getElementById('quiz');
            if (quizSection) {
                quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Inicializa o quiz
    if (quizQuestionsContainer) {
        renderQuiz();
    }

    /* ============================================
       7. SMOOTH SCROLL para links âncora
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length <= 1) return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================
       8. ACESSIBILIDADE: tecla ESC fecha menu mobile
       ============================================ */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Log informativo no console
    console.log('%cCYBER CONSCIENTE — SIPAT 2026', 'color: #2563EB; font-size: 16px; font-weight: bold;');
    console.log('%cSite educativo sobre o ataque cibernético ao Ministério da Saúde (2021)', 'color: #6B7894;');
    console.log('%cDesenvolvido por: Raissa Landes Aguiar', 'color: #6B7894;');

})();