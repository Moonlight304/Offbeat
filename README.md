# Offbeat
A social media app powerd by MongoDB, Express, ReactJS, NodeJS.

## Running locally with Docker

1. Install Docker
2. ``` git clone https://github.com/Moonlight304/Offbeat.git ```
3. ``` cd Offbeat ```
4. Create environment variables

### .env in /server:
    ```
    PORT=3000
    frontendURL=http://localhost:5173
    dbURL=mongodb://127.0.0.1:27017/offbeat
    JWT_SECRET_CODE=TEST_SECRET_CODE
    ```

### .env in /client:
    ```
    VITE_backendURL=http://localhost:3000
    ```

5. Run ``` docker-compose up ```

Website starts at ```http://localhost:5173```