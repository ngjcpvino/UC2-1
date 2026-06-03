# Découpage de Code.gs en fichiers

Règle d'or : **chaque fonction ne doit exister qu'une seule fois**, peu importe le fichier. Tous les `.gs` partagent le même espace, donc ça marche pareil. Coupe-colle un groupe à la fois.

---

## Routeur.gs (le standard téléphonique)
- `doGet`
- `doPost`

## Utilitaires.gs (outils partagés)
- `getSS`
- `toGrammes`
- `averageHexColors`
- `recalculerHexGamme_v2`
- `recalculerHexCollection_v2`
- `recalculerHexRegroupement_v2`
- `recalculerTousLesHex_v2`

## Collections_Gammes_Familles.gs
- `getCollections_v2` · `saveCollection_v2` · `deleteCollection_v2`
- `getGammes_v2` · `saveGamme_v2` · `deleteGamme_v2`
- `getGammesIngredients_v2` · `saveGammeIngredients_v2`
- `getFamilles_v2` · `saveFamille_v2` · `deleteFamille_v2`

## Produits.gs
- `getProduits_v2` · `saveProduit_v2` · `deleteProduit_v2`
- `getProduitsIngredients_v2` · `getProduitsFormats_v2`
- `getFormatsEmballages_v2` · `saveFormatsEmballages_v2`

## Ingredients.gs
- `getIngredientsInci_v2` · `saveIngredientInci_v2` · `createIngredientInci_v2`
- `getIngredientsUC_v2`
- `getCategoriesUC_v2` · `saveCategorieUC_v2` · `deleteCategorieUC_v2`

## Fournisseurs.gs
- `getFournisseurs_v2` · `saveFournisseur` · `deleteFournisseur`
- `getMappingFournisseurs_v2` · `saveMappingFournisseur_v2`
- `getCategoriesFournisseurs_v2` · `saveCategoriesFournisseur_v2`
- `getProduitsFournisseurs_v2` · `saveProduitFournisseur_v2`
- `getFormatsIngredients_v2`
- `getScrapingFournisseur_v2` · `rechercherScrapingFournisseur_v2`

## Achats.gs
- `getAchatsEntete_v2` · `getAchatsLignes_v2`
- `createAchatEntete_v2` · `addAchatLigne_v2` · `addAchatLignes_v2`
- `finaliserAchat_v2` · `deleteAchatLigne_v2` · `deleteAchat_v2`

## Stock_Lots.gs
- `mettreAJourStock_v2` · `getStock_v2` · `diminuerStockLot_v2`
- `recalculerStock_v2` · `recalculerPrixParG_v2`
- `getLots_v2` · `getLotsDisponibles_v2` · `saveLot_v2` · `updateLot_v2` · `deleteLot_v2`

## Ventes.gs
- `getVentesEntete_v2` · `getVentesLignes_v2`
- `createVente_v2` · `addVenteLigne_v2` · `finaliserVente_v2` · `updateStatutVente_v2`
- `resetVenteLignes_v2` · `deleteVente_v2`

## Commandes.gs  ← (celui qu'on travaille)
- `getCommandesEntete_v2` · `getCommandesLignes_v2` · `getCommandePublique_v2`
- `createCommande_v2` · `addCommandeLigne_v2` · `resetCommandeLignes_v2`
- `updateCommandeEntete_v2` · `updateStatutCommande_v2` · `updateCommandeComplete_v2`
- `sortirStockCommande_v2` · `remettreStockCommande_v2`
- `creerVenteDepuisCommande_v2`

## Remboursements.gs
- `getRemboursementsEntete_v2` · `getRemboursementsLignes_v2`
- `createRemboursement_v2` · `addRemboursementLigne_v2` · `finaliserRemboursement_v2`

## Promotions.gs
- `getPromotions_v2` · `savePromotion_v2` · `deletePromotion_v2`

## Courriels.gs
- `envoyerContact_v2`
- `envoyerDemandeCommande_v2`
- `envoyerProposition_v2` · `envoyerProposition_v2test`
- `envoyerFacture_v2`
- `envoyerProduitGraphiste_v2` · `genererProduitPdf_v2`

## Square.gs
- `creerLienPaiementSquare_v2`

## SitePublic.gs (contenu du site)
- `getCataloguePublic_v2`
- `getCataloguePages_v2` · `saveCataloguePage_v2` · `deleteCataloguePage_v2`
- `getContenu_v2` · `updateContenu_v2`
- `getMediatheque_v2` · `saveMediatheque_v2` · `supprimerMediatheque_v2`
- `getImagesLocales_v2`
- `syncCloudinary_v2`
- `exporterTextesSite_v2`

## Regroupements.gs (les « univers »)
- `getRegroupements_v2` · `saveRegroupement_v2` · `deleteRegroupement_v2`
- `getRegroupementsProduits_v2` · `saveProduitRegroupements_v2`

## Config.gs
- `getConfig_v2` · `saveConfig_v2`

## Divers.gs
- `validerMotDePasse_v2`
- `sauvegarderQuotidien_v2`

---

### Conseils
- Garde `doGet` / `doPost` ensemble dans **Routeur.gs** — c'est ton tableau de bord pour voir tous les noms d'action d'un coup d'œil.
- Coupe-colle **un fichier à la fois**, et recharge l'admin entre chaque pour vérifier que rien n'est cassé.
- Aucun redéploiement spécial : c'est le même projet, donc le déploiement reste le même.
