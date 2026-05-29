# Handoff — Univers Caresse (admin)
### État du projet + méthode de travail à respecter

> À lire en entier avant de commencer. La **méthode de travail** (section 1) passe avant tout le reste. Chantal dirige. On avance par petites touches, en douceur.

---

## 1. MÉTHODE DE TRAVAIL — à respecter STRICTEMENT

1.1 **Jamais de code sans autorisation explicite.** On propose, on attend le OK.

1.2 **Changements uniquement par trouve-et-remplace**, **un seul à la fois**, et on **attend le OK** avant de passer au suivant.

1.3 **Avant tout trouve-et-remplace : redemander la version à jour du fichier.** Les fichiers évoluent entre les sessions ; il faut matcher le texte exact.

1.4 **Pas de solution sans analyse complète au préalable.** Si une info manque (un fichier, une fonction), on la demande avant de proposer quoi que ce soit. On ne devine pas.

1.5 **Réutiliser l'existant** : CSS, variables, fonctions, classes déjà en place. **Objectif : réduire le CSS, pas le gonfler.** Améliorer un style partagé une seule fois plutôt que de copier-coller par section.

1.6 **Réponses COURTES. Une idée à la fois.** Pas de roman.

1.7 **Zéro jargon. Vulgariser.** Chantal ne parle pas en code. Expliquer en mots simples ce qu'on fait et pourquoi.

1.8 **Pas de listes à choix multiples** dans la conversation (elle déteste ça). Parler normalement, en phrases.

1.9 **Pas de diagrammes Mermaid.** Numérotation en arborescence (1, 1.1…).

1.10 **Pas de maquette** sauf demande.

1.11 **Elle teste seulement quand elle publie.** Donc on peut enchaîner les trouve-et-remplace sans test entre les deux, sur son OK. Si une étape dépend d'une autre (ex. un bouton qui appelle une fenêtre pas encore créée), la prévenir de ne pas tester entre-temps.

1.12 **Ne JAMAIS décider de son emploi du temps.** Elle choisit le rythme et l'ordre.

1.13 **Ton** : doux, encourageant, court. Célébrer ce qui est fait. Honnête si quelque chose dérape, sans s'aplatir ni s'excuser à répétition. Revenir au concret.

---

## 2. CONTEXTE

Site **Univers Caresse** (savonnerie artisanale). Admin construite sur **Google Sheets + Apps Script** (`Code.gs`). Front en HTML/CSS/JS classique, un seul `style.css` partagé public + admin.

**Republier après un changement :**
- `Code.gs` modifié → **nouveau déploiement** Apps Script.
- HTML / CSS / JS modifié → **republier le site**.

**Flux d'une commande** : demande du site → « En attente » → **Compléter** (sort le stock + envoie la proposition par courriel/texto) → « En attente de paiement » → **Paiement reçu** (crée la vente) → « À expédier » → « Terminée ».

---

## 3. EN COURS — à reprendre EN PREMIER

### « Modifier les produits » + « Annuler avec retour de stock » (2 si en un)

**But.** Après l'envoi de la proposition (statut « En attente de paiement »), le stock est **déjà sorti**. On veut deux choses : (a) que Chantal puisse **modifier les produits** (ajouter/enlever), et (b) qu'une **annulation** à ce stade **remette le stock** en inventaire. Une seule fonction sert aux deux.

**Analyse (déjà faite — ne pas refaire) :**
- Le stock se suit par lot dans `Lots_v2`, via un compteur **`nb_vendu` = colonne 15 (index 14)**. « Sortir » = augmenter `nb_vendu`. « Remettre » = le diminuer.
- À la sortie, `sortirStockCommande_v2` **écrit la trace des lots pris sur chaque ligne** de `Commandes_Lignes_v2`, en **colonne G (index 6)**, format `lot_id:qte,lot_id:qte`. C'est cette trace qui permet de tout remettre exactement.
- `sortirStockCommande_v2` exige le statut « En attente » (anti double-sortie). Donc après une remise, recompléter refonctionne.

**Approche retenue.** Une nouvelle fonction serveur `remettreStockCommande_v2(data)` qui lit la colonne G de chaque ligne, recrédite les lots, vide la colonne G, et fixe le statut à `data.statut_apres`. Branchée à deux endroits :
- Bouton **« Modifier les produits »** (fiche « En attente de paiement ») → remet le stock, statut → « En attente » → puis `modifierCommande` (formulaire connu). Chantal modifie, enregistre, puis re-clique **« Compléter »** (ressort le stock + renvoie une proposition corrigée).
- Bouton **« Annuler »** : si le stock est sorti (« En attente de paiement »), on appelle `remettreStockCommande` avec statut_apres « Annulée » ; sinon (« En attente »), on garde l'`updateStatutCommande` actuel.

**CE QU'IL MANQUE POUR CONTINUER :** le bout du `doPost` de `Code.gs` qui aiguille les actions (les lignes du genre `else if (action === 'sortirStockCommande') result = sortirStockCommande_v2(data);`), pour y ajouter la route au bon format. **Redemander ce bout à Chantal**, puis appliquer les touches ci-dessous une à une.

#### Touche A — `Code.gs` : nouvelle fonction (à insérer juste avant `function sortirStockCommande_v2(data) {`)

```js
function remettreStockCommande_v2(data) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(10000); }
  catch (e) { return { success: false, message: 'Système occupé, réessayez dans quelques secondes.' }; }
  try {
    const ss = getSS();
    const enteteSheet = ss.getSheetByName('Commandes_Entete_v2');
    const lignesSheet = ss.getSheetByName('Commandes_Lignes_v2');
    const lotsSheet   = ss.getSheetByName('Lots_v2');
    if (!enteteSheet || !lignesSheet || !lotsSheet) { lock.releaseLock(); return { success: false, message: 'Sheet introuvable' }; }
    if (!data.cmd_id) { lock.releaseLock(); return { success: false, message: 'cmd_id requis' }; }

    const enteteData = enteteSheet.getDataRange().getValues();
    let ligneEntete = -1;
    for (let i = 1; i < enteteData.length; i++) {
      if (String(enteteData[i][0]) === String(data.cmd_id)) { ligneEntete = i + 1; break; }
    }
    if (ligneEntete < 0) { lock.releaseLock(); return { success: false, message: 'Commande introuvable' }; }

    const statutActuel = enteteData[ligneEntete - 1][8];
    if (statutActuel !== 'En attente de paiement') {
      lock.releaseLock();
      return { success: false, message: 'Rien à remettre (statut : ' + statutActuel + ').' };
    }
    if (enteteData[ligneEntete - 1][10]) {
      lock.releaseLock();
      return { success: false, message: 'Une facture est déjà liée — impossible de remettre le stock.' };
    }

    const lotsData = lotsSheet.getDataRange().getValues();
    const lotIndex = {};
    for (let j = 1; j < lotsData.length; j++) {
      if (!lotsData[j][0]) continue;
      lotIndex[String(lotsData[j][0])] = { ligne: j + 1, nb_vendu: parseInt(lotsData[j][14]) || 0 };
    }

    const lignesData = lignesSheet.getDataRange().getValues();
    for (let i = 1; i < lignesData.length; i++) {
      if (String(lignesData[i][0]) !== String(data.cmd_id)) continue;
      const lotsStr = String(lignesData[i][6] || '');
      if (lotsStr) {
        lotsStr.split(',').forEach(part => {
          const m = part.split(':');
          const lot_id = m[0];
          const qte = parseInt(m[1]) || 0;
          if (lot_id && qte > 0 && lotIndex[lot_id]) {
            const nouveau = Math.max(0, lotIndex[lot_id].nb_vendu - qte);
            lotsSheet.getRange(lotIndex[lot_id].ligne, 15).setValue(nouveau);
            lotIndex[lot_id].nb_vendu = nouveau;
          }
        });
      }
      lignesSheet.getRange(i + 1, 7).setValue('');
    }

    enteteSheet.getRange(ligneEntete, 9).setValue(data.statut_apres || 'En attente');

    lock.releaseLock();
    return { success: true };
  } catch(e) {
    lock.releaseLock();
    return { success: false, message: e.message };
  }
}
```

#### Touche B — `Code.gs` : route dans le doPost (format à confirmer avec son fichier)

```js
else if (action === 'remettreStockCommande') result = remettreStockCommande_v2(data);
```

#### Touche C — `admin-commandes.js` : nouvelle fonction (à ajouter, ex. près de `annulerCommande`)

```js
function modifierProduitsCommande(cmd_id) {
  confirmerAction('Modifier les produits ? Le stock de cette commande sera remis en inventaire et tu devras renvoyer une proposition corrigée. Continuer ?', async () => {
    afficherChargement();
    const res = await appelAPIPost('remettreStockCommande', { cmd_id, statut_apres: 'En attente' });
    cacherChargement();
    if (res && res.success) {
      await modifierCommande(cmd_id);
    } else {
      afficherMsg('commandes', '❌ ' + (res?.message || 'Erreur lors de la remise en stock.'), 'erreur');
    }
  });
}
```

#### Touche D — `admin-commandes.js` : bouton dans `voirDetailCommande` (bloc « En attente de paiement »)

Remplacer :
```js
    actionsHTML += `<button class="bouton bouton-contour" onclick="textoProposition('${c.cmd_id}')">Texto au client</button>`;
    actionsHTML += `<button class="bouton bouton-rouge" onclick="annulerCommande('${c.cmd_id}')">Annuler la commande</button>`;
```
Par :
```js
    actionsHTML += `<button class="bouton bouton-contour" onclick="textoProposition('${c.cmd_id}')">Texto au client</button>`;
    actionsHTML += `<button class="bouton" onclick="modifierProduitsCommande('${c.cmd_id}')">Modifier les produits</button>`;
    actionsHTML += `<button class="bouton bouton-rouge" onclick="annulerCommande('${c.cmd_id}')">Annuler la commande</button>`;
```

#### Touche E — `admin-commandes.js` : remplacer `annulerCommande` pour qu'elle remette le stock si nécessaire

```js
function annulerCommande(cmd_id) {
  const c = toutesCommandes.find(x => x.cmd_id === cmd_id);
  const stockSorti = c && c.statut === 'En attente de paiement';
  let message = stockSorti
    ? 'Annuler cette commande ? Le stock réservé sera remis en inventaire.'
    : 'Annuler cette commande ?';
  if (c && c.acompte > 0) {
    message = `⚠️ Un acompte de ${formaterPrix(c.acompte)} a été versé. Pensez à le rembourser au client avant d'annuler.`
      + (stockSorti ? ' Le stock sera remis en inventaire.' : '') + ' Continuer ?';
  }
  confirmerAction(message, async () => {
    afficherChargement();
    const res = stockSorti
      ? await appelAPIPost('remettreStockCommande', { cmd_id, statut_apres: 'Annulée' })
      : await appelAPIPost('updateStatutCommande', { cmd_id, statut: 'Annulée' });
    cacherChargement();
    if (res && res.success) {
      afficherMsg('commandes', '✅ Commande annulée.');
      fermerFicheCommande();
      chargerCommandes();
    } else {
      afficherMsg('commandes', '❌ ' + (res?.message || 'Erreur.'), 'erreur');
    }
  });
}
```

**Ordre suggéré :** demander le doPost → Touche A → Touche B → Touche C → Touche D → Touche E. Republier (nouveau déploiement Apps Script + site). Test : créer une commande, compléter, puis « Modifier les produits » et « Annuler » en vérifiant que l'inventaire retombe juste.

---

## 4. CE QUI A ÉTÉ FAIT (sessions précédentes)

4.1 **Tuile « Univers » de l'accueil admin** : `admin.js` remplit `hero-stat-univers` depuis `donneesRegroupements.length`, aux deux endroits (`chargerDonneesInitiales`, `afficherStatsAccueil`).

4.2 **Espacement des fiches uniformisé** (`style.css`) : `#fiche-gamme`, `#fiche-famille`, `#fiche-regroupement`, `#fiche-recette` via `:not(.cache)` → flex colonne `gap:12px`, et `margin-bottom:0` sur leurs `.form-panel` (comme `#fiche-collection`).

4.3 **Espacement des formulaires d'édition uniformisé** : `#form-collections`, `#form-gammes`, `#form-familles`, `#form-regroupements`, `#form-recettes`.

4.4 **Relooking des gammes (fiche collection)** : style partagé `.fiche-ligne-item` (carte, barre verte, fond `--primary-04`, hover) + `.fiche-ligne-nom` (police titres, vert).

4.5 **Bouton « Fermer »** ajouté en premier dans le bandeau bas des 4 fiches (`bouton bouton-contour`).

4.6 **`.bouton-contour`** : beige illisible → **gris** (améliore aussi les « Annuler »).

4.7 **Médiathèque réparée (popup + page)** : l'ancien `.collection-carte` était commenté (migration vers `.carte`) mais la médiathèque l'utilisait encore. `admin-mediatheque.js` migré vers `.carte` / `.carte-bg` / `.carte-contenu` / `.carte-titre` / `.carte-slogan`. Zéro nouveau CSS.

4.8 **Menu déroulant nav** : `white-space: nowrap` sur `.nav-dropdown-item`, et ouverture vers la gauche (`right:0; left:auto` sur `.nav-dropdown`).

4.9 **Barres de défilement masquées partout** (après le reset) : `* { scrollbar-width:none; -ms-overflow-style:none; }` + `*::-webkit-scrollbar { display:none; width:0; height:0; }`. (S'applique aussi au site public.)

4.10 **Choix du mode de paiement à « Paiement reçu »** *(fait et testé)* : fenêtre `#modal-mode-paiement-cmd` (Square / Virement Interac / Comptant). `paiementRecu` l'ouvre ; `confirmerPaiementCommande(mode)` appelle `creerVenteDepuisCommande`. Valeurs : `square`, `interac`, `argent`.

---

## 5. DÉTAILS TECHNIQUES À SE RAPPELER

5.1 `.form-panel` caché par défaut ; s'affiche avec `visible` ou via la grande liste `#... .form-panel { display:block; }`.

5.2 Fiches `#fiche-gamme/famille/regroupement/recette` : montrées en retirant `.cache` (deviennent `display:flex`). `#fiche-collection` utilise `.visible`.

5.3 **Cartes unifiées `.carte`** ; l'ancien `.collection-carte` est commenté. Toute page affichant encore des photos « géantes » = du JS utilisant l'ancien nom → migrer vers `.carte`.

5.4 **`mode_paiement`** : stocké brut dans `Ventes_Entete_v2`, affiché brut dans la liste des ventes. Clés : `square`, `argent` (comptant), `plus-tard`, `square-manuel`, `interac`. Pour de jolies étiquettes un jour → `afficherTableauVentes` dans `admin-ventes.js`.

5.5 **Stock / lots** : `Lots_v2` compteur `nb_vendu` = colonne 15 (index 14). Sortie = `+`, remise = `−`. La trace des lots pris est en `Commandes_Lignes_v2` **colonne G (index 6)**, format `lot_id:qte,...`. `sortirStockCommande_v2` exige statut « En attente ». `creerVenteDepuisCommande_v2` lit la colonne G et ne retouche pas le stock (« déjà sorti »). `mode_paiement` y est libre (`data.mode_paiement || 'square'`).

5.6 `Commandes_Entete_v2` colonnes : **M** `note_proposition`, **N** `lien_square`, **O** `livraison`, **P** `date_proposition`. Colonne statut = 9 (index 8). Colonne facture liée = 11 (index 10).

5.7 `sms:` ne s'ouvre que d'un **clic direct** (pas après un `await`).

---

## 6. « SI » RESTANTS

- ✅ *Mode de paiement à confirmer* (Square / Interac / comptant) — **fait et testé**.
- 🔧 *Modifier les produits après proposition* — **EN COURS** (voir section 3).
- 🔧 *Annuler après sortie du stock → retourner le stock* — **EN COURS** (voir section 3, même fonction).
- ⏳ **Pastille orange** (stock partiel) — quoi faire ?
- ⏳ **Pastille rouge** (rien en stock) — la commande reste « En attente ».
- ⏳ **Cliente ne répond pas** — bouton Rappel.

---

## 7. FICHIERS DE RÉFÉRENCE
*(toujours redemander la version à jour avant un trouve-et-remplace)*

- `index.html` — sections admin, fiches, formulaires, fenêtres modales.
- `css/style.css` — source unique, public + admin.
- `js/main.js` — site public + appels API (`appelAPI`, `appelAPIPost`, `CONFIG`).
- `js/admin.js` — init admin, navigation, stats d'accueil.
- `js/admin-commandes.js` — commandes : liste, fiche, compléter, `paiementRecu`, `confirmerPaiementCommande`, `annulerCommande`, `modifierCommande`, `textoProposition`.
- `js/admin-ventes.js` — ventes, `finaliserVente`, Square, factures courriel/texto.
- `js/admin-collections.js` — collections + gammes de la collection.
- `js/admin-mediatheque.js` — médiathèque (page + popup sélecteur).
- `Code.gs` — back-end Apps Script (`sortirStockCommande_v2`, `creerVenteDepuisCommande_v2`, `updateCommandeComplete_v2`, `envoyerProposition_v2`, + à venir `remettreStockCommande_v2`, et le **doPost** d'aiguillage).

---

*Bon travail, et surtout : douceur, petites touches, une chose à la fois. Chantal paie pour ce service et mérite qu'on l'écoute.*
