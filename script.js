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
    // 1. Nascondi tutte le sezioni e mostra quella richiesta
    document.querySelectorAll('.section-block').forEach(sec => sec.classList.remove('active'));
    
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
    }

    // 2. Resetta tutti i link del menu (spegni tutto)
    document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));

    // 3. Logica di abbinamento (Sezione -> Voce Menu)
    if(sectionId === 'sec-pres') 
        document.getElementById('link-pres').classList.add('active');

    if(sectionId === 'sec-dial' || sectionId === 'sec-dial2') 
        document.getElementById('link-dial').classList.add('active');

    if(sectionId === 'sec-testo' || sectionId === 'sec-storia') 
        document.getElementById('link-testo').classList.add('active');

    if(sectionId === 'sec-negativa' || sectionId === 'sec-gramm_non') 
        document.getElementById('link-negativa').classList.add('active');

    if(sectionId === 'sec-riordino' || sectionId === 'sec-gramm_TuLei') 
        document.getElementById('link-riordino').classList.add('active');

    if(sectionId === 'sec-gramm_essere') 
        document.getElementById('link-essere').classList.add('active');

    if(sectionId === 'sec-eser') 
        document.getElementById('link-eser').classList.add('active');


    // 4. CHIUSURA MENU SU MOBILE (Corretta)
    const overlay = document.getElementById("overlayBg");
    
    // Controlliamo se siamo su uno schermo piccolo
    if (window.innerWidth < 992) {
        // Usa window.getComputedStyle per vedere se l'overlay è DAVVERO visibile (anche via CSS)
        if (overlay && window.getComputedStyle(overlay).display === "block") {
            toggleMenu(); 
        }
    }
    
    // 5. Torna in cima alla pagina
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
res.querySelector('.score-text').innerText = "Risultato: " + score + "% (Результат)";
const feedTxt = res.querySelector('.feedback-text');

if (score === 100) {
    feedTxt.innerText = "Eccellente! (Отлично!) 🌟";
    res.style.borderColor = "var(--primary)";
} else if (score >= 50) {
    feedTxt.innerText = "Bravo! Quasi perfetto. (Молодец! Почти идеально.) 👍";
    res.style.borderColor = "#f1c40f"; // colore incoraggiante
} else {
    feedTxt.innerText = "Riprova! Puoi fare di meglio. (Попробуйте еще раз! Вы можете лучше.) 🔄";
    res.style.borderColor = "var(--secondary)";
}
  
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

// Nuova funzione per gestire il clic su chip posizionate (in tabella)
function chipClickedInTable(chip) {
    // Deseleziona chip se selezionata
    if (selectedChipElement === chip) {
        chip.classList.remove('selected');
        selectedChipElement = null;
        return;
    }
    // Se selezioniamo un'altra chip, deselect vecchia
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedChipElement = chip;
}

// Modifica il posto di aggiunta dei listener:
// Per ogni chip, aggiungi onclick sia nella pool che in tabella:

document.querySelectorAll('.chip').forEach(chip => {
    chip.onclick = function() {
        if (chip.parentElement.classList.contains('drop-zone')) {
            // Se la chip è già in tabella, cliccandoci sopra la rimetti nel pool
            document.getElementById('word-pool').appendChild(chip);
            chip.classList.remove('selected');
            if (selectedChipElement === chip) {
                selectedChipElement = null;
            }
        } else {
            // Chip nel pool: seleziona/deseleziona per posizionarla
            if (selectedChipElement === chip) {
                chip.classList.remove('selected');
                selectedChipElement = null;
            } else {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                selectedChipElement = chip;
            }
        }
    };
});

function placeChip(cell) {
    if (!selectedChipElement) return;
    if (cell.children.length > 0) {
        // Sposta chip esistente nel pool
        const oldChip = cell.children[0];
        document.getElementById('word-pool').appendChild(oldChip);
    }
    // Sposta chip selezionata nella cella cliccata
    selectedChipElement.classList.remove('selected');
    cell.appendChild(selectedChipElement);
    selectedChipElement = null;
}

// Aggiungi questo, per togliere la chip dal cell cliccata e rimetterla nel pool
function removeChipFromCell(chip) {
    if (selectedChipElement === chip) {
        chip.classList.remove('selected');
        selectedChipElement = null;
        return;
    }
    // Seleziona la chip per spostarla
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedChipElement = chip;
}


/* --- CONTROLLA ESERCIZIO TABELLA NEGATIVI --- */
function resetPuzzle() {
    // Riporta tutte le chip nel pool
    const wordPool = document.getElementById('word-pool');
    // Prendi tutte le chip dentro la tabella e spostale nel pool
    document.querySelectorAll('.drop-zone .chip').forEach(chip => {
        wordPool.appendChild(chip);
    });
    // Rimuovi classi di feedback dalle drop-zone
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('correct', 'wrong');
    });
    // Pulisci feedback
    const feedback = document.getElementById('puzzle-feedback');
    feedback.innerHTML = '';
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
    if (correctCount === dropZones.length) {
        feedback.innerHTML = "🎉 Bravissimo! Отлично!";
    } else {
        feedback.innerHTML = `⚠️ Hai indovinato ${correctCount} su ${dropZones.length}.<br>Вы угадали ${correctCount} из ${dropZones.length}. <br>` +
            `<button onclick="resetPuzzle()" style="margin-top:10px; padding: 6px 14px; font-weight: 600; cursor: pointer; border-radius: 8px; background-color: #f39c12; color: white; border:none;">Попробуйте еще раз</button>`;
    }
}





/* --- MOTORE IA COMUNE --- */
async function callAI(prompt, responseElement, loaderElement) {
    // --- CHIAVE SPEZZATA ---
    const parte1 = "gsk_JIVLceY7fQCdXU1obYbVWGdyb"; // La tua chiave
    const parte2 = "3FY3cDON97fg3C07nAqsOPK72xZ"; 
    const API_KEY = parte1 + parte2;

    loaderElement.style.display = 'block';
    responseElement.innerHTML = '';

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
        
        // Formattazione base della risposta
        responseElement.innerHTML = data.choices[0].message.content.replace(/\n/g, '<br>');
    } catch (error) {
        responseElement.innerHTML = "<span style='color:red'>Errore: " + error.message + "</span>";
    } finally {
        loaderElement.style.display = 'none';
    }
}

 /* IA RACCONTAMI UNA STORIA */
async function checkStoryWithAI() {
    const story = document.getElementById('ai-story-input').value;
    if (story.length < 10) { alert("Scrivi qualcosa di più! (Напиши немного больше!)"); return; }

    const feedbackContainer = document.getElementById('ai-feedback-story'); // Assicurati che l'ID esista nell'HTML
    feedbackContainer.style.display = 'block';

    const prompt = `
    Sei Antonio, l'insegnante di "Parlo Italiano". 
    OBIETTIVO: Valuta la COMPRENSIBILITÀ della storia dello studente.

    QUESTA È LA TUA BASE DI CONOSCENZA (LA VERITÀ) SULLA BASE DEL SEGUENTE TESTO CHE HA LETTO ANCHE LO STUDENTE:
La scuola "Parlo Italiano" è ad Almaty, in Kazakistan.
È una scuola moderna, perfetta per studenti russofoni perché è online.
Chi sono gli studenti della scuola “Parlo Italiano"?
Aigerim è una studentessa. È kazaka. È casalinga. Studia l'italiano perché ama la cucina italiana.
Kirill è uno studente della scuola. Kirill è russo; è programmatore. Studia l'italiano perché lavora in una compagnia italiana.
Zarina è una studentessa della scuola. Zarina è uzbeka; è infermiera. Studia l'italiano perché sogna di visitare Roma.
Bekzat è uno studente della scuola. Bekzat è kazako; è cuoco. Studia l'italiano perché lavora in un ristorante italiano.
Antonio Marini è l'insegnante della scuola "Parlo Italiano". È sposato e ha due figlie. È un bravo insegnante perché è paziente e sempre disponibile con gli studenti. 😉

REGOLE:
1. Se il messaggio è comprensibile per un italiano, sii entusiasta!
2. Non punire ogni piccolo errore grammaticale (es. se scrive "scuola online" invece di "la scuola è online", fai presente e correggi esaustivamente punto per punto ma spiega che non inficia la comprensione).
3. Spiega eventuali correzioni solo se l'errore cambia il senso della frase o la rende poco comprensibile
4. Verifica la corrsipondenza di quanto scritto dallo studente con la verità del testo
5. Rispondi SEMPRE in russo per le spiegazioni e i complimenti.
6. Rivolgiti allo studente sempre in maniera formale quando scrivi in russo. Ma non essere troppo pomposo. Mantieni un tono rispettoso ma amichevole e sereno.

FORMA DELLA RISPOSTA:
- 1) Scrivi un messaggio empatico di incoraggiamento in russo, empatico ed elogia se è comprensibile, conforta se invece non è riuscito a essere comprensibile.
- 2) Per ogni frase o parte sbagliata, usa "❌" prima della parte errata.  Poi vai a capo.
- 3) In seguito quando dai la correzione in italiano usa "✅" prima della parte corretta. in italiano. Poi vav a  capo.P
- 4) Per ogni spiegazione breve in russo, usa "📚" prima della spiegazione. Fai notare se l'errore ha inficiato o meno la compresnibilità. Poi vai a capo.
- 5) Terminate le correzioni dai una sintesi in russo chiara e empatica. Ricorda che la priorità è la comunicazione sulla perfezione.
- 6) Alla fine, fornisci la versione corretta del testo in un blocco separato.

TESTO DELLO STUDENTE:
"${story}"

<b>Rispondi con questo formato rigorosamente, le spiegazioni devono essere date in russo.</b>
`;


    callAI(prompt, document.getElementById('ai-response-story'), document.getElementById('ai-loader-story'));
}






/* --- LOGICA IA FRASI NEGATIVE--- */
async function checkFullSentencesWithAI() {
  const s1 = document.getElementById('full-sent1').value;
  const s2 = document.getElementById('full-sent2').value;
  const s3 = document.getElementById('full-sent3').value;

  if (s1.length < 3 || s2.length < 3 || s3.length < 3) {
    alert("Per favore, completa tutte le frasi. Пожалуйста, заполните все предложения.");
    return;
  }

  const feedbackBox = document.getElementById('ai-full-neg-feedback');
  const loader = document.getElementById('ai-loader-neg');
  const response = document.getElementById('ai-response-neg');

  feedbackBox.style.display = 'block';
  loader.style.display = 'block';
  response.innerHTML = '';

  const prompt = `
Sei Antonio, l'insegnante della scuola "Parlo Italiano". Usa un tono empatico e spiega in russo gli errori.
Lo studente ha scritto queste frasi da correggere:

1) ${s1}
2) ${s2}
3) ${s3}

Verifica che la struttura negativa sia corretta, soprattutto l'uso di "non" prima del verbo.

Per ogni frase:
- Se giusta, metti ✅ prima e fai complimenti in russo.
- Se sbagliata, metti ❌ prima, spiega in russo e dai la versione corretta in italiano formattata.

Rispondi SOLO in russo ed italiano, sii chiaro e incoraggiante.
`;

  await callAI(prompt, response, loader);
}



function checkSimpleNegation() {
  const inputs = document.querySelectorAll('#sec-negativa .context-box input.input-inline.short');
  let allCorrect = true;
  let errorCount = 0;

  inputs.forEach(input => {
    const val = input.value.trim().toLowerCase();
    const correct = input.getAttribute('data-answer').toLowerCase();
    if (val === '') {
      input.classList.remove('input-correct', 'input-wrong');
      allCorrect = false;
    } else if (val === correct) {
      input.classList.add('input-correct');
      input.classList.remove('input-wrong');
    } else {
      input.classList.add('input-wrong');
      input.classList.remove('input-correct');
      allCorrect = false;
      errorCount++;
    }
  });

  const feedback = document.getElementById('simple-neg-feedback');
  if (allCorrect) {
    feedback.style.color = 'var(--primary)';
    feedback.textContent = "Ben fatto! Hai inserito 'non' correttamente. Отлично!";
  } else if (errorCount > 0) {
    feedback.style.color = 'var(--secondary)';
    feedback.textContent = `Ci sono ${errorCount} errori. Попробуйте еще раз.`;
  } else {
    feedback.textContent = '';
  }
}

let currentSelectedPhrase = null;


/* FUNZIONE RIORDINO DIALOGHI */

function pickPhrase(el) {
    document.querySelectorAll('.chip-phrase').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    currentSelectedPhrase = el;
}

function placePhrase(slot) {
    if (!currentSelectedPhrase) return;
    
    // Se lo slot è già occupato, rimetti la vecchia frase nel pool
    if (slot.children.length > 0) {
        const oldPhrase = slot.children[0];
        const poolId = slot.closest('.dialogue-order-container').querySelector('.phrases-pool').id;
        document.getElementById(poolId).appendChild(oldPhrase);
    }

    slot.appendChild(currentSelectedPhrase);
    currentSelectedPhrase.classList.remove('selected');
    currentSelectedPhrase = null;
}

function checkDialogues() {
    let allCorrect = true;
    const slots = document.querySelectorAll('.slot.drop-target');
    
    slots.forEach(slot => {
        const rank = slot.getAttribute('data-rank');
        const phrase = slot.querySelector('.chip-phrase');
        
        slot.classList.remove('correct', 'wrong');
        
        if (phrase && phrase.getAttribute('data-order') === rank) {
            slot.classList.add('correct');
        } else {
            slot.classList.add('wrong');
            allCorrect = false;
        }
    });

    const feedback = document.getElementById('dialogue-feedback');
    feedback.innerText = allCorrect ? "🎉 Bravissimo! Dialoghi perfetti!" : "⚠️ Qualcosa non torna. Controlla i riquadri rossi!";
    feedback.style.color = allCorrect ? "#27ae60" : "#e74c3c";
}


// Dati per il gioco di abbinamento
const matchingData = [
    { id: 1, it: "Aigerim è kazaka", ru: "Айгерим — казашка" },
    { id: 2, it: "Tu sei Bekzat?", ru: "Ты Бекзат?" },
    { id: 3, it: "Io sono Zarina", ru: "Я Зарина" },
    { id: 4, it: "Noi siamo studenti", ru: "Мы — студенты" }, // Accorciato per leggibilità su mobile
    { id: 5, it: "Voi siete studenti?", ru: "Вы студенты?" },
    { id: 6, it: "Io non sono italiana", ru: "Я не итальянка" },
    { id: 7, it: "Zarina e Bekzat sono sposati", ru: "Зарина и Бекзат — женаты" },
    { id: 8, it: "Kirill è russo", ru: "Кирилл — русский" }
];

let selectedIt = null;
let selectedRu = null;

// Funzione per inizializzare il gioco
function initMatchingGame() {
    const colIt = document.getElementById('col-it');
    const colRu = document.getElementById('col-ru');
    
    // Se non trova gli elementi (magari siamo in un'altra pagina), esce
    if (!colIt || !colRu) return;

    colIt.innerHTML = '';
    colRu.innerHTML = '';

    // Mischiamo solo l'array per la colonna Russa
    // Creiamo una copia per non rovinare l'originale
    const ruList = [...matchingData].sort(() => Math.random() - 0.5);
    
    // Generiamo colonna Italiana (ordine fisso o random, qui fisso da array originale)
    matchingData.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'match-item';
        btn.textContent = item.it;
        btn.dataset.id = item.id;
        btn.dataset.type = 'it';
        btn.onclick = () => handleMatchClick(btn);
        colIt.appendChild(btn);
    });

    // Generiamo colonna Russa (ordine mischiato)
    ruList.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'match-item';
        btn.textContent = item.ru;
        btn.dataset.id = item.id;
        btn.dataset.type = 'ru';
        btn.onclick = () => handleMatchClick(btn);
        colRu.appendChild(btn);
    });
}

function handleMatchClick(el) {
    // Se è già risolto, ignora
    if (el.classList.contains('solved')) return;

    const type = el.dataset.type;

    // Gestione selezione
    if (type === 'it') {
        if (selectedIt) selectedIt.classList.remove('selected');
        selectedIt = el;
        el.classList.add('selected');
    } else {
        if (selectedRu) selectedRu.classList.remove('selected');
        selectedRu = el;
        el.classList.add('selected');
    }

    // Se entrambi sono selezionati, controlla
    if (selectedIt && selectedRu) {
        checkMatch();
    }
}

function checkMatch() {
    const idIt = selectedIt.dataset.id;
    const idRu = selectedRu.dataset.id;
    const feedback = document.getElementById('match-feedback');

    if (idIt === idRu) {
        // MATCH CORRETTO
        selectedIt.classList.remove('selected');
        selectedRu.classList.remove('selected');
        
        selectedIt.classList.add('solved');
        selectedRu.classList.add('solved');

        selectedIt = null;
        selectedRu = null;
        
        feedback.textContent = "✨ Corretto! (Правильно!)";
        feedback.style.color = "#27ae60";

        // Controlla se tutti sono risolti
        const allSolved = document.querySelectorAll('.match-item.solved').length;
        if (allSolved === matchingData.length * 2) {
            feedback.innerHTML = "🎉 Bravissimo! Hai completato tutto! <br> (Отлично! Вы все выполнили!)";
        }

    } else {
        // MATCH ERRATO
        selectedIt.classList.add('error');
        selectedRu.classList.add('error');
        feedback.textContent = "❌ No, riprova... (Нет, попробуйте еще раз...)";
        feedback.style.color = "#e74c3c";

        setTimeout(() => {
            selectedIt.classList.remove('error', 'selected');
            selectedRu.classList.remove('error', 'selected');
            selectedIt = null;
            selectedRu = null;
            feedback.textContent = "";
        }, 800);
    }
}

// Avvia il gioco quando la pagina è caricata
document.addEventListener('DOMContentLoaded', initMatchingGame);


// --- LOGICA TABELLA VERBO ESSERE (Click & Place) ---

let currentVerbChip = null;

function selectVerbChip(el) {
    // Se clicco su uno già usato, ignora
    if (el.classList.contains('used')) return;

    // Deseleziona precedenti
    document.querySelectorAll('.vm-chip').forEach(c => c.classList.remove('selected'));

    // Se clicco lo stesso, deseleziona
    if (currentVerbChip === el) {
        currentVerbChip = null;
        return;
    }

    // Seleziona nuovo
    currentVerbChip = el;
    el.classList.add('selected');
}

function placeVerbChip(slot) {
    // Se non ho selezionato nulla, avvisa o esci
    if (!currentVerbChip) {
        // Se lo slot è pieno, svuotalo (rimetti chip in gioco)
        if (slot.classList.contains('filled')) {
            const val = slot.textContent;
            slot.textContent = '';
            slot.classList.remove('filled', 'correct', 'error');
            
            // Riabilita una chip con quel valore
            const chips = document.querySelectorAll('.vm-chip.used');
            for (let chip of chips) {
                if (chip.dataset.val === val) {
                    chip.classList.remove('used');
                    break; 
                }
            }
        }
        return;
    }

    // Se lo slot è già pieno, prima svuotalo (swap logico semplificato: sovrascrivi)
    if (slot.classList.contains('filled')) {
        const oldVal = slot.textContent;
        // Riabilita vecchia chip
        const usedChips = document.querySelectorAll('.vm-chip.used');
        for (let chip of usedChips) {
            if (chip.dataset.val === oldVal) {
                chip.classList.remove('used');
                break;
            }
        }
    }

    // Inserisci valore
    slot.textContent = currentVerbChip.dataset.val;
    slot.classList.add('filled');
    
    // Segna chip come usata
    currentVerbChip.classList.remove('selected');
    currentVerbChip.classList.add('used');
    currentVerbChip = null;
}

function checkVerbTable() {
    const slots = document.querySelectorAll('.vm-slot');
    let errors = 0;
    let filled = 0;

    slots.forEach(slot => {
        if (!slot.classList.contains('filled')) return;
        
        filled++;
        const userVal = slot.textContent.trim();
        const correctVal = slot.dataset.correct;

        // Reset classi
        slot.classList.remove('correct', 'error');

        if (userVal === correctVal) {
            slot.classList.add('correct');
        } else {
            slot.classList.add('error');
            errors++;
        }
    });

    const feedback = document.getElementById('vm-feedback');
    
    if (filled < slots.length) {
        feedback.textContent = "⚠️ Completa tutta la tabella prima! (Заполните всю таблицу!)";
        feedback.style.color = "#d35400";
    } else if (errors === 0) {
        feedback.innerHTML = "🌟 Perfetto! Bravissimo! (Идеально! Молодец!)";
        feedback.style.color = "#27ae60";
    } else {
        feedback.textContent = `⚠️ Ci sono ${errors} errori. Riprova! (Есть ошибки. Попробуйте еще раз!)`;
        feedback.style.color = "#e74c3c";
    }
}



