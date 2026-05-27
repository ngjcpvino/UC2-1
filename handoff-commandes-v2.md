# Handoff — Refonte du suivi des commandes (v3 — décisions prises)

## Préférences de travail (à respecter STRICTEMENT)

- **Jamais de code sans autorisation explicite.**
- Changements **uniquement par trouve-et-remplace**, **un seul à la fois**, attendre OK avant le suivant.
- **Pas de solution sans analyse complète** au préalable.
- **Réponses COURTES.** Une idée à la fois. Pas de jasage inutile.
- Chantal **ne parle pas en code**. Vulgariser, zéro jargon.
- **Pas de diagrammes Mermaid.** Numérotation en arborescence (1, 1.1, 1.2…), format épuré, lignes courtes.
- Réutiliser le CSS / les variables / les fonctions existantes.
- Avant tout trouve-et-remplace : **redemander la version à jour du fichier**.

---

## Où on en est

### ✅ FAIT
- **Demande de commande publique (étapes 1 à 7)** — en ligne. Une demande du site crée une commande « En attente » (`envoyerDemandeCommande_v2`) + courriel à Chantal + confirmation au client.
- **Stock prêt affiché dans la fiche d'une commande** — vert = assez, orange = pas assez, rouge = rien. Lecture seule. Fait en 2 trouve-et-remplace dans `voirDetailCommande`. Aucun changement serveur.
- **Présentation des commandes en blocs** — la liste affiche maintenant des blocs séparés (Entrantes / Prêtes / Annulées), style de la page Fabrication (cartes `carte-admin` + compte par bloc). Un seul trouve-et-remplace sur `afficherTableauCommandes`. Affichage seulement, réutilise le CSS existant. Un bloc « Autres » attrape tout statut imprévu pour qu'aucune commande disparaisse. Quand la réservation viendra, il suffira d'ajouter des lignes dans la liste `blocs`.

### 🧠 DÉCIDÉ (conçu ensemble, PAS encore codé)
Le modèle de réservation et le parcours complet sont maintenant tranchés — voir ci-dessous. Rien de ce bloc n'est codé. C'est de la conception, à bâtir prudemment.

---

## Le besoin de Chantal (dans ses mots)

- Traiter une commande facilement, sans en échapper.
- Vendre **sans être présente** → le paiement à distance est au cœur.
- Voir **d'un coup d'œil** où chaque commande est rendue.

---

## LES DÉCISIONS PRISES

1. **Réserver gèle le stock tout de suite.** Quand Chantal réserve, le disponible baisse pour tout le monde (les produits sont mis de côté). Si elle modifie ou annule avant le paiement, le stock revient.

2. **Deux tableaux séparés : Commandes et Ventes.** Raison : une **commande** peut exister même sans avoir tout le stock (elle attend), tandis qu'une **vente** exige le stock, vu qu'elle l'enlève.

3. **Une commande reste une commande jusqu'au paiement.** Même réservée (stock gelé), elle vit côté Commandes, sous son numéro CMD. Elle ne devient une **vente** qu'au moment où la cliente confirme et paie.

4. **Le numéro de vente naît à la confirmation/paiement** — jamais avant. Conséquence : une réservation qui tombe à l'eau ne gaspille aucun numéro de vente.

5. **Numéros de vente séquentiels (exigence fiscale).** Une vente annulée n'est **jamais effacée** : elle garde son numéro avec la mention « Annulée », et le stock revient. ⚠️ Voir drapeau technique #2.

6. **Les numéros restent distincts mais liés.** CMD-0012 reste une commande, VEN-0034 reste une vente. La commande affiche « → VEN-0034 », la vente affiche « vient de CMD-0012 ».

7. **Le « coucou » texto** part en même temps que la proposition : manuel, gratuit, ouvre l'app Messages de l'iPhone avec le texte déjà écrit + le numéro. Chantal tape Envoyer.

8. **Paiement** : lien de paiement Square envoyé avec la proposition. Au début, Chantal clique « Payée » quand elle voit le paiement (manuel). Automatisation Square = plus tard.

---

## LE TRAJET D'UNE COMMANDE (exemple : Sophie, 3 savons lavande)

```text
1   La demande arrive du site
1.1 Crée une commande, bloc Entrantes
1.2 Numéro CMD-0012
1.3 Aucun stock gelé, aucun numéro de vente

2   Tu réserves
2.1 Le stock se gèle
2.2 Statut Réservée
2.3 Reste une commande, CMD-0012
2.4 Toujours aucun numéro de vente

3   Tu envoies la proposition
3.1 Produits + livraison + lien de paiement
3.2 Envoi par courriel + texto
3.3 Statut En cours

4   La cliente confirme et paie  ← la porte commande → vente
4.1 Devient une vente
4.2 Numéro de vente VEN-0034 (naît ici)
4.3 Le stock bouge pas, déjà gelé
4.4 La commande garde le lien → VEN-0034
4.5 Statut À expédier

5   Tu expédies
5.1 Statut Terminée

6   Annulée AVANT le paiement
6.1 Le stock revient
6.2 Va dans Annulées
6.3 Aucun numéro de vente perdu

7   Annulée APRÈS le paiement
7.1 La vente garde son numéro VEN-0034
7.2 Mention Annulée
7.3 Le stock revient
```

**Où ça vit :** étapes 1 à 3 = côté **Commandes**. Étapes 4 et 5 = côté **Ventes**. Le paiement est la porte entre les deux.

---

## La présentation en blocs (retombe sur la vision de départ)

Page **Commandes** — blocs séparés, la commande descend de l'un à l'autre :
- Entrantes (vient d'arriver)
- Réservée (stock gelé, proposition à préparer)
- En cours (proposition envoyée)
- + Annulées (coin discret)

Sous-cas du bloc « En cours » :
- Paiement reçu → bascule côté Ventes, « À expédier »
- Pas de réponse → bouton Rappel (inscrit la date du rappel sur la commande)
- Changement → retour à la réservation, ajuster (le stock réservé suit), renvoyer la proposition

Page **Ventes** — même genre de présentation en blocs : En cours / À expédier / Terminées. Reçoit les commandes une fois payées.

---

## Ce qui reste à trancher

- Jusqu'où vont les **rappels** : combien de fois, après combien de jours.
  Reco : un bouton « Rappel » qui note seulement la date du dernier rappel — pas de compteur, pas de limite. C'est Chantal qui décide quand relancer.

Déjà réglé : stock dans la liste → la fiche suffit pour l'instant (la pastille passe aux Améliorations). Proposition → statut + envoi (voir le trajet). Confirmation → clic manuel « Payée » au début (décision 8).

---

## Améliorations futures (idées notées, pas pour maintenant)

- **Pastille sur la liste des commandes.** Un indicateur de couleur directement sur chaque ligne du tableau, qui montre — sans ouvrir la commande — si elle peut être finalisée complètement (tout le stock est prêt). Éviterait d'ouvrir les commandes une par une. Lecture seule, réutilise `getLotsDisponibles`.

- **Pastille de rappel sur la commande.** Un indicateur qui signale qu'un rappel est à faire pour cette commande, et qui change d'état quand le rappel est échu (ça fait trop longtemps sans réponse) — pour faire ressortir d'un coup d'œil celles qui traînent. S'appuie sur la date du dernier rappel.

---

## Drapeaux techniques pour quand on bâtira (PAS résolus)

1. **Geler le stock à la réservation, avant que ce soit une vente.** Aujourd'hui, c'est `finaliserVente_v2` qui retire le stock (via `nb_unites_vendu` dans `Lots_v2`). À la réservation, la vente n'existe pas encore → il faut un mécanisme pour geler le stock à ce moment-là, sans le retirer une 2e fois au paiement. C'est LE piège central : ne jamais enlever le stock deux fois.

2. **Numéros séquentiels à sécuriser.** `createVente_v2` calcule le prochain numéro à partir du plus grand existant. Si une vente est **effacée** (`deleteVente_v2`), le numéro pourrait être réutilisé → trou/réutilisation = problème fiscal. Règle : annuler sans effacer (garder la ligne avec statut « Annulée »).

3. **Lien vente → commande à ajouter.** La commande peut déjà retenir le numéro de vente (`ven_id_lien`, colonne 11 de `Commandes_Entete_v2`). L'inverse (la vente qui pointe vers la commande) n'existe pas encore comme champ — à ajouter si on veut le lien des deux bords.

4. ⚠️ **Ce chantier touche l'inventaire = risque le plus élevé.** À bâtir lentement, un trouve-et-remplace à la fois, en testant. Ne pas coder à l'aveugle.

---

## Fichiers de référence (redemander la version à jour avant tout trouve-et-remplace)

- `js/admin-commandes.js` — liste, fiche, création/édition, « Convertir en vente », statuts. Fonctions : `chargerCommandes`, `afficherTableauCommandes` (la liste — futurs blocs + stock en liste), `voirDetailCommande` (la fiche — stock déjà affiché, futurs boutons Réserver/Proposition), `convertirCommandeEnVente` (modèle pour lire `getLotsDisponibles` et associer un lot), `changerStatutCommande`, `annulerCommande`.
- `js/admin-ventes.js` — côté ventes (statuts, finalisation, boutons paiement Square/comptant/plus tard, texto, courriel).
- `Code.gs` (Apps Script) — `getCommandesEntete_v2`, `getCommandesLignes_v2`, `updateStatutCommande_v2`, `updateCommandeComplete_v2`, `getLots_v2`, `getLotsDisponibles_v2`, `createVente_v2`, `finaliserVente_v2`, `deleteVente_v2`, `envoyerDemandeCommande_v2`. Statuts commande existants : « En attente », « Prête », « Annulée » (+ « Livrée » présent dans le tri mais inutilisé).
- **HTML admin** (section commandes) — `#section-commandes`, `#fiche-commande`, `#form-commande`, `#tableau-commandes`, `#filtres-commandes`. À demander si on touche à l'affichage.
- `css/style.css` — variables : `--primary` (vert), `--accent` (orange/doré), `--danger` (rouge), `--beige`. Classe `.cache`.

---

## Ton à garder

Doux, encourageant, court. Avancer par petites touches, une possibilité à la fois. Laisser décanter, ne jamais bousculer, célébrer ce qui est déjà fait. Pas de jasage inutile.
