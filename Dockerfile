# 1. Alapréteg: Node 24, karcsú Alpine Linuxon
FROM node:24-alpine
# 2. A munkakönyvtár a konténeren belül (ide dolgozunk)
WORKDIR /app
# 3. Előbb CSAK a package fájlokat másoljuk be
COPY package*.json ./
# 4. Függőségek telepítése
RUN npm install
# 5. A többi forrásfájl bemásolása (ez már behozza a docker-entrypoint.sh-t is)
COPY . .
# 6. TypeScript lefordítása (a dist mappa jön létre)
RUN npm run build
# 7. Az entrypoint script futtathatóvá tétele
RUN chmod +x docker-entrypoint.sh
# 8. A port, amin az app figyel
EXPOSE 3000
# 9. Induláskor: előbb migráció, aztán az app (a scriptben)
CMD ["./docker-entrypoint.sh"]