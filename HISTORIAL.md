# Historial de Signals

Aquest document explica **tot el que hem anat fent i decidint**, sessió a
sessió, en paraules senzilles. Serveix perquè qualsevol Claude, en qualsevol
ordinador o conversa, sàpiga on som, què s'ha decidit i què **no** s'ha de
tornar a fer.

- **Claude:** llegeix-lo sencer a l'inici de cada sessió, després de `CLAUDE.md`.
  En acabar la sessió, afegeix-hi una entrada nova a sota (la més recent al
  final), amb la data, què s'ha fet, què s'ha decidit i què s'ha descartat.
- **Helena:** el pots llegir quan vulguis. Si en una altra conversa vols fer
  referència a alguna cosa, pots dir per exemple *"com vam decidir el 29/10
  amb l'avatar"*.

Els detalls de cada nivell són a la seva llibreta
(`src/levels/NN-nom/README.md`). Les decisions generals del joc són a
`CLAUDE.md`. Aquí hi ha el fil de tot plegat.

---

## On som ara (actualitzat el 29/10/2026)

- **Nivell 1 (Game & Chat):** pas 2 de 6. Es pot jugar de principi a final.
  Cada partida és diferent (llocs, cel, amics, missatges). L'avatar de perfil
  s'ha redibuixat peça a peça. Falta que Helena hi jugui i ho aprovi per donar
  el pas 2 per fet i passar a ajustar la dificultat (pas 3).
- **Avatar:** refet de zero el 29/10 perquè sigui mono. Hi ha **dos
  dibuixos**: el de l'editor i el menú (de cara, de cos sencer) i el que juga
  a cada nivell (al nivell 1, de perfil i corrent). Tots dos fan servir les
  mateixes eleccions. Pendent que Helena el revisi.
- **Final de partida:** quan perds o guanyes, el joc es queda congelat i a
  sobre surt "GAME OVER" o "LEVEL COMPLETE" amb animació. Funciona per a tots
  els nivells.
- **Editor d'avatar:** nou, amb pestanyes i miniatures. Pendent que Helena el
  revisi.
- **Nivell 2 (Rhythm Tap):** pas 2 de 6. La idea està acordada i ja hi ha
  una versió jugable amb dibuixos i música. Cada partida té una cançó, una
  banda i un públic diferents, i el públic és nou i més detallat. Falta que
  Helena hi jugui.
- **Norma per a tots els nivells:** cada partida ha de ser diferent (detalls
  a l'atzar), però amb les mateixes regles i la mateixa dificultat.
- **Nivell 3 (Spot the Impostor):** pas 1 fet (idea acordada) i primera
  versió jugable ja feta, amb dibuixos. Falta que Helena hi jugui.
- **Nivells 4 a 19:** encara no s'han començat (pas 0). Només tenen la
  proposta inicial a la seva llibreta.
- **Pendent general:** desar el progrés quan es tanca el joc, so, versió per
  a mòbil, app d'escriptori. Ho detalla `CLAUDE.md`, a "Pending work".

---

## Com treballar des d'un altre ordinador

1. Obrir Claude Code i dir: *"vull treballar al projecte Signals"*. L'enllaç és
   https://github.com/HelenaPastranaProducciones/Signals.
2. Claude descarrega el projecte en una carpeta (en aquest Mac és a
   `Documents/Signals`; al MacBook Air és a `~/Signals`).
3. Per poder **publicar** canvis, Claude instal·la l'eina de GitHub (`gh`) i
   Helena inicia sessió amb el codi que surt a la pantalla, al navegador on ja
   tingui GitHub obert. El compte és **helenapastraana**.
4. **Molt important:** si es treballa en més d'un ordinador, a l'inici de cada
   sessió Claude ha de **descarregar els últims canvis** de GitHub
   (`git pull`) abans de tocar res, perquè no es perdi la feina feta a l'altre.

---

## Sessions

### 27/10/2026: el punt de partida (abans d'aquest historial)

- Es parteix d'un prototip d'un sol fitxer fet en una altra conversa de
  Claude: pantalla d'inici, mapa de 19 nivells, pantalles de càrrega, menú i
  editor d'avatar. El resum d'aquella conversa (el *project brief*) és l'origen
  de tot el que hi ha a `CLAUDE.md`.
- El prototip es reorganitza en un projecte ordenat, amb publicació automàtica
  a GitHub Pages (https://helenapastranaproducciones.github.io/Signals/).
- Es crea el sistema de nivells: una carpeta per nivell, cadascun amb la seva
  llibreta, i els sis passos de cada nivell. També la guia de Helena
  (`GUIA-HELENA.md`).
- Decisió: es treballa sempre directament sobre `main`, sense branques.

### 28/10/2026: primera sessió amb Helena en aquest Mac

**Preparar l'ordinador**
- Es descarrega el projecte a `Documents/Signals`.
- S'instal·la l'eina de GitHub i Helena inicia sessió (compte
  *helenapastraana*). Els canvis es guarden amb aquest nom i amb el correu
  privat de GitHub, no amb el correu real.
- Es va intentar posar un botó a l'app de Claude per obrir el joc. Helena va
  dir que no calia, i no està activat.

**Comprovació del resum inicial**
- Helena va enganxar el resum de la conversa original. Coincideix amb el que
  hi ha al projecte: els 19 nivells, les frases finals, les peces de l'avatar
  i el funcionament general. Hi ha quatre detalls petits que no s'han copiat a
  les llibretes (nivells 1, 7, 9 i 15). Helena va decidir que no calia, i ja
  es decidiran quan es treballi cada nivell.

**Nivell 1: la idea (pas 1, acordat)**
- El joc ocupa tota la pantalla i els missatges del grup surten a sobre com a
  bombolles. Es va descartar la pantalla partida.
- És un corredor amb **el teu propi avatar**, que corre sol i salta
  obstacles.
- **Gir social:** si no contestes un missatge, l'amic es posa trist però
  **no marxa**. Si contestes, t'ajuda: t'avisa del proper obstacle o et dona
  un doble salt.
- **Perds** si xoques o si deixes **3 missatges** sense contestar.
- **Guanyes** si arribes a la **meta**, on t'esperen els amics. No hi ha
  rellotge.

**Nivell 1: primera versió jugable**
- Una versió amb formes senzilles.
- Problema: el joc arrencava sol i xocaves abans de veure res. Ara espera
  que premis una tecla per començar.
- Problema: el navegador de Helena ensenyava una versió antiga. Es pot
  arreglar amb **Cmd+Shift+R**. La causa és una opció de GitHub Pages (vegeu
  "Coses pendents de decidir").

**Nivell 1: segona versió (després que Helena hi jugués)**
- L'avatar amb braços i cames, que corre i salta.
- Es pot **ajupir**, inspirat en el joc del dinosaure de Chrome. Hi ha
  obstacles voladors per passar per sota.
- Obstacles variats: cons, papereres, bancs, caixes i testos a terra; drons,
  avions de paper, ocells i globus pels aires.
- El paisatge canvia mentre corres: parc → ciutat → barri de cases. El cel
  també canvia de color.
- Bombolles de xat més grans, amb la cara de l'amic, en llocs diferents de la
  pantalla però mai a sobre del camí.
- Dura **45 segons**.
- A la meta hi ha un arc i quatre amics (Mia, Leo, Nora i Kai) amb un aspecte
  diferent a cada partida, que salten d'alegria quan hi arribes.

### 29/10/2026

**Nivell 1: tercera versió**
- **El ratolí només serveix per contestar missatges.** Abans, en clicar una
  bombolla també saltaves sense voler. Ara se salta amb **Espai** o **↑** i
  s'ajup amb **↓**. Pendent: decidir com es jugarà al mòbil, on no hi ha
  teclat.
- Obstacles més grans i salt més alt.
- **Els dobles salts s'acumulen.** Els amics que t'ajuden te'n donen, els
  gastes quan vols prement Espai a l'aire, i un **comptador** mostra quants
  en tens.
- Es va provar un personatge de perfil, diferent de l'avatar del menú.
  ❌ **Descartat:** Helena el va trobar lleig i deforme, amb el cap gegant i
  els cabells malament.

**Avatar refet de zero**
- Decisió de Helena: l'avatar ha de ser **cuqui, bonic i mono**, i el que
  jugues ha de ser **el mateix** que el del menú.
- L'avatar nou és un ninot de cos sencer, una mica girat cap a la dreta, amb
  el cap d'un terç de l'alçada, ulls grans i brillants, galtes rosades,
  cabells amb serrell i cames curtes. Totes les peces s'han redibuixat.
- ❌ **No tornar enrere:** ni l'avatar antic (només cap i tors, de cara) ni el
  personatge de perfil amb el cap gegant.
- **Editor nou:** pestanyes (Cara, Cabells, Barrets, Ulleres i extres, Roba i
  Fons). Cada opció es mostra amb una miniatura del teu avatar portant-la, i
  els colors amb cercles.
- Un error en publicar va fer que el joc en línia deixés de carregar uns
  minuts. Es va arreglar de seguida.

**Dos avatars: el de l'editor i el que juga (29/10, més tard)**
- Helena ho va aclarir: **l'editor guarda les eleccions** (pell, cabells, roba,
  complements…), i **cada joc dibuixa el seu propi avatar** amb aquestes
  eleccions, en la vista que necessiti. No s'ha d'agafar el dibuix de
  l'editor i afegir-hi animacions.
- L'avatar de l'editor i del menú ara mira **de cara**.
- El nivell 1 té el seu propi avatar **de perfil**, en el mateix estil mono
  (`src/levels/01-game-and-chat/runner.js`). Els amics de la meta també.
- Les tombarelles ja no surten cada vegada: només de tant en tant, a l'atzar.
- Quan xoques, el personatge queda marejat (💫).
- **Final de partida per a tots els nivells:** el joc es queda congelat al
  fons. Si perds, surt "GAME OVER" amb el missatge, "Try again" i "Back to
  map". Si guanyes, surt "LEVEL COMPLETE" amb confeti, la frase final, les
  peces desbloquejades i el següent nivell.
- Helena demana que Claude **prengui la iniciativa amb l'aspecte**: que tot
  quedi bonic i polit com un joc acabat, sense esperar que ella ho digui tot.
  Ella té l'última paraula.

**Nivell 2: la idea (pas 1, acordat) i primera versió**
- Un Piano Tiles d'uns **30 segons** a la part de dalt. A baix, **la teva
  banda**: tu a la guitarra i els amics a la veu, al piano i a la bateria.
- **La festa reflecteix com toques, només visualment:** si encertes, hi ha
  més llum, color i públic saltant, i surten notes musicals. Si falles, tot
  s'apaga i el públic es queda quiet.
- **Vides:** 3 errors permesos; al quart, perds.
- Es juga amb les **fletxes** del teclat (← ↓ ↑ →). Al mòbil es tocarà amb
  el dit.
- Helena demana **la mateixa estètica i el mateix detall** que el nivell 1
  en tot: instruments, ambient i música.
- La cançó és original i la genera el mateix joc: la bateria, el baix, el
  piano i la veu sonen sols, i la guitarra sona quan encertes. Respecta
  l'opció de so del menú Options.
- Els membres de la banda tenen el cap i la roba del seu avatar, amb
  postures pròpies tocant l'instrument (seguint la norma de "cada nivell
  dibuixa el seu avatar").

### 29/10/2026: sessió al MacBook Air (segon ordinador)

**Preparar l'ordinador**
- El projecte es descarrega a `~/Signals`. S'hi instal·la git (les eines de
  desenvolupament d'Apple; va caldre alliberar espai al disc) i Node, a la
  carpeta de l'usuari (`~/.local/node`), sense tocar res més del sistema.
- Abans de començar es baixen els canvis de l'altre ordinador (`git pull`).

**Avatar de perfil (nivell 1): redibuixat peça a peça**
- Helena: moltes peces de l'avatar es veien malament de perfil i s'havien de
  refer totes.
- Ara tots els cabells comparteixen la mateixa línia del cabell: deixen la
  cara i **l'orella** a la vista. L'afro és una sola massa rodona (sense la
  línia estranya que travessava la cara) i la cresta té la base rapada.
- Les arracades pengen de l'orella, i les ulleres i els auriculars hi arriben.
- Gorres i barret de pescador més gruixuts, collarets i càmera davant del pit,
  i la bossa recolzada al maluc (abans flotava).

**Cada partida és diferent**
- Helena: cada vegada que jugues, ha de ser una "run" diferent, més
  aleatòria, a tots els nivells.
- **Norma nova per a tots els nivells:** els detalls canvien a l'atzar a cada
  partida, però les regles i la dificultat es mantenen.
- **Nivell 1:** a l'atzar, 3 llocs dels 4 possibles (parc, ciutat, barri de
  cases, botigues) i en quin ordre, on és cada arbre, casa o botiga, el cel al
  llarg del recorregut (dia de sol, matí, vespre fins a la nit, núvol), els
  núvols i els turons, quins 4 amics surten (d'un grup de 12) i com són,
  l'ordre dels missatges (d'una llista més llarga) i la mida dels obstacles.
- **Nivell 2:** a l'atzar, els acords, el to, la velocitat (una mica més
  ràpid o lent), el ritme de la bateria, la melodia de la veu i les notes que
  cauen (sempre més intenses cap al final), quins 3 amics toquen i com són, i
  tot el públic.

**Nivell 2: el públic**
- Helena: el públic es veia cutre; volia més detall, com els avatars, o més
  gent perquè no es notés.
- S'han fet les dues coses: dues files de gent vista d'esquena, feta amb
  avatars a l'atzar (cabells, gorres, auriculars, orelles de gat, samarretes
  amb números o ratlles), amb el mateix estil de plastilina. La fila del fons
  és més petita i a l'ombra. Alguns graven amb el mòbil o porten barres de
  llum, i les abaixen quan la festa decau.

**Nivell 2: "ara a la primera que falles et mors"**
- Dues causes, totes dues arreglades. El públic nou feia anar el joc a salts
  en pantalles grans, i mentre s'encallava passaven notes que comptaven com
  a errors. Ara el públic és molt més lleuger de dibuixar i es veu igual.
- Les cançons a l'atzar havien quedat més difícils (més notes i, a vegades,
  més ràpides). Ara totes tenen la mateixa velocitat i les mateixes notes (52)
  que la primera versió: només canvien els acords, el to, el ritme i l'ordre.
- Nou: quan perds un cor, els altres parpellegen 1 segon i els errors en
  aquell moment no en treuen cap més. Així un error no s'encadena amb els
  següents.

**Cabells de perfil: cada pentinat, una sola peça**
- Helena: els avatars de perfil encara es veien malament, sobretot els
  cabells; han de tenir sentit i ser una sola peça, no diverses.
- Es van redibuixar tots. Abans, els cabells llargs eren un casquet amb una cua
  a part, el monyo i els dos monyos eren boles enganxades, els rínxols eren
  boles soltes i la cresta eren dues capes.
- Ara **cada pentinat és una sola forma**. El contorn dona el volum i diu quin
  pentinat és (llargada, monyos, rínxols, punxes). Tots comparteixen la mateixa
  línia del cabell: serrell al front, patilla davant l'orella, per sobre de
  l'orella i fins al clatell, i la cara i l'orella queden lliures.
- A dins, uns fils surten de la coroneta i baixen cap enrere, amb una sola
  brillantor. Els rínxols i l'afro porten tirabuixons petits. La cresta és una
  filera de punxes per dalt del cap, amb els costats rapats.
- **Norma per a qualsevol nivell on l'avatar surti de perfil:** fer els
  cabells d'aquesta manera (està apuntat a `CLAUDE.md`).

**Nivell 3: la idea (pas 1, acordat)**
- **Què veus:** una colla d'una tribu urbana en el seu lloc (skaters a
  l'skatepark, gamers al cibercafè…), feta d'avatars vestits segons la tribu,
  cadascun fent la seva. Un no hi encaixa i l'has de tocar. ❌ Descartat: una
  graella de cares.
- **Gir social:** a l'última ronda l'impostor ets tu. El teu avatar surt amb
  una colla que no és la teva, i has de triar el grup on encaixes. Aquesta
  ronda no es pot perdre. ❌ Descartat: que la persona que toques per error es
  posi trista.
- **Guanyar i perdre:** 3 errors permesos (tocar qui no és o quedar-te sense
  temps), el quart acaba la partida, com al nivell 2. ❌ Descartat: no poder
  perdre i només fer punts.
- **Durada:** 5 rondes que es fan més ràpides i difícils (de 6 a 4 segons, de 6
  a 10 persones, l'impostor cada cop més dissimulat) i la ronda final. ❌
  Descartat: 5 rondes iguals de 5 segons.

**Nivell 3: primera versió jugable**
- Feta directament amb dibuixos. Hi ha sis tribus, cadascuna en el seu lloc i
  amb el que porta a les mans: skaters (skatepark, monopatí), gamers
  (cibercafè, comandament), otakus (botiga d'anime, peluix), punks (concert al
  carreró, puny enlaire), pijos (terrassa, cafè) i esportistes (pista, pilota).
- Al principi l'impostor és d'una altra tribu. Després va mig vestit com el
  grup, i al final només una cosa el delata.
- A cada partida canvien les tribus, l'ordre i la gent.
- La part que comparteix amb el nivell 18 (repartir la gent per l'escena i els
  cors) està feta perquè el 18 la pugui fer servir.

---

## Coses pendents de decidir

- **GitHub Pages:** GitHub publica el joc de dues maneres i l'una trepitja
  l'altra, per això a vegades es veu una versió antiga. Cal canviar
  *Settings → Pages → Source* a **GitHub Actions**. Claude ho pot fer amb el
  permís de Helena. Encara no s'ha fet.
- **Mòbil:** com saltar i ajupir-se sense teclat al nivell 1.
- Les preguntes obertes generals són a `CLAUDE.md`, a "Open questions".
