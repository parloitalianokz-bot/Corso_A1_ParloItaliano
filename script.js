function toggleMenu() {
    const sidebar = document.getElementById("mySidebar");
    const overlay = document.getElementById("overlayBg");
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-280px";
        overlay.style.display = "none";
    } else {
        sidebar.style.left = "0px";
        overlay.style.display = "block";
    }
}

function showSection(sectionId) {
    // Nascondi tutte le sezioni
    document.querySelectorAll('.section-block').forEach(sec => sec.classList.remove('active'));
    // Mostra quella richiesta
    document.getElementById(sectionId).classList.add('active');
    
    // Aggiorna menu (evidenzia la voce corrente)
    document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
    
    if(sectionId === 'sec-pres') document.getElementById('link-pres').classList.add('active');
    if(sectionId === 'sec-dial' || sectionId === 'sec-dial2') document.getElementById('link-dial').classList.add('active');
    if(sectionId === 'sec-testo') document.getElementById('link-testo').classList.add('active');
    
    // NUOVA RIGA PER LA STORIA
    if(sectionId === 'sec-storia') document.getElementById('link-storia').classList.add('active');
    
    // Nota: sec-negativa usa lo stesso link di grammatica
    if(sectionId === 'sec-gramm' || sectionId === 'sec-negativa') document.getElementById('link-gramm').classList.add('active');
    if(sectionId === 'sec-eser') document.getElementById('link-eser').classList.add('active');

    // Chiudi il menu SOLO se è aperto (style.left === "0px")
    const sidebar = document.getElementById("mySidebar");
    if (window.innerWidth < 800 && sidebar.style.left === "0px") {
        toggleMenu();
    }

    window.scrollTo(0,0);
}

function checkQuiz(quizId, resultId) {
    const quizContainer = document.getElementById(quizId);
    const containers = quizContainer.querySelectorAll('.options');
    let correctCount = 0;
    
    containers.forEach(container => {
        const selected = container.querySelector('input:checked');
        const correct = container.getAttribute('data-correct');
        const options = container.querySelectorAll('.option');
        
        // Reset classi
        options.forEach(opt => opt.classList.remove('correct', 'incorrect'));
        
        // Se l'utente ha selezionato qualcosa
        if (selected) {
            if (selected.value === correct) {
                // Risposta giusta -> Verde
                selected.parentElement.classList.add('correct');
                correctCount++;
            } else {
                // Risposta sbagliata -> Rossa
                selected.parentElement.classList.add('incorrect');
                
                // Mostra anche quale era quella giusta
                options.forEach(opt => {
                    if (opt.querySelector('input').value === correct) {
                        opt.classList.add('correct');
                    }
                });
            }
        }
    });

    const score = Math.round((correctCount / containers.length) * 100);
    const res = document.getElementById(resultId);
    res.style.display = 'block';
    res.querySelector('.score-text').innerText = "Risultato: " + score + "%";
    const feedTxt = res.querySelector('.feedback-text');
    feedTxt.innerText = score === 100 ? "Eccellente! (Отлично!)" : "Riprova! (Попробуйте еще раз)";
    res.style.borderColor = score === 100 ? "var(--primary)" : "var(--secondary)";
}

function toggleTranscript(id) {
    const el = document.getElementById(id);
    if (el.style.display === 'none' || el.style.display === '') {
        el.style.display = 'block';
        // Scorre leggermente verso il testo
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        el.style.display = 'none';
    }
}

function toggleTrans(id) {
    const el = document.getElementById(id);
    if (el.style.display === 'block') {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }
}

function showAnalysisStep() {
    const analysisSec = document.getElementById('analysis-section');
    const btn = document.getElementById('btn-show-analysis');
    
    analysisSec.style.display = 'block';
    btn.style.display = 'none'; // Nasconde il pulsante blu dopo averlo cliccato
    
    // Scorre dolcemente verso la nuova sezione
    analysisSec.scrollIntoView({ behavior: 'smooth' });
}

function toggleAnswer(btn) {
    // Trova il div della risposta subito dopo il bottone
    const answerDiv = btn.nextElementSibling;
    
    if (answerDiv.style.display === "block") {
        answerDiv.style.display = "none";
        btn.innerText = "Vedi risposta (Показать ответ)";
        btn.style.background = "#ecf0f1";
        btn.style.color = "#7f8c8d";
    } else {
        answerDiv.style.display = "block";
        btn.innerText = "Nascondi (Скрыть)";
        btn.style.background = "#27ae60";
        btn.style.color = "white";
    }
}

function checkWrittenExercises() {
    const container = document.getElementById('ex-negativa-container');
    const inputs = container.querySelectorAll('input');
    let allCorrect = true;
    let errorCount = 0;

    inputs.forEach(input => {
        // Pulisce spazi extra e mette tutto minuscolo
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.getAttribute('data-answer').toLowerCase();
        
        // Controlliamo se è vuoto
        if (userAnswer === "") {
            input.classList.remove('input-correct', 'input-wrong');
            allCorrect = false;
            return; // Passa al prossimo
        }

        if (userAnswer === correctAnswer) {
            input.classList.remove('input-wrong');
            input.classList.add('input-correct');
        } else {
            input.classList.remove('input-correct');
            input.classList.add('input-wrong');
            allCorrect = false;
            errorCount++;
        }
    });

    const feed = document.getElementById('written-feedback');
    if (allCorrect) {
        feed.innerHTML = "Fantastico! Hai completato tutto correttamente! 🎉 (Отлично!)";
        feed.style.color = "var(--primary)";
    } else if (errorCount > 0) {
        feed.innerHTML = "Ci sono " + errorCount + " errori. Controlla le caselle rosse. (Есть ошибки. Проверьте красные поля.)";
        feed.style.color = "var(--secondary)";
    } else {
         feed.innerHTML = "Completa gli esercizi prima di controllare. (Заполните поля.)";
         feed.style.color = "#f39c12";
    }
}

    /* --- LOGICA GIOCO TABELLA (TAP & PLACE) --- */
let selectedChipElement = null;

function selectChip(element) {
    // Se clicco su una chip già selezionata, la deseleziono
    if (selectedChipElement === element) {
        element.classList.remove('selected');
        selectedChipElement = null;
        return;
    }

    // Rimuovi selezione dagli altri
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    
    // Seleziona quella nuova
    element.classList.add('selected');
    selectedChipElement = element;
}

function placeChip(cell) {
    // Se non ho selezionato nulla, non faccio nulla
    if (!selectedChipElement) return;

    // Se la cella ha già un figlio (una chip), lo rimandiamo al pool
    if (cell.children.length > 0) {
        const oldChip = cell.children[0];
        document.getElementById('word-pool').appendChild(oldChip);
    }

    // Sposta la chip nella cella
    selectedChipElement.classList.remove('selected');
    cell.appendChild(selectedChipElement);
    
    // Resetta selezione
    selectedChipElement = null;
}

function checkPuzzle() {
    let correctCount = 0;
    const dropZones = document.querySelectorAll('.drop-zone');
    const total = dropZones.length;

    dropZones.forEach(zone => {
        const correctVal = zone.getAttribute('data-correct');
        const chip = zone.querySelector('.chip');

        // Resetta classi
        zone.classList.remove('correct', 'wrong');

        if (chip) {
            const userVal = chip.getAttribute('data-val');
            if (userVal === correctVal) {
                zone.classList.add('correct');
                correctCount++;
            } else {
                zone.classList.add('wrong');
                // Opzionale: se vuoi che torni indietro quando sbagli
                // document.getElementById('word-pool').appendChild(chip);
            }
        } else {
            // Cella vuota considerata errore
            zone.classList.add('wrong');
        }
    });

    const feedback = document.getElementById('puzzle-feedback');
    if (correctCount === total) {
        feedback.innerHTML = "🎉 Bravissimo! Tutto corretto! (Отлично! Все верно!)";
        feedback.style.color = "green";
    } else {
        feedback.innerHTML = `⚠️ Hai indovinato ${correctCount} su ${total}. Riprova i rossi!`;
        feedback.style.color = "orange";
    }
}

    // Funzione per mescolare i div all'avvio
window.onload = function() {
    const pool = document.getElementById('word-pool');
    if(pool) {
        for (let i = pool.children.length; i >= 0; i--) {
            pool.appendChild(pool.children[Math.random() * i | 0]);
        }
    }
};

async function checkSentencesWithAI() {
    const s1 = document.getElementById('sent-aig').value;
    const s2 = document.getElementById('sent-kir').value;
    const s3 = document.getElementById('sent-zar').value;
    const s4 = document.getElementById('sent-bek').value;
    
    const feedbackBox = document.getElementById('ai-sentence-feedback');
    const loader = document.getElementById('ai-loader-sent');
    const responseText = document.getElementById('ai-response-text');

    // Controllo se l'utente ha scritto qualcosa (almeno le prime due frasi)
    if (s1.length < 3 && s2.length < 3) {
        alert("Scrivi almeno le prime due frasi! (Напишите хотя бы первые два предложения!)");
        return;
    }

    feedbackBox.style.display = 'block';
    loader.style.display = 'block';
    responseText.innerHTML = '';

    // LA TUA CHIAVE E' QUI:
    const API_KEY = "AIzaSyCFVxX3AmcnauR-Hu4kQZzlUzCIX6AnJwI"; 

    // Costruiamo il Prompt con la "Verità"
    const prompt = `
    Sei un insegnante di italiano. 
    Dati corretti (Verità):
    1. Aigerim: è Kazaka (NON è russa).
    2. Kirill: è Programmatore (NON è studente).
    3. Zarina: è Uzbeka (NON è inglese).
    4. Bekzat: Studia per Lavoro (NON per turismo).

    Lo studente deve scrivere frasi usando la struttura "NON È X, È Y".
    
    Frasi dello studente:
    1. ${s1}
    2. ${s2}
    3. ${s3}
    4. ${s4}

    Analizza ogni frase.
    Se la frase è vuota, ignorala.
    Per ogni frase scritta:
    - Se è corretta (grammatica E fatti), metti ✅ e un complimento breve in russo.
    - Se è sbagliata (grammatica O fatti), metti ❌, spiega l'errore in RUSSO e scrivi la frase corretta in italiano.
    
    Usa formattazione HTML semplice (<br>, <b>).
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const aiReply = data.candidates[0].content.parts[0].text;
        
        // Formattazione per visualizzazione
        responseText.innerHTML = aiReply.replace(/\n/g, '<br>');

    } catch (error) {
        responseText.innerHTML = "Errore di connessione (Ошибка): " + error.message;
        console.error(error);
    } finally {
        loader.style.display = 'none';
    }
}





