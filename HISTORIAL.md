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
  Falta que Helena hi jugui i ho aprovi per donar el pas 2 per fet i passar a
  ajustar la dificultat (pas 3).
- **Avatar:** refet de zero el 29/10 perquè sigui mono. És el mateix a tot
  arreu: inici, menú, editor i nivells. Pendent que Helena el revisi.
- **Editor d'avatar:** nou, amb pestanyes i miniatures. Pendent que Helena el
  revisi.
- **Nivells 2 a 19:** encara no s'han començat (pas 0). Només tenen la
  proposta inicial a la seva llibreta.
- **Pendent general:** desar el progrés quan es tanca el joc, so, versió per
  a mòbil, app d'escriptori. Ho detalla `CLAUDE.md`, a "Pending work".

---

## Com treballar des d'un altre ordinador

1. Obrir Claude Code i dir: *"vull treballar al projecte Signals"*. L'enllaç és
   https://github.com/HelenaPastranaProducciones/Signals.
2. Claude descarrega el projecte en una carpeta (en aquest Mac és a
   `Documents/Signals`).
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

---

## Coses pendents de decidir

- **GitHub Pages:** GitHub publica el joc de dues maneres i l'una trepitja
  l'altra, per això a vegades es veu una versió antiga. Cal canviar
  *Settings → Pages → Source* a **GitHub Actions**. Claude ho pot fer amb el
  permís de Helena. Encara no s'ha fet.
- **Mòbil:** com saltar i ajupir-se sense teclat al nivell 1.
- Les preguntes obertes generals són a `CLAUDE.md`, a "Open questions".
