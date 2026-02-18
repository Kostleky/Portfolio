# 🔐 Chat Chiffré avec Diffie-Hellman

Projet personnel · Décembre 2025  
Issu du [rust_bootcamp](https://github.com/Kostleky/rust_bootcamp/tree/main/rust_03)

Implémentation from scratch d'un protocole de messagerie chiffrée bout-en-bout en Rust.  
Tout le code tient dans un seul fichier `src/main.rs` (~430 lignes).

> ⚠️ **Note pédagogique** : projet conçu pour comprendre les mécanismes cryptographiques fondamentaux.  
> Pour une utilisation en production, des protocoles standardisés (TLS, Signal Protocol) sont à privilégier.

---

## ⚙️ Ce que fait le programme

Le binaire s'utilise en deux modes selon l'argument passé :

```bash
# Mode serveur — écoute sur un port
cargo run -- server 7878

# Mode client — se connecte à l'adresse donnée
cargo run -- client 127.0.0.1:7878
```

Une fois les deux lancés, l'échange de clés se fait automatiquement, puis les deux parties peuvent s'envoyer des messages chiffrés en temps réel.

---

## 🔑 Protocole — étape par étape

### 1. Paramètres publics (hardcodés)

```rust
const P: u64 = 0xD87FA3E291B4C7F3; // 64-bit safe prime
const G: u64 = 2;                   // générateur
```

### 2. Génération des clés (les deux côtés font la même chose)

```
clé privée  = entier aléatoire 64-bit (généré via xorshift sur timestamp nanos)
clé publique = G^privée mod P
```

### 3. Échange via TCP

```
Serveur  ──── pub_key_serveur (hex, 16 chars) ────►  Client
Serveur  ◄─── pub_key_client  (hex, 16 chars) ────   Client
```

### 4. Calcul du secret partagé (chaque côté indépendamment)

```
secret = (pub_key_autre)^(clé_privée) mod P
```

Les deux obtiennent le même `secret` sans l'avoir transmis.  
Un attaquant interceptant les clés publiques ne peut pas le retrouver (problème du logarithme discret).

### 5. Génération du keystream

À partir du secret, un LCG (Linear Congruential Generator) produit un flux d'octets pseudo-aléatoires :

```
paramètres : a = 110351245, c = 12345, m = 2^32
seed       : le secret partagé
```

### 6. Chiffrement des messages

```
message chiffré = message XOR keystream[position..position+len]
```

La position dans le keystream avance à chaque message pour éviter la réutilisation de la même clé.

---

## 🏗️ Structure du code (`src/main.rs`)

| Fonction | Rôle |
|----------|------|
| `main()` | Parse les arguments, lance `start_server` ou `start_client` |
| `start_server(port)` | Bind TCP, accepte une connexion, appelle `handle_client` |
| `handle_client(stream)` | Côté serveur : échange DH, boucle de chat |
| `start_client(address)` | Côté client : connexion TCP, échange DH, boucle de chat |
| `mod_pow(base, exp, mod)` | Exponentiation modulaire rapide (via u128 pour éviter overflow) |
| `generate_random_key()` | Clé privée aléatoire via xorshift sur `SystemTime::now()` |
| `generate_keystream(seed, len)` | LCG producant un flux d'octets |
| `xor_encrypt(data, keystream, pos)` | XOR data avec keystream à partir de `pos`, retourne `(résultat, nouvelle_pos)` |
| `hex_encode(data)` | `Vec<u8>` → String hexadécimale |
| `hex_decode(hex)` | String hexadécimale → `Vec<u8>` |
| `print_hex_details(...)` | Affichage debug des octets |
| `print_help()` | Usage CLI |

---

## 🖥️ Exemple de session

```
[SERVER] Listening on 0.0.0.0:7878
[CLIENT] Connected from 127.0.0.1:54321

[DH] p = 0xD87FA3E291B4C7F3  g = 2
[DH] private_key = 2A7F...  public_key = 0x...
-> Send our public: 0xABCD1234...
<- Receive their public: 0xEF567890...
[DH] secret = 0x1A2B3C4D...
[TEST] Round-trip: "Hello" → encrypt → decrypt → "Hello" ✓
✓ Secure channel established!

> Hello !
[ENCRYPT] Plain: 48 65 6C 6C 6F
[->] Sent 5 bytes

[CLIENT]: Hello !
```

---

## 🔒 Points techniques notables

**`mod_pow` avec u128**  
L'exponentiation modulaire sur des entiers 64-bit peut dépasser `u64::MAX` lors de la multiplication intermédiaire (`base * base`). Le code utilise `u128` en interne pour éviter l'overflow silencieux, puis repasse en `u64`.

**Clé privée sans dépendance externe**  
La génération aléatoire est faite avec un xorshift sur le timestamp nanoseconde, sans crate externe. Suffisant pour un projet pédagogique, mais pas cryptographiquement sûr en production (pas d'entropie certifiée).

**Keystream LCG à position continue**  
La variable `keystream_position` est maintenue entre les messages : chaque nouveau message XOR avec la suite du keystream, pas depuis le début. Cela évite de chiffrer deux messages différents avec les mêmes octets de clé.

**Limitations identifiées**
- Vulnérable au Man-in-the-Middle (pas d'authentification des parties)
- LCG non cryptographiquement sûr (à remplacer par ChaCha20 ou AES-CTR)
- Clé privée non sécurisée (à remplacer par `OsRng`)
- Keystream de longueur fixe (256 octets) — ne passe pas à l'échelle

---

## 🔗 Liens

- 💻 [Code source](https://github.com/Kostleky/rust_bootcamp/tree/main/rust_03)  
- 📁 [Retour au portfolio](../../README.md)
