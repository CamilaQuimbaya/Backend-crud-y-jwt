#1. Imagen base
FROM node:18-alpine

#2. Carpeta de trabajo
WORKDIR /app

#3. Instalar dependencias
COPY package*.json ./
RUN npm install --omit=dev

#4. Copiar el resto del código
COPY . .

#5. Exponer puerto
EXPOSE 3000

#6. Comando de arranque
CMD ["node", "index.js"]
