## TSA Software Development 2022-2023

**our idea:** make an ai nurse app that has different features to make doctor appointments more efficient and quick

**Features:**
 * Video and image detection for common eye diseases
 * Survey for different symptoms
 * Prescription and preliminary diagnosis generator
 * Chatbot for urgent care
 * schedule a video call with notifications with a nurse

**Required Technologies:**
 * Frontend: SvelteKit or React
 * Chat API - we can find one or make our own using real-time websocket server
 * Database - Postgres to store records of surveys and other information
 * AI Processing - can be done with lambda functions
 * video call - webRTC
 * Storing user sessions and caching: Redis
 * Backend - Flask/FastAPI for the AI processing, same or another for other features
 * Authentication - OAuth and normal auth through database

**Organization:**
The best way to organize the server would be in a microservices so we can develop and create each part separately for each of us
Microservice divisions:
 * Chat API websocket-based api
 * database access api - separate service for users, doctors, and previous appointments
 * AI processing API - can be done with AWS lambda to allocate resources and each in separate functions
 * video call API - separate API using webRTC
 * caching API - redis
 * authentication API - OAuth and normal authentication separate microservices
 * we can organize with Docker and Kubernetes

Frontend Organization
 * SvelteKit can handle organization for us


**Extras:**
 * Web3 storage for prescription documents