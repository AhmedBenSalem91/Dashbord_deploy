# Utilisation de l'image officielle Node.js
FROM node:lts-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /backend

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les autres fichiers du projet dans le conteneur
COPY . .

# Exposer le port utilisé par votre serveur Node.js
EXPOSE 5001

# Lancer l'application
CMD ["node", "index.js"]
