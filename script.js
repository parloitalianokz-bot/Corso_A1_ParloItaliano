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
    document.querySelectorAll('.section-block').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
    
    if(sectionId === 'sec-pres') document.getElementById('link-pres').classList.add('active');
    if(sectionId === 'sec-dial' || sectionId === 'sec-dial2') document.getElementById('link-dial').classList.add('active');
    if(sectionId === 'sec-testo') document.getElementById('link-testo').classList.add('active');
    if(sectionId === 'sec-storia') document.getElementById('link-storia').classList.add('active');
    if(sectionId === 'sec-gramm' || sectionId === 'sec-negativa') document.getElementById('link-gramm').classList.add('active');
    if(sectionId === 'sec-eser') document.getElementById('link-eser').classList.add('active');

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
        
        options.forEach(opt => opt.classList.remove('correct', 'incorrect'));
        
        if (selected) {
            if (selected.value === correct) {
                selected.parentElement.classList.add('correct');
                correctCount++;
            } else {
                selected.parentElement.classList.add('incorrect');
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
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        el.style.display = 'none';
    }
}

function toggleTrans(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

function showAnalysisStep() {
    const analysisSec = document.getElementById('analysis-section');
    const btn = document.getElementById('btn-show-analysis');
    analysisSec.style.display = 'block';
    btn.style.display = 'none';
    analysisSec.scrollIntoView({ behavior: 'smooth' });
}

function checkWrittenExercises() {
    const container = document.getElementById('ex-negativa-container');
    const inputs = container.querySelectorAll('input');
    let allCorrect = true;
    let errorCount = 0;

    inputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.getAttribute('data-answer').toLowerCase();
        
        if (userAnswer === "") {
            input.classList.remove('input-correct', 'input-wrong');
            allCorrect = false;
            return;
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
        feed.innerHTML = "Ci sono " + errorCount + " errori. (Есть ошибки.)";
        feed.style.color = "var(--secondary)";
    }
}

/* --- LOGICA GIOCO TABELLA --- */
let selectedChipElement = null;

function selectChip(element) {
    if (selectedChipElement === element) {
        element.classList.remove('selected');
        selectedChipElement = null;
        return;
    }
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');
    selectedChipElement = element;
}

function placeChip(cell) {
    if (!selectedChipElement) return;
    if (cell.children.length > 0) {
        const oldChip = cell.children[0];
        document.getElementById('word-pool').appendChild(oldChip);
    }
    selectedChipElement.classList.remove('selected');
    cell.appendChild(selectedChipElement);
    selectedChipElement = null;
}

function checkPuzzle() {
    let correctCount = 0;
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        const correctVal = zone.getAttribute('data-correct');
        const chip = zone.querySelector('.chip');
        zone.classList.remove('correct', 'wrong');
        if (chip && chip.getAttribute('data-val') === correctVal) {
            zone.classList.add('correct');
            correctCount++;
        } else {
            zone.classList.add('wrong');
        }
    });
    const feedback = document.getElementById('puzzle-feedback');
    feedback.innerHTML = correctCount === dropZones.length ? "🎉 Bravissimo!" : `⚠️ Hai indovinato ${correctCount} su ${dropZones.length}`;
}

window.onload = function() {
    const pool = document.getElementById('word-pool');
    if(pool) {
        for (let i = pool.children.length; i >= 0; i--) {
            pool.appendChild(pool.children[Math.random() * i | 0]);
        }
    }
};

/* --- LOGICA IA --- */
async function checkSentencesWithAI() {
    const s1 = document.getElementById('sent-aig').value;
    const s2 = document.getElementById('sent-kir').value;
    const s3 = document.getElementById('sent-zar').value;
    const s4 = document.getElementById('sent-bek').value;
    
    const feedbackBox = document.getElementById('ai-sentence-feedback');
    const responseText = document.getElementById('ai-response-text');
    const loader = document.getElementById('ai-loader-sent');

    if (s1.length < 3) {
        alert("Scrivi almeno la prima frase!");
        return;
    }

    feedbackBox.style.display = 'block';
    loader.style.display = 'block';
    responseText.innerHTML = '';

    // --- CHIAVE SPEZZATA ---
    const parte1 = "gsk_JIVLceY7fQCdXU1obYbVWGdyb"; // Lascia gsk_ qui
    const parte2 = "3FY3cDON97fg3C07nAqsOPK72xZ"; // Incolla il resto (senza gsk_)
    const API_KEY = parte1 + parte2;

    const prompt = `
    Sei Antonio, l'insegnante della scuola "Parlo Italiano". 
    Il tuo tono è empatico, incoraggiante. Rivolgiti per ogni informazione o correzione sempre in russo dando del Vy

    REGOLE DI LINGUA E GENERE:
    1. Usa un linguaggio neutro per il genere: non dire "Bravo" o "Benvenuto". Usa "Ottimo lavoro!", "Complimenti!", "Benissimo!".
    2. Ogni singola spiegazione o frase di incoraggiamento DEVE essere in russo.
    
    QUESTA È LA TUA BASE DI CONOSCENZA (LA VERITÀ):
    - Scuola: "Parlo Italiano", online, moderna, ad Almaty (Kazakistan).
    - Aigerim: Studentessa, KAZAKA, CASALINGA. Studia perché ama la CUCINA ITALIANA.
    - Kirill: Studente, RUSSO, PROGRAMMATORE. Studia perché lavora per una COMPAGNIA ITALIANA.
    - Zarina: Studentessa, UZBEKA, INFERMIERA. Studia perché SOGNA DI VISITARE ROMA.
    - Bekzat: Studente, KAZAKO, CUOCO. Studia perché lavora in un RISTORANTE ITALIANO.
    - Antonio (Tu): Insegnante, sposato, due figlie, paziente e disponibile.

    COMPITO DELLO STUDENTE:
    Lo studente deve correggere delle affermazioni false usando la struttura negativa/affermativa.
    Esempio richiesto: "Aigerim non è russa, è kazaka."

    COSA DEVI VERIFICARE:
    1. Correttezza dei dati: Lo studente dice la verità basata sui profili sopra?
    2. Correttezza grammaticale: Uso di "non", coniugazione del verbo essere (è/sono), articoli.
    3. Correttezza ortografica: Accenti (è vs e), doppie, nomi propri.
    4. Coerenza: Ha risposto a ciò che è stato chiesto?

    COME DEVI RISPONDERE: 
    1. Per ogni frase dello studente:
       - Se corretta: ✅ + "Ottimo lavoro! (Превосходная работа!)"
       - Se c'è un errore: ❌ + Spiegazione BREVISSIMA SOLO IN RUSSO + Frase corretta in GRASSETTO.
    2. Se lo studente dimentica "Non è... è...", digli in russo che deve usare quella struttura.
    3. Mai usare termini troppo tecnici o scolastici come "sostantivo femminile" o "struttura negativa-affermativa". Parla come un amico che aiuta.   


    FORMATTAZIONE HTML:
    Nome personaggio:
    <br><b>Frase corretta in italiano</b>
    <br>Commento breve bilingue o solo russo.
    <hr>

    CONCLUSIONE:
    Deve essere incoraggiante e rigorosamente bilingue.
    "Ricorda, l'importante è imparare e divertirsi! Continua così!" 
    = "Помни, главное — учиться с удовольствием! Так держать!"

    TESTI DELLO STUDENTE:
    1. ${s1}
    2. ${s2}
    3. ${s3}
    4. ${s4}
    `;
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        responseText.innerHTML = data.choices[0].message.content.replace(/\n/g, '<br>');
    } catch (error) {
        responseText.innerHTML = "<span style='color:red'>Errore: " + error.message + "</span>";
    } finally {
        loader.style.display = 'none';
    }
}
