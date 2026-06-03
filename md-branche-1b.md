# Univers Caresse — Document de reprise

À coller au début d'une nouvelle conversation pour continuer sans tout recommencer.

---

## RÈGLES DE TRAVAIL (à respecter absolument)

- **Aucun code sans mon OK explicite.** Quand on construira : par trouve-et-remplace, un changement à la fois, attendre un OK entre chaque.
- **Pas de solution proposée sans analyse complète.**
- **Une question à la fois.** Pas trois questions empilées.
- **Parle en clair, pas en code.** Je ne lis pas le code. Si tu mets du code ou du jargon dans une explication, je saute le paragraphe.
- **Les scénarios se font en puces, jamais en paragraphes.** Les paragraphes n'aident pas ma compréhension.
- **Ne me demande jamais si je veux arrêter, faire une pause, ou continuer plus tard.** Ce n'est pas à toi de décider de mon horaire. Je mène, tu suis.
- **Ne me demande pas la permission d'inclure un morceau qui fait déjà partie du scénario.** Si c'est dans le plan, c'est acquis. On jase du « comment », pas du « si ».
- **On ne construit jamais sur une supposition.**
- **On reste côté client d'abord.** Le côté Chantal (admin) vient après.
- **On parle des chemins voulus, normaux** — pas des bugs ni des pannes.

---

## LE SYSTÈME EN BREF

- Boutique sans panier classique.
- Le client coche ses « coups de cœur », envoie sa liste avec ses coordonnées.
- Ça crée une commande « En attente » côté admin.
- Chantal prépare une proposition (livraison, rabais, lien Square), l'envoie.
- Le client paie → ça devient une vente → expédition.
- Décision de fond : **le client ne calcule jamais rien lui-même** (ni livraison, ni promo, ni total). C'est toujours Chantal qui prépare et renvoie. « Il y a une conversation, pas un panier. »

---

## LES STATUTS D'UNE COMMANDE (existants aujourd'hui)

- **En attente** — la demande vient d'arriver, aucun stock touché
- **En attente de paiement** — proposition envoyée, stock gelé (réservé pour ce client)
- **À expédier** — payée
- **Terminée** — expédiée
- **Annulée**

Nouveaux statuts décidés (voir le détail dans chaque chemin) :
- **À retravailler** — le client a renvoyé une liste modifiée (1.b)
- **À annuler** — le client a demandé une annulation (1.d), ou il ne reste rien à garder (#3)
- **Statut « à refaire » (NOM À CHOISIR)** — pour la 2e commande des produits gardés (#2) et la commande qui attend dans le #3. Le nom exact (« À fabriquer », « À refaire », autre) sera choisi au moment de bâtir. Partout dans ce document, « à refaire » = ce même statut.

---

# BRANCHE 1.b — « CHANGER SA COMMANDE » (TRANCHÉE ✅)

Contexte : le client a reçu sa proposition par courriel. Au lieu de payer, il veut modifier sa commande.

## La boucle complète, en puces

- Le client clique sur un lien dans son courriel de proposition
- La page va chercher sa commande chez nous (le lien transporte seulement le numéro CMD-XXXX)
- La page vérifie le statut de la commande :
  - Si elle n'est **pas** « En attente de paiement » → message (à composer plus tard) qui finit par un bouton **Fermer** → retour à l'accueil
  - Si elle **est** « En attente de paiement » → on lui montre sa commande et il peut travailler
- Il revient dans **sa liste de coups de cœur** (la même qu'il connaît déjà sur le site)
- Il peut seulement : **enlever** un produit / **changer une quantité** / **rajouter** un produit
- Il ne touche à **rien d'autre** : pas de livraison, pas de promo, pas de total à payer
- Il renvoie sa liste modifiée
- **Les produits gelés restent gelés** — on ne relâche RIEN automatiquement
- La commande change de statut → **« À retravailler »** → elle se déplace dans le tableau admin pour attirer l'œil de Chantal
- Chantal voit **les deux versions côte à côte** :
  - la commande d'origine
  - ce que le client demande maintenant
- Chantal compare, puis refait sa proposition à partir de la **nouvelle** liste
- La nouvelle proposition **devient** la commande
- L'ancienne version **disparaît** (on la jette — c'est juste des savons)

## Décisions de fond derrière cette boucle

- **Affichage à l'arrivée :** on va chercher la commande chez nous au moment du clic (le lien ne transporte que le numéro). On NE met PAS toute la commande dans le lien (un lien a une limite de longueur → ce serait construire sur une supposition).
- **Le gel des produits :** quand le client modifie, ses produits réservés ne sont PAS relâchés. C'est Chantal qui décide quoi relâcher, plus tard, en retravaillant la commande. But : garder ses produits pour pouvoir terminer sa commande en priorité, et empêcher que quelqu'un d'autre lui prenne ses savons pendant qu'il hésite.
- **Qui recalcule :** jamais le client. Une modification = une demande qui revient à Chantal, comme le tout premier envoi de coups de cœur.
- **Garder les deux versions :** l'ancienne sert UNIQUEMENT à comparer. Une fois la nouvelle proposition refaite, l'ancienne est jetée.

## CE QUI EXISTE DÉJÀ (côté client)

- Le système de coups de cœur complet : liste sauvegardée, ajouter / retirer / changer quantité, la modal (liste → coordonnées → merci)
- La page vitrine avec sa section « Merci » (retour après paiement Square)

## CE QUI MANQUE (à construire pour 1.b)

1. **Une page d'atterrissage** où le client arrive quand il clique sur le lien — dans notre décor (mêmes couleurs, même douceur), avec sa commande devant lui
2. **La récupération de la commande** : la page lit le numéro et va chercher le contenu de la commande chez nous
3. **La vérification du statut** : modifiable seulement si « En attente de paiement », sinon le message + Fermer
4. **Recharger sa liste de coups de cœur** avec ce qu'il avait déjà commandé (au lieu d'une liste vide)
5. **Le retour de la liste modifiée** : ça ne crée PAS une nouvelle commande, ça garde le gel, et ça met la commande en « À retravailler »
6. **L'affichage des deux versions côte à côte** côté admin (origine + nouvelle demande)
7. **Le bouton « Changer ma commande » dans le courriel** — branché **EN DERNIER**, une fois que tout le reste est prêt (sinon le bouton mènerait à du vide)

## PRÉCISIONS (pour ne JAMAIS réinventer de faux problèmes)

- **Sa liste de coups de cœur = sa commande. C'est la même chose.** Il n'y a pas deux objets différents. On a son numéro, on va chercher sa commande, il la modifie. Point. Ne pas réintroduire d'histoire de « navigateur », d'« appareil », ou de liste qui vivrait ailleurs.
- **Garder les deux versions n'est pas un problème.** La feuille (sheet) a autant de colonnes et de lignes qu'on veut. On range l'ancienne version dedans le temps de comparer, puis on la jette. Aucune limite à contourner.

## ORDRE DE CONSTRUCTION (logique, à confirmer au moment de bâtir)

- D'abord : la page d'atterrissage + récupération de la commande + vérification du statut
- Ensuite : recharger la liste + le retour modifié + le nouveau statut + les deux versions
- En tout dernier : le bouton dans le courriel qui pointe vers tout ça

## DÉTAILS LAISSÉS POUR PLUS TARD (décor, pas mécanique)

- Le texte exact du message quand la commande n'est plus modifiable
- Ce qu'on affiche pendant le petit temps de chargement (vide / mot d'attente / spinner)
- Le placement exact du bouton dans le courriel

---

## ÉTAPES DE RÉALISATION (à faire dans cet ordre, un OK entre chaque)

Rappel : aucune ligne de code sans mon OK. Par trouve-et-remplace, un changement à la fois.

### Étape 1 — La page d'atterrissage (le décor où le client arrive)
- Créer un nouvel endroit, dans notre décor habituel (mêmes couleurs, même douceur), où le client atterrit en cliquant sur le lien.
- Au départ, cette page ne fait rien d'autre qu'exister et s'afficher proprement.
- Pas encore de commande dedans, pas encore de logique. Juste la coquille.

### Étape 2 — Lire le numéro de commande
- La page doit savoir reconnaître le numéro de commande (CMD-XXXX) transporté par le lien.
- Tant qu'on n'a pas de numéro valide, la page ne tente rien.

### Étape 3 — Aller chercher la commande
- Avec le numéro, la page demande chez nous : « montre-moi cette commande ».
- Elle reçoit le contenu : les produits, les quantités, les prix.

### Étape 4 — Vérifier si la commande est modifiable
- Si la commande est « En attente de paiement » → on continue, il pourra modifier.
- Sinon (préparée, terminée, annulée, etc.) → on affiche le message (texte à composer plus tard) qui finit par un bouton **Fermer** → retour à l'accueil.

### Étape 5 — Afficher la commande, prête à être modifiée
- On montre sa commande (= sa liste de coups de cœur).
- Il peut : enlever un produit / changer une quantité / rajouter un produit.
- Rien d'autre : pas de livraison, pas de promo, pas de total.

### Étape 6 — Renvoyer la liste modifiée (le retour)
- Quand il a fini, il renvoie sa liste.
- Les produits gelés **restent gelés** (on ne relâche rien).
- On range l'ancienne version à côté de la nouvelle (colonnes/lignes en plus dans la feuille).
- La commande passe au statut **« À retravailler »**.

### Étape 7 — Le bouton dans le courriel (EN DERNIER)
- Une fois que tout ce qui précède fonctionne, on ajoute le bouton **« Modifier ou annuler »** dans le courriel de proposition. (Nom unifié avec 1.d : c'est le MÊME bouton qui sert à modifier ET à annuler — l'annulation se fait sur la page, voir 1.d.)
- Ce bouton transporte le numéro de commande et pointe vers la page d'atterrissage.
- On le branche en dernier pour qu'il ne mène jamais à du vide.

### Plus tard (côté Chantal — pas maintenant)
- Afficher les deux versions côte à côte dans le tableau admin.
- Faire apparaître le nouveau statut « À retravailler » dans le tableau.
- Quand Chantal refait sa proposition à partir de la nouvelle liste : la nouvelle devient la commande, l'ancienne est jetée.

---

## CE QU'IL FAUT POUR CHAQUE ÉTAPE (les ingrédients, pas le code)

Rappel des fichiers en jeu :
- `index.html` — la page vitrine publique (le décor, les sections)
- `main-demande.js` — le système de coups de cœur (liste, ajouter/retirer/quantité, la modal)
- `Code.gs` (uc2) — le serveur (va chercher et range les données)

### Étape 1 — La page d'atterrissage
- Une **nouvelle section** dans `index.html`, bâtie sur le même modèle que les sections existantes (comme la section « Merci »).
- On réutilise le décor déjà là (mêmes classes de style, mêmes couleurs). Rien de neuf à dessiner.
- Cette section contient juste : un espace pour afficher la commande, et un espace pour le message « pas modifiable » + bouton Fermer.
- Aucun serveur à ce stade.

### Étape 2 — Lire le numéro de commande
- Le numéro voyage dans l'adresse du lien (par exemple `...?modifier=CMD-0042`).
- Un petit bout de logique dans `main-demande.js` qui, au chargement de la page, regarde si ce numéro est présent dans l'adresse.
- Si oui → on déclenche le mode « modifier ». Si non → la page reste normale.
- **À décider au moment de bâtir :** le mot exact utilisé dans l'adresse (`modifier`, `commande`, etc.).

### Étape 3 — Aller chercher la commande
- Le serveur sait déjà répondre à « donne-moi cette commande » (les fonctions existent déjà dans `Code.gs` : entête + lignes). On les réutilise, rien à créer côté serveur.
- On reçoit : produits, quantités, prix, **et le statut**.
- **Point important :** les lignes de commande contiennent les numéros de produits, pas leurs noms ni leurs photos. Pour les afficher joliment dans la liste de coups de cœur, on doit relier chaque numéro de produit au catalogue (déjà chargé sur le site) pour retrouver nom, photo, collection, gamme.

### Étape 4 — Vérifier si la commande est modifiable
- On regarde le statut reçu à l'étape 3.
- Si « En attente de paiement » → on passe à l'affichage (étape 5).
- Sinon → on affiche le message + bouton Fermer (le Fermer ramène à l'accueil, comme les boutons « retour » déjà présents).
- C'est une simple vérification, aucun nouveau morceau de serveur.

### Étape 5 — Afficher la commande, prête à modifier
- On **réutilise la liste de coups de cœur qui marche déjà** (`main-demande.js` : l'affichage de la liste, les boutons − / + / Retirer).
- Le seul ajout : remplir cette liste avec les produits de la commande qu'on vient de chercher, puis l'afficher.
- Les boutons existants font déjà le travail (enlever / changer quantité / rajouter). Quasi rien de neuf.

### Étape 6 — Renvoyer la liste modifiée (LE GROS MORCEAU)
- C'est ici qu'il faut **créer une nouvelle fonction serveur** dans `Code.gs` (il n'en existe pas pour ça).
- Cette fonction doit, en un seul geste :
  - **garder les produits gelés** (donc surtout NE PAS appeler la fonction qui relâche le stock)
  - **ranger l'ancienne version à côté de la nouvelle** dans la feuille. **DÉCIDÉ : des lignes en plus** (pas des colonnes). On garde les lignes d'origine telles quelles, on ajoute les nouvelles lignes en-dessous marquées « nouvelle version ». Ça gère un produit enlevé, ajouté, ou une quantité changée. Une fois la proposition refaite par Chantal, on jette les lignes d'origine.
  - **changer le statut** de la commande pour « À retravailler »
- Côté `main-demande.js` : au moment d'envoyer, on appelle **cette nouvelle fonction** (et non `envoyerDemandeCommande`, qui elle crée une commande neuve).
- Un petit écran de confirmation pour le client (« on a bien reçu vos changements »), bâti sur le modèle de l'écran « Merci » déjà existant.
- **À décider au moment de bâtir :** comment exactement on range l'ancienne version (colonnes en plus vs lignes en plus).

### Étape 7 — Le bouton dans le courriel
- Dans `Code.gs`, la fonction qui construit le courriel de proposition (`envoyerProposition_v2`) contient déjà le bouton « payer ».
- On y ajoute un **deuxième bouton** « Changer ma commande ».
- Ce bouton pointe vers l'adresse de la page d'atterrissage, avec le numéro de commande dedans (le format décidé à l'étape 2).
- Branché en dernier, pour qu'il ne mène jamais à du vide.

---

# BRANCHE 1.c — « QUESTION / AJUSTEMENT » (TRANCHÉE ✅)

Contexte : le client a reçu sa proposition par courriel et veut poser une question plutôt que payer ou modifier.

## La logistique, en puces

- Le client a un bouton **« J'ai une question »** dans le courriel de proposition
- Il atterrit **direct dans la section Contact existante** du site (on réutilise ce qui est là, rien de neuf à dessiner)
- Le bouton pré-règle le sujet sur **« Question sur une commande »** et pré-remplit : nom, courriel, numéro de commande
- **Le champ « Numéro de commande » suit le sujet** : il apparaît dès que le sujet « Question sur une commande » est choisi, peu importe comment (par le bouton OU par le menu déroulant). Pour tout autre sujet, il reste caché.
- **« Question sur une commande » est un choix permanent dans le menu déroulant** — n'importe qui peut le sélectionner et inscrire son numéro à la main
- Il envoie → **même écran « Merci pour votre message »** que d'habitude, avec une petite phrase de plus liée à la commande (texte à composer plus tard)
- Côté Chantal, le courriel reçu a comme entête : `[Univers Caresse] Question sur une commande — {numéro de commande} — {prénom} {nom}`
- S'il n'y a pas de numéro (quelqu'un qui choisit le sujet sans commande), l'entête n'a simplement pas de numéro

## ÉTAPES DE RÉALISATION 1.c (dans cet ordre, un OK entre chaque)

Fichiers en jeu :
- `index.html` — la section Contact (le menu déroulant + le nouveau champ)
- `main.js` — la logique du formulaire de contact côté public (afficher/cacher le champ, envoyer, message de confirmation)
- `Code.gs` (uc2) — la fonction `envoyerContact_v2` (entête du courriel) et la fonction `envoyerProposition_v2` (le courriel où on ajoute le bouton)

### Étape 1 — Ajouter le sujet dans le menu déroulant
- Dans `index.html`, section Contact, le menu déroulant des sujets existe déjà.
- On y ajoute un choix de plus : **« Question sur une commande »**.
- Rien d'autre à cette étape.

### Étape 2 — Ajouter le champ « Numéro de commande » (caché au départ)
- Dans `index.html`, dans le formulaire de contact, on ajoute un nouveau champ « Numéro de commande ».
- Au départ il est **caché**.

### Étape 3 — Le champ suit le sujet (apparaît / disparaît)
- Dans `main.js`, un petit bout de logique qui surveille le menu déroulant.
- Si le sujet choisi est « Question sur une commande » → le champ apparaît.
- Tout autre sujet → le champ se cache.

### Étape 4 — Envoyer le numéro au serveur + entête du courriel
- Dans `main.js`, au moment d'envoyer le formulaire, on inclut la valeur du champ « Numéro de commande » dans ce qui part vers le serveur.
- Dans `Code.gs` (`envoyerContact_v2`), on ajuste l'entête du courriel pour insérer le numéro **quand il est présent** :
  - avec numéro → `[Univers Caresse] Question sur une commande — {numéro} — {prénom} {nom}`
  - sans numéro → `[Univers Caresse] Question sur une commande — {prénom} {nom}`

### Étape 5 — La petite phrase dans l'écran de confirmation
- Le formulaire affiche déjà un message « Merci pour votre message » après l'envoi (zone de succès dans `index.html`, déclenchée par `main.js`).
- On ajoute une petite phrase de plus **seulement** quand un numéro de commande était présent.
- **À décider au moment de bâtir :** le texte exact de cette phrase.

### Étape 6 — Le bouton « J'ai une question » dans le courriel (EN DERNIER)
- Dans `Code.gs`, le courriel de proposition (`envoyerProposition_v2`) contient déjà le bouton « payer ».
- On y ajoute le bouton **« J'ai une question »**.
- Ce bouton amène le client à la section Contact, avec le sujet déjà mis sur « Question sur une commande » et le numéro déjà rempli.
- Pour que l'atterrissage règle le sujet et remplisse les champs tout seul, on utilise le même principe de lien que 1.b (un repère dans l'adresse, lu au chargement par `main.js` / `main-demande.js`).
- Branché en dernier, pour qu'il ne mène jamais à du vide.

### À décider au moment de bâtir (1.c)
- Comment le nom et le courriel du client se pré-remplissent à l'arrivée : soit transportés dans le lien (c'est court, ça rentre), soit allés chercher par le numéro de commande (comme 1.b). On tranchera en bâtissant — aucun impact sur la mécanique déjà décidée.
- Le mot/repère exact dans l'adresse du lien (je décide, c'est de la cuisine interne).

---

# BRANCHE 1.d — « DIRE NON / ANNULER » (TRANCHÉE ✅)

Contexte : le client a reçu sa proposition et ne veut pas y donner suite.

## Décision clé : on réutilise 1.b
- Pas de bouton « Non » séparé ni de page séparée.
- Le bouton de 1.b devient **« Modifier ou annuler »** (un seul bouton).
- Le client atterrit sur la **même page** que 1.b (sa commande affichée).
- De là, il peut soit retoucher sa liste (1.b), soit annuler.

## La logistique, en puces
- Sur la page de sa commande, **en bas** : un bouton **« Annuler cette commande »**
- Il clique → un **avertissement** apparaît (genre « Êtes-vous sûr? ») ; il doit confirmer
- S'il se ravise, il peut reculer et revenir à sa commande
- S'il confirme → les produits **restent gelés** (on ne relâche rien — comme 1.b)
- La commande passe au statut **« À annuler »** → elle se déplace dans le tableau admin
- Chantal est prévenue de **deux** façons : le statut dans le tableau **ET** un courriel d'avertissement
- Le client voit un **message de confirmation** (texte à composer plus tard)
- Chantal a le dernier mot (annuler pour vrai, ou autre chose)

## ÉTAPES DE RÉALISATION 1.d (dans cet ordre, un OK entre chaque)

Fichiers en jeu :
- `index.html` — la page d'atterrissage de 1.b (on y ajoute le bouton d'annulation + l'avertissement + le message de confirmation)
- `main-demande.js` — la logique (afficher l'avertissement, envoyer l'annulation)
- `Code.gs` (uc2) — une nouvelle fonction serveur pour l'annulation + le courriel d'avertissement, et le courriel de proposition (`envoyerProposition_v2`) pour renommer le bouton

### Étape 1 — Le bouton « Annuler cette commande »
- Dans `index.html`, sur la page de modification (celle de 1.b), ajouter en bas un bouton « Annuler cette commande ».

### Étape 2 — L'avertissement de confirmation
- Dans `main-demande.js`, quand il clique le bouton : afficher un avertissement (« Êtes-vous sûr? »).
- Deux choix : confirmer, ou reculer (revenir à sa commande).

### Étape 3 — Envoyer l'annulation
- À la confirmation, `main-demande.js` appelle une **nouvelle fonction serveur** (voir étape 4).

### Étape 4 — La fonction serveur d'annulation (LE MORCEAU NEUF)
- Nouvelle fonction dans `Code.gs` qui, en un geste :
  - **garde les produits gelés** (NE PAS appeler la fonction qui relâche le stock)
  - **change le statut** de la commande pour **« À annuler »**
  - **envoie un courriel d'avertissement** à Chantal
- **À décider au moment de bâtir :** le texte du courriel d'avertissement.

### Étape 5 — Le message de confirmation au client
- À l'écran, après confirmation : un message de confirmation, bâti sur le modèle de l'écran « Merci » existant.
- **À décider au moment de bâtir :** le texte exact.

### Étape 6 — Renommer le bouton du courriel (EN DERNIER)
- Dans `Code.gs` (`envoyerProposition_v2`), le bouton « Modifier » (celui de 1.b) est renommé **« Modifier ou annuler »**.
- C'est le **même** bouton et le **même** lien que 1.b — rien de neuf à brancher, juste le mot qui change.

---

# CHEMIN #2 — « IL MANQUE DES MORCEAUX » (TRANCHÉ ✅, on ajustera à l'usage)

Contexte : Chantal prépare la proposition et n'a pas tout en stock. Une partie est prête, une partie manque.

## Principe de fond
- La proposition couvre **une seule commande**, montrée en **deux morceaux** pour que le client comprenne sa situation.
- Jamais d'argent encaissé avant qu'un produit soit prêt (pas de dette).

## La TWISTE conviviale : information en haut, actions en bas — TOUT SUR UNE SEULE PAGE
- Le courriel montre l'information et amène le client à **une seule page** (un seul endroit, pas de boutons éparpillés menant à des destinations différentes).
- Sur cette page :
  - **En haut = information** (juste pour comprendre, aucun bouton mêlant) :
    - Partie 1 — ce qui est prêt
    - Partie 2 — ce qui manque (avec date si temporaire / mention si définitif)
  - **En bas = actions** (toutes au même endroit, pour toute la commande) :
    - **Accepter et payer** → paie le prêt (s'active une fois la partie 2 réglée, puis mène à Square)
    - **Attendre** → ne paie rien
    - **Modifier ou annuler** → reprend toute la commande d'origine (réutilise 1.b / 1.d)
    - **J'ai une question** → réutilise 1.c
- **Affichage progressif :** PAS tous les boutons en même temps. Le client voit d'abord sa commande et l'essentiel ; les autres options se dévoilent quand c'est leur tour. Ça garde la page calme et douce. Le détail de quoi se cache et quand ça apparaît = décor d'écran, réglé en bâtissant.
- Important : ce ne sont PAS deux commandes avec chacune leurs boutons. C'est une seule commande, deux morceaux d'info, toutes les actions au même endroit. Si le client modifie, il reprend le tout → ça repart chez Chantal qui refait le partage prêt/manquant au complet.

## La partie 2 (ce qui manque) en détail
- Chaque produit manquant est marqué **par Chantal** : **temporaire** ou **définitif** (⚑ écran de préparation = côté Chantal, plus tard).
- **Temporaire** → on affiche une **date** + le choix **« garder / laisser tomber »**
  - Date : si un lot est déjà en cure → sa date de disponibilité ; sinon on calcule **date d'envoi + temps de cure du produit + 1 semaine de coussin**. On utilise celle qui s'applique.
- **Définitif** → **info seule**, aucun choix.

## Le choix global du client : envoyer le prêt OU attendre

### Si « envoyer le prêt »
- Il paie le prêt maintenant → la commande initiale devient **« À expédier »**
- Les produits gardés (temporaires) → une **2e commande automatique** avec un **nouveau statut** (à nommer, genre « À fabriquer ») → reproposée le temps venu
- Les définitifs sont retirés

### Si « attendre »
- Il ne paie rien, rien ne s'expédie
- La commande attend que **tous les refaisables** soient prêts
- Le définitif est retiré et il en est informé
- Message à l'écran : « on vous recontacte quand tout sera prêt »
- Le temps venu, Chantal repropose la commande **complète, sans le définitif**

### SI tranché — payer sans répondre à la partie 2
- Le bouton « payer » s'active **seulement** quand chaque produit **temporaire** a reçu sa réponse (garder / laisser tomber).
- Les produits **définitifs** sont de l'info seule → ils ne bloquent rien.
- Donc le client est obligé de décider du sort de chaque manquant temporaire avant de pouvoir payer le prêt.

### Cas « rien de gardé » (tout définitif ou tout laissé tomber)
- Ça retombe simplement sur « il paie le prêt »
- Avec un petit mot : « les autres produits ne sont plus disponibles, voici ce qui reste »

### SI tranché — la livraison « payée deux fois »
- Pas de double-livraison automatique imposée.
- La 2e commande repasse par le **même chemin de proposition** qu'une commande normale, où Chantal contrôle déjà la livraison librement (montant au choix : zéro, réduit, normal) + rabais/promo.
- Chantal décide **au moment de reproposer** la 2e commande : absorber, offrir, ou charger la livraison, selon le poids et son jugement.
- Rien de neuf à programmer : c'est le contrôle habituel sur la proposition qui s'en occupe.

## CE QU'IL FAUT / COMMENT (les ingrédients, pas le code)

Fichiers en jeu :
- `Code.gs` (uc2) — la fonction du courriel de proposition (`envoyerProposition_v2`) doit être retravaillée pour montrer **2 parties** (aujourd'hui elle montre une seule liste) ; une **nouvelle fonction** pour créer la 2e commande (produits gardés) avec son nouveau statut ; le calcul de date (lot en cure → sa date ; sinon envoi + cure + coussin)
- `index.html` / `main-demande.js` — l'endroit où le client fait ses choix de la partie 2 (garder/laisser tomber, envoyer/attendre)
- Réutilise : « Accepter et payer » = le lien Square existant ; « Modifier ou annuler » = 1.b/1.d ; « J'ai une question » = 1.c

### Détails de mécanique
- **Le calcul de date** s'appuie sur le temps de cure, déjà connu par produit dans le système.
- **La 2e commande** : nouvelle fonction serveur qui crée une commande ne contenant que les produits gardés, avec le nouveau statut, sans toucher au paiement.
- **Le partage prêt / manquant** se fait à partir de ce que le système sait disponible (les lots dispo) vs ce que le client a demandé.

### ⚑ À DÉCIDER / VÉRIFIER au moment de bâtir (point mécanique réel)
- **Où le client fait ses choix de la partie 2 : TRANCHÉ — une seule page.** Le courriel ne tient pas de cases interactives ; il amène donc à une page (style 1.b) qui contient tout : l'info, les choix de la partie 2, le paiement, et les autres actions (en affichage progressif).
- Le nom du nouveau statut de la 2e commande.
- Les textes des messages.

## ⚑ Drapeaux côté Chantal (plus tard)
- L'écran de préparation où Chantal marque chaque produit manquant : temporaire ou définitif
- La création automatique de la 2e commande + son nouveau statut dans le tableau admin

## SI tranchés — revenir en arrière après une action (1.b et 1.d)
- **Règle générale :** dès qu'une commande quitte le statut « En attente de paiement » (parce que le client a modifié → « À retravailler », ou annulé → « À annuler »), le lien du courriel ne permet plus rien → message « plus modifiable » + Fermer.
- **Se raviser après une annulation :** impossible côté client. C'est dans les mains de Chantal. S'il change d'idée, il écrit.
- **Remodifier après avoir déjà modifié :** impossible aussi. Il doit attendre la nouvelle proposition de Chantal pour pouvoir agir à nouveau.
- **Pourquoi c'est bon :** une seule demande en traitement à la fois, rien ne s'empile pendant que Chantal travaille dessus.

---

# CHEMIN #3 — « RIEN DE PRÊT » (TRANCHÉ ✅, on ajustera à l'usage)

Contexte : Chantal prépare la proposition et n'a **rien** de disponible. C'est le chemin #2 sans la partie 1.

## La situation
- Rien de prêt, zéro disponible
- Donc pas de partie 1, rien à payer maintenant, pas de choix « envoyer / attendre » (c'est forcément attendre)

## Ce qu'on réutilise du #2
- Chaque produit est marqué **par Chantal** : temporaire (avec date) ou définitif (info)
- **Temporaire** → date + choix **« garder / laisser tomber »**, **produit par produit**
- **Définitif** → info seule, aucun choix
- (Le « produit par produit » vaut aussi pour le #2 — confirmé.)

## Ce qu'il advient
- Les produits **gardés** → la commande d'origine ne conserve que ceux-là et bascule dans le **même nouveau statut « à refaire »** que la 2e commande du #2 (tout ce qui attend la fabrication se retrouve à la même place dans le tableau)
- Le temps venu, Chantal repropose
- Les définitifs et les « laissés tomber » sont retirés
- Message au client : « on vous recontacte quand ce sera prêt » (texte à composer plus tard)

## Si rien ne reste (tout définitif ou tout laissé tomber)
- La commande bascule en **« À annuler »** (Chantal y jette un œil avant que ce soit final)
- Rien n'était gelé → rien à relâcher

## CE QU'IL FAUT / COMMENT (les ingrédients, pas le code)
- Réutilise presque tout le #2 : l'affichage du manquant (temporaire/définitif + date), les choix produit par produit, le calcul de date.
- Différence : pas de partie 1, pas de paiement, pas de bouton « accepter et payer ».
- Côté serveur (`Code.gs`) : la commande d'origine bascule dans le statut « à refaire » avec seulement les produits gardés ; ou en « À annuler » si rien ne reste.
- Même drapeau que le #2 : où le client fait ses choix (probablement une page, pas le courriel — à confirmer en bâtissant).

# SI VÉRIFIÉS / ÉCARTÉS (pour ne pas les rouvrir)

- **Payer l'ancienne version après avoir modifié/annulé → RÉGLÉ en fermant le vieux lien.** Quand le client modifie (→ « À retravailler ») ou annule (→ « À annuler »), on **désactive le lien de paiement Square** de l'ancienne proposition. Son vieux bouton « payer » cesse de fonctionner. Quand Chantal repropose, elle génère un **nouveau** lien propre.
  - ⚑ Détail de construction : le système doit **retenir l'identifiant du lien Square** (pas juste son URL) au moment de le créer, pour pouvoir le fermer ensuite. Aujourd'hui le code ne garde que l'URL (`lien_square`). À ajuster en bâtissant.
- **Payer deux fois le même prêt → IMPOSSIBLE, déjà sécuritaire.** Le système génère des liens Square de type « quick pay », qui sont **payables une seule fois** par nature (vérifié dans la doc développeur Square). Après le premier paiement, le lien ne se laisse plus payer. Rien à programmer.
- **Lien partagé / ouvert sur deux appareils en même temps → ÉCARTÉ volontairement.** Jugé trop rare pour compliquer. On s'en occupera si jamais ça arrive.
- **Stock qui change entre la proposition et l'action → ÉCARTÉ.** La fenêtre est de 2-3 jours (délai de réponse habituel) — trop court pour qu'un manquant devienne prêt entre-temps.
- **Durée de vie du lien / proposition → PAS ÉTERNEL (certain), détails plus tard.** Le lien et le gel ne durent pas indéfiniment. Le combien de temps exact, le moment où le stock se dégèle de lui-même, et les rappels → à décider plus tard. C'est le drapeau « client silencieux + rappels ».
- **Plusieurs commandes pour le même client → AUCUN PROBLÈME.** Tout (lien, page, gel, statut, paiement) est accroché au **numéro de commande** (CMD-000x), pas au client. Deux commandes du même client = comme deux clients différents pour le système. Elles ne se croisent jamais.

## SI EN SUSPENS (à décider une autre fois — pas tranché)

- **Timing de la 2e commande quand le paiement n'aboutit pas (#2).** Décidé : tout s'enregistre au moment où le client clique « payer » (avant de partir vers Square), pour que rien ne soit perdu s'il ne revient pas. Conséquence non tranchée : la 2e commande se crée donc dès le clic, **même si le client n'achève pas son paiement** sur Square. À décider : accepter ça (les deux commandes attendront / ressortiront dans les rappels), OU empêcher la création de la 2e commande tant que le prêt n'est pas vraiment payé. **Laissé ouvert volontairement.**

## SI PAS ENCORE REGARDÉS (notés pour une prochaine fois)

- **Comment Chantal sait que le client a payé.** Le paiement Square ne fait pas avancer la commande tout seul ; c'est Chantal qui clique « Paiement reçu » dans l'admin. Elle l'apprend par un courriel « paiement reçu » de Square, puis fait le lien à la main. Trou de suivi côté Chantal — à regarder avec le côté admin.
- **Un produit disparaît du catalogue entre les coups de cœur et la proposition.** La commande pointe vers un produit archivé/supprimé (nom, photo). Quoi afficher? Non tranché.
- **Le client vide complètement sa liste en modifiant (1.b).** Une liste vide renvoyée = annulation déguisée? Non tranché.

---

## NOTES DE COHÉRENCE (à garder en tête pour ne pas se mêler)

- **Le bouton du courriel s'appelle « Modifier ou annuler ».** Un seul bouton sert à la fois à modifier (1.b) et à annuler (1.d) — l'annulation est une action sur la page, pas un bouton séparé dans le courriel.
- **Présentation du courriel — différence entre les chemins :**
  - **Chemin #1 (tout est prêt)** : le courriel de proposition contient des boutons (« payer » vers Square, « Modifier ou annuler » vers la page, « J'ai une question » vers Contact). C'est l'existant + nos ajouts.
  - **Chemins #2 et #3 (il manque des morceaux / rien de prêt)** : le courriel amène plutôt à **une seule page** qui contient tout (info, choix de la partie 2, paiement, et les autres actions en affichage progressif), parce qu'un courriel ne peut pas tenir les choix interactifs.
  - À garder en tête en bâtissant : ce n'est pas la même présentation de courriel selon qu'il manque des morceaux ou non. (Si un jour on veut tout uniformiser sur une page même pour le #1, ce serait une décision à prendre — pas tranchée.)
- **Statut « à refaire » = nom à choisir.** Utilisé pour la 2e commande du #2 et la commande en attente du #3.

---

## OÙ ON EST RENDUS

- **Côté client : TERMINÉ.** Tous les chemins sont tranchés dans ce document :
  - 1.a — payer (existe déjà)
  - 1.b — modifier ✅
  - 1.c — question ✅
  - 1.d — annuler ✅ (réutilise 1.b)
  - Chemin #2 — il manque des morceaux ✅
  - Chemin #3 — rien de prêt ✅
- **Récapitulatif des nouveaux statuts à créer :**
  - « À retravailler » (1.b)
  - « À annuler » (1.d, + #3 quand rien ne reste)
  - « À refaire » / nom à choisir (2e commande du #2, et commande qui attend du #3)
- **Prochaine grande étape : le côté Chantal (admin)** — pas encore réfléchi. Notamment :
  - L'écran de préparation où Chantal marque chaque produit manquant temporaire/définitif
  - L'affichage des deux versions côte à côte (1.b)
  - La création automatique de la 2e commande (#2)
  - Les nouveaux statuts qui apparaissent dans le tableau admin
  - Comment Chantal apprend les paiements, annulations, etc.
- **Drapeaux encore ouverts (de l'ancien document) :**
  - Fenêtre avant la proposition : entre l'envoi des coups de cœur et la proposition, le client n'a aucun chemin pour modifier/annuler. À décider.
  - Client silencieux + rappels : proposition envoyée, stock gelé, plus de nouvelles. Quand le stock se dégèle-t-il de lui-même? Rappels? À développer.

---

## POUR REPRENDRE

Phrase suggérée pour démarrer une nouvelle conversation :

> Voici le document de reprise + les fichiers. Tout le côté client est tranché (1.b, 1.c, 1.d, chemins #2 et #3). On respecte les règles de travail en haut. On attaque le côté Chantal (admin), ou on commence à bâtir le côté client — je te dirai lequel.
