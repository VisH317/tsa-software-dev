## Lecture Mode

_Summary:_ a feature of the classroom website where teachers can initialize lectures for students to stay focused and interact with virtual and in-person students

**Features for students:**
 * See questions and materials (currently only text) provided by the teacher
 * Take notes and save them for later studying
 * Answer surveys from teachers
 * Distraction management and analysis
 * Locked mode
 * Students asking questions (later can implement private answering)

**Features for teachers:**
 * See students' performance: question answering, view their notes
 * Change material and update for all students
 * Create surveys/questions for students to answer and measure responses

**API Features:** 
 * Create and delete lecture sessions (including database persistence after completion)
 * Teachers:
   * Create questions 
     * Update teacher dashboard with results
   * View student engagement (possibly facial engagement recognition: https://github.com/omidmnezami/Engagement-Recognition)
   * Post and change materials for the lecture for student to navigate through independently
 * Students:
   * ask questions posed to teacher (or chatbot to answer [in separate microservice])
   * take notes for saving later