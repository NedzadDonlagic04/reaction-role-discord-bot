# Reaction Role Discord Bot

![Discord.js](https://img.shields.io/badge/Discord.js-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853d?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

---

## Description

A Discord.js bot that allows users to register messages where reacting with specific emotes adds or removes roles automatically.  
Built using Node.js, Prisma ORM, TypeScript, Docker, and PostgreSQL.

---

## Features

- Register messages with emoji role pairs  
- Add/remove roles based on user reactions/unreactions based on previous registration step 

---

## Getting Started

- [Node.js](https://nodejs.org/) v20 or later  
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)  
- [PostgreSQL](https://www.postgresql.org/) (optional if using Docker)

### Setup Instructions Without Docker

1. **Clone the repo**

   ```bash
   git clone https://github.com/NedzadDonlagic04/reaction-role-discord-bot.git
   cd reaction-role-discord-bot

1. **Install missing dependencies**

   ```bash
   npm install


1. **Create .env file**

    ```bash
    touch .env
    ```

    Now paste the contents of the template below into it

   ```
   NODE_ENV=development
   CI=false
   DISCORD_BOT_TOKEN=
   CLIENT_ID=
   GUILD_ID=
   DB_USER=
   DB_PASS=
   DB_HOST=
   DB_PORT=
   DB_NAME=
   DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
   ```

1. **Discord bot configuration**
    - Go to [discord's developer portal](https://discord.com/developers/applications)
    - Give your bot a name and click create
    - Go to the "Bot" tab, click "Reset Token" and assign the token to the DISCORD_BOT_TOKEN environment variable inside the .env file
    - While in the "Bot" tab enable the options "Server Members Intent" and "Message Content Intent"
    - Go to the "General information" tab, copy the application id and assign it to the CLIENT_ID environment variable inside the .env file
    - Find the server you want the bot to join, right click and select the option "Copy Server ID"and assign it to the GUILD_ID environment variable inside the .env file
    - DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME assign whatever values you configure inside postgres
