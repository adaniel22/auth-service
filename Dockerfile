# 1. Alapréteg: Node 24, karcsú Alpine Linuxon
FROM node:24-alpine

# 2. A munkakönyvtár a konténeren belül (ide dolgozunk)
WORKDIR /app

# 3. Előbb CSAK a package fájlokat másoljuk be
COPY package*.json ./

# 4. Függőségek telepítése
RUN npm install

# 5. A többi forrásfájl bemásolása
COPY . .

# 6. TypeScript lefordítása (a dist mappa jön létre)
RUN npm run build

# 7. A port, amin az app figyel (dokumentáció jelleggel)
EXPOSE 3000

# 8. Az indító parancs: a lefordított appot futtatja
CMD ["node", "dist/src/main.js"]