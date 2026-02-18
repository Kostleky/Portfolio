# Modules Tokenizer et Vocabulary

## Vue d'ensemble

Ces deux modules travaillent ensemble pour convertir des tokens en IDs numériques et inversement.

- **Vocabulary** : Gère le mapping bidirectionnel token ↔ ID
- **Tokenizer** : Utilise le vocabulaire pour encoder et décoder

## Module Vocabulary

### Objectif

Maintenir un dictionnaire qui associe chaque token unique à un ID numérique.

### Tokens spéciaux

- [UNK] : Token inconnu (ID 0)
- [PAD] : Token de padding (ID 1)

### Fonctionnalités

#### Création

    let mut vocab = Vocabulary::new();
    // Contient déjà [UNK] et [PAD]

#### Ajout de tokens

    vocab.add_token("hello");
    vocab.add_token("world");

#### Récupération ID → Token

    let id = vocab.get_id("hello");
    // Retourne: Some(2)

#### Récupération Token → ID

    let token = vocab.get_token(2);
    // Retourne: Some("hello")

#### Sauvegarde et chargement

    vocab.save("vocabulary.json").unwrap();
    let vocab = Vocabulary::load("vocabulary.json").unwrap();

### Structure du fichier JSON

    {
      "conversion_token_to_id": {
        "[UNK]": 0,
        "[PAD]": 1,
        "hello": 2,
        "world": 3
      },
      "conversion_id_to_token": {
        "0": "[UNK]",
        "1": "[PAD]",
        "2": "hello",
        "3": "world"
      },
      "next_id": 4
    }

## Module Tokenizer

### Objectif

Encoder des tokens en IDs pour le traitement numérique et décoder les IDs en tokens lisibles.

### Fonctionnalités

#### Création

    let mut tokenizer = Tokenizer::new();

#### Construction du vocabulaire

    let tokens = vec!["hello".to_string(), "world".to_string()];
    tokenizer.build_vocabulary(&tokens);

#### Encodage (tokens → IDs)

    let tokens = vec!["hello".to_string(), "world".to_string()];
    let ids = tokenizer.encode(&tokens);
    // Retourne: [2, 3]

#### Décodage (IDs → tokens)

    let ids = vec![2, 3];
    let tokens = tokenizer.decode(&ids);
    // Retourne: ["hello", "world"]

#### Gestion des tokens inconnus

    let unknown = vec!["xyz".to_string()];
    let ids = tokenizer.encode(&unknown);
    // Retourne: [0] (ID de [UNK])
    
    let decoded = tokenizer.decode(&ids);
    // Retourne: ["[UNK]"]

## Workflow complet

### Phase d'entraînement

    1. Preprocessing → mots nettoyés
    2. BPE → tokens optimisés
    3. Tokenizer.build_vocabulary() → création du vocabulaire
    4. Vocabulary.save() → sauvegarde

### Phase d'encodage

    1. Preprocessing → mots nettoyés
    2. BPE.encode() → tokens avec fusions
    3. Tokenizer.encode() → IDs numériques
    4. Utilisation dans modèle ML

### Phase de décodage

    1. Modèle ML → IDs numériques
    2. Tokenizer.decode() → tokens
    3. Reconstruction du texte

## Exemples d'utilisation

### Exemple complet

    use tokenizer_rs::tokenizer::Tokenizer;
    
    // Créer et entraîner
    let mut tokenizer = Tokenizer::new();
    let tokens = vec![
        "hello".to_string(),
        "world".to_string(),
        "rust".to_string()
    ];
    tokenizer.build_vocabulary(&tokens);
    
    // Encoder
    let test_tokens = vec!["hello".to_string(), "rust".to_string()];
    let ids = tokenizer.encode(&test_tokens);
    println!("IDs: {:?}", ids);
    
    // Décoder
    let decoded = tokenizer.decode(&ids);
    println!("Tokens: {:?}", decoded);
    
    // Sauvegarder
    tokenizer.vocabulary.save("vocab.json").unwrap();

### Gestion d'erreurs

    // Token inconnu
    let unknown = vec!["notinvocab".to_string()];
    let ids = tokenizer.encode(&unknown);
    // ids[0] == ID de [UNK]
    
    // ID invalide
    let invalid_ids = vec![9999];
    let tokens = tokenizer.decode(&invalid_ids);
    // tokens[0] == "[UNK]"

## Tests

    cargo test tokenizer
    cargo test vocabulary

Tests couverts :
- Création de vocabulaire
- Ajout de tokens
- Encodage/décodage basique
- Gestion tokens inconnus
- Sauvegarde/chargement
- Cas limites (vide, doublons)

## Intégration avec les autres modules

### Avec Preprocessor (Eliott)

    let words = preprocess("Les élèves apprennent");
    tokenizer.build_vocabulary(&words);

### Avec BPE (Kilian)

    let bpe_tokens = bpe.encode(&words);
    let ids = tokenizer.encode(&bpe_tokens);

### Workflow complet

    Texte brut
        ↓
    Preprocessor → mots nettoyés
        ↓
    BPE → sous-mots optimisés
        ↓
    Tokenizer → IDs numériques
        ↓
    Modèle ML
