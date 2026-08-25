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

# Copia os arquivos compilados da ETAPA 1 para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# --- CORREÇÃO DO REACT ROUTER (SPA FALLBACK) ---
# Copia o arquivo personalizado do Nginx para dentro do contêiner
COPY controle-pedidos.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (porta padrão do Nginx internamente)
EXPOSE 80

# Inicia o Nginx e o mantém rodando em primeiro plano
CMD ["nginx", "-g", "daemon off;"]