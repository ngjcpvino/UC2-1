/* ═══════════════════════════════════════
   UNIVERS CARESSE — demande.js
   Système de demande de commande (étape 2)
   Activé par le flag ?test=1 dans l'URL
   ═══════════════════════════════════════ */

// ─── DÉTECTION DU FLAG TEST ───
const DEMANDE_ACTIVE = new URLSearchParams(window.location.search).has('test');

// ─── ÉTAT GLOBAL ───
const DEMANDE_STORAGE_KEY = 'uc_demande';
let demandeListe = [];

// ─── CHARGEMENT INITIAL ───
function chargerDemandeListe() {
  try {
    const raw = localStorage.getItem(DEMANDE_STORAGE_KEY);
    demandeListe = raw ? JSON.parse(raw) : [];
  } catch (e) {
    demandeListe = [];
  }
}

// ─── SAUVEGARDE ───
function sauvegarderDemandeListe() {
  try {
    localStorage.setItem(DEMANDE_STORAGE_KEY, JSON.stringify(demandeListe));
  } catch (e) {
    console.error('Erreur sauvegarde liste de demande :', e);
  }
}

// ─── CLÉ UNIQUE D'UN ITEM (pro_id + format) ───
function demandeCle(pro_id, format_poids, format_unite) {
  return String(pro_id) + '|' + String(format_poids) + '|' + String(format_unite);
}

// ─── AJOUTER UN ITEM ───
function demandeAjouter(pro_id, format_poids, format_unite, nom_produit, prix_unitaire) {
  const cle = demandeCle(pro_id, format_poids, format_unite);
  const existant = demandeListe.find(i => demandeCle(i.pro_id, i.format_poids, i.format_unite) === cle);
  if (existant) {
    existant.quantite = (existant.quantite || 1) + 1;
  } else {
    demandeListe.push({
      pro_id,
      format_poids,
      format_unite,
      nom_produit,
      prix_unitaire,
      quantite: 1
    });
  }
  sauvegarderDemandeListe();
  demandeRafraichirAffichage();
}

// ─── RETIRER UN ITEM ───
function demandeRetirer(pro_id, format_poids, format_unite) {
  const cle = demandeCle(pro_id, format_poids, format_unite);
  demandeListe = demandeListe.filter(i => demandeCle(i.pro_id, i.format_poids, i.format_unite) !== cle);
  sauvegarderDemandeListe();
  demandeRafraichirAffichage();
}

// ─── CHANGER LA QUANTITÉ ───
function demandeChangerQuantite(pro_id, format_poids, format_unite, delta) {
  const cle = demandeCle(pro_id, format_poids, format_unite);
  const item = demandeListe.find(i => demandeCle(i.pro_id, i.format_poids, i.format_unite) === cle);
  if (!item) return;
  item.quantite = Math.max(1, (item.quantite || 1) + delta);
  sauvegarderDemandeListe();
  demandeRafraichirAffichage();
}

// ─── VÉRIFIER SI UN ITEM PRÉCIS EST DANS LA LISTE ───
function demandeContient(pro_id, format_poids, format_unite) {
  const cle = demandeCle(pro_id, format_poids, format_unite);
  return demandeListe.some(i => demandeCle(i.pro_id, i.format_poids, i.format_unite) === cle);
}

// ─── VÉRIFIER SI UN PRODUIT (TOUS FORMATS) EST DANS LA LISTE ───
function demandeContientProduit(pro_id) {
  return demandeListe.some(i => String(i.pro_id) === String(pro_id));
}

// ─── NOMBRE TOTAL D'ITEMS COCHÉS ───
function demandeNombreItems() {
  return demandeListe.length;
}

// ─── SOUS-TOTAL ───
function demandeSousTotal() {
  return demandeListe.reduce((s, i) => s + (i.prix_unitaire || 0) * (i.quantite || 1), 0);
}

// ─── VIDER LA LISTE (après envoi réussi) ───
function demandeVider() {
  demandeListe = [];
  sauvegarderDemandeListe();
  demandeRafraichirAffichage();
}

// ─── RAFRAÎCHIR L'AFFICHAGE (étoffé aux étapes suivantes) ───
function demandeRafraichirAffichage() {
  // Sera étendu pour mettre à jour la bulle compteur, les cartes, la modal de liste, etc.
}

// ─── INITIALISATION ───
document.addEventListener('DOMContentLoaded', () => {
  if (!DEMANDE_ACTIVE) return;
  chargerDemandeListe();
});