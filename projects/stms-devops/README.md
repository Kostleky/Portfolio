# 🛡️ STMS — DevSecOps & Développement Sécurisé

Projet académique d'équipe  
Avec Eliott Alfandari, Refaël Aharouni et Alfred Cruz

> 🔗 [Repository original](https://github.com/STMS-Git/Full_DevOps_Lab) · [Mes contributions](https://github.com/STMS-Git/Full_DevOps_Lab/commits?author=Kostleky)  
> 🌐 [Application déployée](https://stms-application.onrender.com)

---

## 📖 Contexte

**STMS (Sports Team Management System)** est une application MERN de gestion d'équipes sportives.  
L'enjeu principal du projet était d'appliquer une démarche **DevSecOps** : sécurité intégrée dès le développement, tests automatisés et déploiement continu bloqué si un test échoue.

---

## 🔒 Sécurité applicative

### Authentification & Autorisation

**JWT** — tokens signés, expiration automatique, middleware de vérification sur chaque route protégée.  
**bcrypt** — mots de passe hashés avec salt unique, coût ajustable pour résister au brute-force.  
**RBAC** — deux rôles (`Coach` / `Player`), permissions vérifiées côté serveur sur chaque endpoint.

### Contre-mesures OWASP

| Menace (OWASP Top 10) | Contre-mesure |
|-----------------------|---------------|
| A01 Broken Access Control | RBAC + middleware auth |
| A02 Cryptographic Failures | bcrypt + JWT signé |
| A03 Injection | Validation des inputs + Mongoose ODM (protection injection NoSQL) |
| A05 Security Misconfiguration | Headers CORS / CSP, variables d'env |
| A07 Auth Failures | Expiration des tokens, gestion des sessions |

### Exemples de tests de sécurité

```javascript
// Injection NoSQL
test('should reject NoSQL injection', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: { $gt: '' }, password: 'x' });
  expect(res.status).toBe(400); // ✅ Rejeté
});

// Autorisation RBAC
test('Player cannot create a coach', async () => {
  const res = await request(app)
    .post('/coaches')
    .set('Authorization', `Bearer ${playerToken}`)
    .send(coachData);
  expect(res.status).toBe(403); // ✅ Forbidden
});
```

---

## 🔄 Pipeline DevSecOps

```
git push
    │
    ▼
GitHub Actions
    ├── npm install
    ├── ESLint (détection vulnérabilités JS)
    ├── 144 tests (unitaires + intégration + sécurité)
    ├── Vérification coverage ≥ 90%
    └── Build
         │
         ▼  (si tout passe)
    Déploiement automatique sur Render (HTTPS)
```

**Métriques** : ✅ 144 tests · 📊 94% de couverture · 🚫 déploiement bloqué si échec

---

## 🏗️ Architecture

```
React (Vite)               Express (Node.js)            MongoDB Atlas
     │                            │                           │
     │  HTTPS  +  JWT Bearer      │       Mongoose ODM        │
     ├───────────────────────────►│◄─────────────────────────►│
     │                            │                           │
  Render Static            Render Web Service          Encrypted at rest
```

---

## 🛠️ Stack

**Frontend** : React 18 · Vite · React Router · Context API  
**Backend** : Node.js 18 · Express · Mongoose · JWT · bcrypt  
**Database** : MongoDB Atlas  
**Tests** : Vitest · Supertest · MongoDB Memory Server  
**DevOps** : GitHub Actions · ESLint · Render

---

## 👥 Équipe & contributions

[Historique Git](https://github.com/STMS-Git/Full_DevOps_Lab/graphs/contributors)

> Copie archivée pour le portfolio. Projet actif sur le [repository original](https://github.com/STMS-Git/Full_DevOps_Lab).

---

[Retour au portfolio](../../README.md)
