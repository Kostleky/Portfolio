# Algorithme BPE (Byte Pair Encoding)

## Principe

BPE est un algorithme qui apprend à découper les mots en sous-mots efficaces. Il fusionne progressivement les paires de caractères les plus fréquentes.

## Comment ça marche

### Exemple simple

Corpus initial :
- chat, chat, chat, chien

Étape 1 - Découpage en caractères :
- c-h-a-t, c-h-a-t, c-h-a-t, c-h-i-e-n

Étape 2 - Comptage des paires :
- (c,h) : 4 fois
- (h,a) : 3 fois
- (a,t) : 3 fois
- (h,i) : 1 fois

Étape 3 - Fusion de la paire la plus fréquente :
- (c,h) devient "ch"
- Résultat : ch-a-t, ch-a-t, ch-a-t, ch-i-e-n

Étape 4 - Répétition :
- On recommence jusqu'à avoir fait le nombre de fusions demandé.

## Structures de données

Structure principale :

    pub struct BPE {
        merges: Vec<(String, String)>,  // Liste des fusions
        vocab: Vec<String>,              // Tokens uniques
    }

- merges : Stocke les paires fusionnées dans l'ordre d'apprentissage
- vocab : Ensemble de tous les tokens possibles

## Fonctions principales

### train(corpus, num_merges)
Apprend les fusions sur un corpus.

Algorithme :
1. Découper le corpus en caractères
2. Répéter num_merges fois :
   - Compter les paires adjacentes
   - Trouver la paire la plus fréquente
   - Fusionner toutes ses occurrences
   - Sauvegarder la fusion

### encode(words)
Applique les fusions apprises à un nouveau texte.

Algorithme :
1. Découper en caractères
2. Appliquer chaque fusion dans l'ordre
3. Retourner les tokens finaux

### save(path) / load(path)
Sauvegarde et charge le modèle en JSON avec serde.

## Avantages

- Vocabulaire de taille raisonnable (10 000 - 50 000 tokens)
- Gère les mots inconnus en les découpant
- Fonctionne dans toutes les langues
- Utilisé dans GPT, RoBERTa, BART

## Utilisation

    let mut bpe = BPE::new();
    bpe.train(&corpus, 100);
    let tokens = bpe.encode(&["chat".to_string()]);
    bpe.save("model.json").unwrap();

## Complexité

- Entraînement : O(num_merges × taille_corpus)
- Encodage : O(num_merges × taille_texte)
