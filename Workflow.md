# Как работать над проектом

## Окружение

Для удобства работы над проектом используются инструменты из **Node.js** и **npm**. Все необходимые настройки произведены. Убедитесь, что на рабочем компьютере установлен актуальный LTS релиз Node.js**. Актуальная версия **Node.js** указана в файле `package.json` в поле `node`. Затем, в терминале, перейдите в директорию с проектом и _единожды_ запустите команду:

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` и скомпилирует проект.

#### Удалить скомпилированный проект

```bash
npm run clean
```

Удаляет директорию `dist`. Используется перед компиляцией.

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Линтер проверяет файлы только внутри директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.


## Структура проекта

### Директория `src`

Исходный код проекта: компоненты, модули и так далее. Структура директории `src` может быть произвольной.

### Файл `Readme.md`

Инструкции по работе с учебным репозиторием.

### Файл `Contributing.md`

Советы и инструкции по внесению изменений в учебный репозиторий.

### Остальное

Все остальные файлы в проекте являются служебными. Пожалуйста, не удаляйте и не изменяйте их самовольно. Только если того требует задание или наставник.

### Запуск проекта

Шаг 1: Установка зависимостей
Перед запуском проекта убедитесь, что у вас установлен Node.js версии 18.0.0 или выше и npm версии 8 или выше.
Откройте терминал или командную строку.
Перейдите в корневую папку проекта.
Запустите команду для установки всех зависимостей проекта.
```bash
npm install 
```

Шаг 2: Конфигурация переменных окружения
Проект "Шесть городов" использует переменные окружения для конфигурации. Для запуска проекта вам потребуется сконфигурировать следующие переменные окружения:

JWT_SECRET: Секретный ключ для подписи и проверки JWT-токенов.
DATABASE_URL: URL-адрес базы данных MongoDB.
API_KEY: Ключ API для доступа к стороннему сервису.
Создайте файл с именем .env в корневой папке проекта и укажите значения переменных окружения в следующем формате:

JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
API_KEY=your_api_key

Шаг 3: Сборка проекта
Перед запуском проекта необходимо выполнить сборку, чтобы скомпилировать TypeScript код в JavaScript.

Выполните команду для сборки проекта.
```bash
npm run build
```

Шаг 4: Запуск сервера
После успешной сборки проекта можно запустить сервер.

Выполните команду для запуска сервера.
```bash
npm start
```

Шаг 5: Запуск мок-сервера (дополнительно)
Если вам необходимо использовать мок-сервер для имитации стороннего сервиса, вы можете запустить его отдельно.

Выполните команду для запуска мок-сервера.
```bash
npm run mock:server
```

### Список всех переменных окружения 

PORT - порт, на котором будет работать сервер
SALT - соль, используемая для шифрования
DB_HOST - хост базы данных
MONGO_INITDB_ROOT_USERNAME - имя пользователя базы данных
MONGO_INITDB_ROOT_PASSWORD - пароль пользователя базы данных
DB_PORT - порт базы данных
DB_NAME - название базы данных
UPLOAD_DIRECTORY - директория для загрузки файлов
JWT_SECRET - секретный ключ для подписи и верификации JWT-токенов
EXPIRATION_TIME - срок действия для токена аутентификации
STATIC_DIRECTORY_PATH - директория для хранения файлов