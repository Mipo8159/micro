1. localhost:15672 -> RabbitMQ Management UI
2. urls: [`amqp://${RMQ_USER}:${RMQ_PASS}@${RMQ_HOST}:${RMQ_PORT}`]
3. migration: [ "npm run typeorm migration:generate apps/auth/src/db/migrations initdb" ]
4. RegisterRmq -> for registering microservice (Module)
5. getRmqOptions -> for connecting microservice (Main.ts)
6. authGuard -> (Lib) / jwtGuard -> (Auth)
7. friend request -> [ creator / receiver ]
