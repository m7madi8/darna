FROM php:8.3-cli-bookworm

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libssl-dev \
    && docker-php-ext-install pdo_pgsql pcntl sockets \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/api

COPY apps/api/composer.json apps/api/composer.lock* ./

RUN composer install --no-scripts --no-autoloader --prefer-dist || true

COPY apps/api .

RUN composer dump-autoload --optimize || true

EXPOSE 8000 8080

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
