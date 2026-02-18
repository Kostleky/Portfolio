# 🔍 Détection de Phishing par Machine Learning

Projet académique · Septembre – Décembre 2025  
Avec Aboubakar BAAOUCHI et Paul ARTISI

> 🔗 [Repository original](https://github.com/Popole94/Projet_Machine_Learning) · [Mes contributions](https://github.com/Popole94/Projet_Machine_Learning/commits?author=Kostleky)  
> 📹 [Vidéo de présentation](https://youtu.be/olae06ZnYwM)

---

## 🎯 Objectif

Classer automatiquement des sites web comme légitimes ou de phishing, à partir de 30 indicateurs techniques extraits de l'URL, du domaine et du contenu HTML/JS.  
Dataset : [UCI Phishing Websites](https://archive.ics.uci.edu/dataset/327/phishing+websites) (~11 000 sites, classification binaire).

---

## 📊 Résultats

| Métrique | Score |
|----------|-------|
| Accuracy | **97.7%** |
| F1-score | **~98%** |
| Precision | ~98% |
| Recall | ~98% |

Le F1-score est la métrique principale : en contexte de sécurité, un faux négatif (phishing non détecté) est plus coûteux qu'un faux positif (site légitime bloqué). L'équilibre précision/rappel est donc plus pertinent que la seule accuracy.

---

## 🔬 Features analysées (30 au total)

**URL** : longueur, présence de `@`, IP à la place du domaine, sous-domaines, raccourcisseurs, redirections `//`...  
**Domaine** : âge, durée d'enregistrement, présence en blacklist, WHOIS caché, certificat SSL...  
**HTML / JS** : iframes cachés, pop-ups, formulaires suspects, scripts obfusqués, liens cross-domain...

---

## 🔬 Pipeline

```
Dataset UCI (~11 000 sites)
        │
        ▼
EDA — distribution, corrélations, outliers
        │
        ▼
Preprocessing — nettoyage, normalisation, split stratifié 80/20
        │
        ▼
Feature selection — importance des variables
        │
        ▼
Entraînement — Decision Tree / Random Forest / Gradient Boosting / SVM / Logistic Regression
        │
        ▼
Validation croisée k-fold + Grid Search hyperparamètres
        │
        ▼
Évaluation — Accuracy · Precision · Recall · F1 · ROC-AUC · matrice de confusion
```

---

## 🛠️ Stack

```
Python 3.x
├── pandas       — manipulation des données
├── numpy        — calcul numérique
├── scikit-learn — modèles ML, validation, métriques
├── matplotlib   — visualisations
└── seaborn      — statistiques visuelles
```

---

## 📈 Cas d'usage concrets

- **Extension navigateur** : alerte temps réel avant accès à un site suspect
- **Proxy / Firewall** : filtrage automatique au niveau réseau
- **Email Gateway** : analyse des liens dans les mails entrants
- **Threat Intel** : génération d'IoC (Indicators of Compromise)

---

## 👥 Équipe & contributions

[Historique Git](https://github.com/Popole94/Projet_Machine_Learning/graphs/contributors)

> Copie archivée pour le portfolio. Projet actif sur le [repository original](https://github.com/Popole94/Projet_Machine_Learning).

---

[Retour au portfolio](../../README.md)
