# 🦀 Tokenizer BPE en Rust

Projet académique d'équipe  
Avec Eliott Alfandari et Refaël Aharouni

> 🔗 [Repository original](https://github.com/RefaelAharouni/Project_Rust_Killian_Refael_Eliott) · [Mes contributions](https://github.com/RefaelAharouni/Project_Rust_Killian_Refael_Eliott/commits?author=Kostleky)

---

## 📖 Contexte

Implémentation complète de l'algorithme **Byte Pair Encoding (BPE)** en Rust, avec une CLI fonctionnelle (train / encode / decode).  
BPE est l'algorithme de tokenisation utilisé par GPT, LLaMA et la majorité des LLM modernes.

---

## 🏗️ Structure réelle du projet

```
Project_Rust_Killian_Refael_Eliott/
├── src/
│   ├── main.rs           # CLI (train / encode / decode)
│   ├── bpe.rs            # Algorithme BPE — apprentissage des fusions
│   ├── tokenizer.rs      # Interface encode / decode
│   ├── vocabulary.rs     # Mapping token ↔ ID + sérialisation JSON
│   └── preprocessor.rs   # Normalisation du texte
├── data/                 # Corpus d'entraînement
├── docs/                 # Documentation des algorithmes
├── bpe_model.json        # Modèle entraîné (sérialisé)
├── vocabulary.json       # Vocabulaire (sérialisé)
└── Cargo.toml
```

---

## 🔑 Algorithme BPE

```
1. Tokenisation initiale en caractères
2. Compter toutes les paires adjacentes
3. Fusionner la paire la plus fréquente → nouveau token
4. Répéter N fois (paramètre --merges)
5. Sauvegarder le modèle en JSON
```

**Exemple avec 3 itérations** :

```
Corpus : "aaabdaaabac"
Init   : [a, a, a, b, d, a, a, a, b, a, c]
Iter 1 : paire ("a","a") → "aa"  → [aa, a, b, d, aa, a, b, a, c]
Iter 2 : paire ("aa","a") → "aaa" → [aaa, b, d, aaa, b, a, c]
Iter 3 : paire ("aaa","b") → "aaab" → [aaab, d, aaab, a, c]
```

---

## 🚀 Utilisation

```bash
cargo build --release

# Entraîner le modèle sur un corpus
cargo run --release -- train data/corpus.txt --merges 200

# Encoder du texte → séquence d'IDs
cargo run --release -- encode "les chats dorment"

# Décoder des IDs → texte
cargo run --release -- decode 14 33 34 56 20
```

---

## 🧪 Tests & qualité

```bash
cargo test                    # tests unitaires
cargo clippy -- -D warnings   # linter strict (0 warning)
cargo fmt                     # formatage
cargo doc --open              # documentation générée
```

---

## 🔒 Ce que ce projet démontre sur Rust

Le compilateur Rust **interdit à la compilation** des erreurs qui causent ~70% des CVE critiques en C/C++ :

**Pas de dangling pointer**
```rust
let data = vec![1, 2, 3];
let r = &data[0];
drop(data); // ❌ Erreur de compilation — r ne peut plus être utilisé
```

**Pas de data race**
```rust
// Deux threads ne peuvent pas modifier la même donnée
// sans synchronisation explicite — refusé au compile-time
```

**Pas d'exception cachée**
```rust
// Toute erreur est un Result<T, E> — le compilateur force à la gérer
let content = fs::read_to_string(path)?; // propagation explicite avec ?
```

Ces garanties sont la raison pour laquelle NSA, Microsoft, Google et AWS migrent des composants critiques vers Rust.

---

## 👥 Répartition du travail

| Module | Auteur principal |
|--------|-----------------|
| `preprocessor.rs` | Eliott |
| `tokenizer.rs` + `vocabulary.rs` | Refaël |
| `bpe.rs` + `main.rs` | Killian |

[Historique Git complet](https://github.com/RefaelAharouni/Project_Rust_Killian_Refael_Eliott/graphs/contributors)

> Copie archivée pour le portfolio. Projet actif sur le [repository original](https://github.com/RefaelAharouni/Project_Rust_Killian_Refael_Eliott).

---

[Retour au portfolio](../../README.md)
