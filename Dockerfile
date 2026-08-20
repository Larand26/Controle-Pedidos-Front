# --- ETAPA 1: Build (Compilação) ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências e instala
COPY package.json package-lock.json* ./
RUN npm install

# Copia o resto do código e compila a aplicação
COPY . .
RUN npm run build


# --- ETAPA 2: Servidor Web (Produção) ---
FROM nginx:alpine

# Remove os arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos compilados da ETAPA 1 (builder) para a pasta pública do Nginx
# NOTA: O Vite, por padrão, gera os arquivos compilados na pasta "dist". 
# Se o seu projeto gera em "build", mude "dist" para "build" na linha abaixo.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80 (porta padrão do Nginx)
EXPOSE 80

# Inicia o Nginx e o mantém rodando em primeiro plano
CMD ["nginx", "-g", "daemon off;"]