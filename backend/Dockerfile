FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install \
        zip \
        pdo \
        pdo_mysql \
        mbstring \
        xml

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiamos TODO el proyecto primero (incluye artisan)
COPY . .

# Instalamos dependencias
RUN composer install --no-interaction --prefer-dist
