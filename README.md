# 🛡️ Portfolio — Killian BEGU

Projets techniques en cybersécurité et développement sécurisé.

---

## 📁 Projets

### [1. Chat Chiffré Diffie-Hellman](./projects/secure-chat-rust)
Protocole de messagerie chiffrée bout-en-bout, implémenté from scratch en Rust dans un seul `main.rs`.  
DH key exchange (64-bit safe prime), keystream LCG, chiffrement XOR, architecture client-serveur TCP.  
`Rust` `Cryptographie` `TCP` `Memory-safe`

### [2. Détection de Phishing — Machine Learning](./projects/phishing-detection-ml)
Classification de sites malveillants à partir de 30 indicateurs — **97.7% de précision, F1-score ~98%**.  
`Python` `scikit-learn` `Threat Detection` `Feature Engineering`

### [3. STMS — DevSecOps](./projects/stms-devops)
Application MERN avec JWT sécurisé, RBAC, tests de sécurité et pipeline CI/CD.  
`Node.js` `React` `MongoDB` `GitHub Actions` `144 tests · 94% coverage`

### [4. Tokenizer BPE en Rust](./projects/tokenizer-rust)
Implémentation de l'algorithme Byte Pair Encoding avec architecture modulaire en 4 fichiers source.  
`Rust` `bpe.rs` `tokenizer.rs` `vocabulary.rs` `preprocessor.rs`

---

## 🗂️ Structure

```
Portfolio/
├── projects/
│   ├── secure-chat-rust/      ← rust_03 du rust_bootcamp
│   ├── phishing-detection-ml/
│   ├── stms-devops/
│   └── tokenizer-rust/
└── README.md
```

---

*Dernière mise à jour : Février 2026*
