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

**Our new idea:** A better version of google classroom that has a better student and teacher experience as well as lecture, test, and group work sessions

**General Features and Improvements for Students:**
 * Lecture mode: area where students can see and navigate lecture materials, take notes, and be monitored by teachers for involvement (questions and analysis features, surveys, checks for understanding, worksheets)
 * Test mode: area where students can securely take tests and be monitored whenever the tab is changed for security (not like locked mode for google forms and integrated within the classroom website instead of separate)
 * Group mode: easily able to organize work between groups by creating the groups online, setting up chats between students (can be monitored unlike others), participation monitoring
 * Planning mode: calendars and to-do-list organization for each project individually
 * Teacher contact: easily able to contact teachers through the app (given notifications for the teacher to respond quickly in a text format instead of emails, which are usually ignored after a certain amount of time)
 * Chatbot for homework and concept help: thinking maybe an OpenAI API call or ChatGPT selenium worker to ask for information through chatgpt without giving the answer directly (maybe can only ask for general information as a prompt amendment)
 * Hub: communication with other people in class and sharing of study materials through the website
 * Rewards: measure of engagement and grades for analysis (teacher could implement a prize system)

**Improvements for Teachers:**
 * Lecture and content creation: access to previous content materials uploaded by other teachers, and organization of these materials to work in in-person and online cases
 * Analysis: can monitor students and provide extra-help automatically when needed
 * Lecture mode monitoring: can see students and how well they are performing

_This is temporary!!!_ these ideas are currently scattered kinda all over the place, but we'd need some selling point that would bring all the ideas together, probably something like making hybrid learning smoother and easier integration of technology
_Note:_ Our original plan was to include AI in this, and we don't have many ideas for that right now, which would be nice to implement

**Feature Implementations: (btw microservices is still our best bet here prob)**
 * Classrooms database: stores different classrooms including teachers, students, assignments (in respective categories)
 * Lecture mode: websocket server with the `socket.io` rooms feature is probably our best bet, sends regular information to events based on the action that might have occurred and notify the teacher accordingly
 * Chatbot: need to integrate OpenAI API (we might run out of API Calls), instead we can try ChatGPT with a selenium worker
 * Hub: can use websocket messaging, if we want to integrate voice calls on the website we can do it through webRTC
 * Teacher contact: more websocket messaging along with notifications on phone
 * Group mode/Planning mode/Rewards: specific to students in each classroom
 * Analysis: need to implement with a graphing and data analysis API probably
 * Content creation: separate database that can be filtered by topic and subject


**FRONTEND COMPONENT TODOS:**
 * Landing:
   * Navbar
   * Main Image
   * About/description
 * Auth:
   * Form for signup and login (form fields, submit button, text headers [placeholder])
   * Buttons: submit, sign in/up with Google
 * Dashboard:
   * Cards for classrooms with specific setup (can use box or card, setup a grid)
 * Class view:
   * Navigation bar at top for assignments, lectures, tests
   * For each: stack for display of assignments
 * Assignment view:
   * Title, description using typography
   * Card for uploading and comments if time