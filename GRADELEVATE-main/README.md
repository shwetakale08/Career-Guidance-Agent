# AI Career Guidance Agent 🎓

### AI-Powered Career Guidance Platform for Students

AI Career Guidance Agent helps students navigate career selection, skill development and job readiness through personalized AI-powered recommendations, skill gap analysis and resume feedback.

---

## ✨ Features

### 🧠 Smart Onboarding
- **Two onboarding paths** — "I am confused" (AI finds your best career) and "I have something in mind" (guided skill gap view)
- **Weighted scoring algorithm** matches user interests, work style, goals and known skills against 40+ careers
- **Gemini AI explanations** — personalized 2-sentence reasoning for each career recommendation

### 🎯 Career Explorer
- Browse 40+ specific careers (Java Backend Developer, Flutter Developer, NLP Engineer etc.)
- Filter by market demand level — Very High, High, Medium
- Click any career to open a dedicated detail page with full skill roadmap

### 📊 Career Detail & Skill Gap Analysis
- **Readiness percentage** — calculated from skills marked as completed
- **AI-powered learning order** — Gemini sorts skills by prerequisite dependency (language → core concepts → frameworks → DevOps)
- **Post-processing enforcement** — guarantees correct order (Django always before Django REST Framework etc.)
- **Progress tracking** — mark skills as Learning, Done or Undo with instant readiness update

### 📚 Skill Explorer
- Browse 100+ skills across Programming, Data, AI/ML, DevOps, Design and more
- Dedicated skill pages with YouTube thumbnails, playlist cards and resource filtering
- Clickable from career skill gap — navigates directly to skill resources

### 🤖 Resume Analyzer
- Upload PDF resume — Apache PDFBox extracts text
- **Gemini AI analysis** — score, summary, strengths, improvements, missing sections, suggested skills
- **Job Description matching** — paste a JD for ATS score, matched keywords and missing keywords
- Visual score ring, bar charts and structured feedback cards

### 🛠 AI Tools Directory
- 20+ AI tools with descriptions, use cases, pricing and website links
- Filter by category (Writing, Coding, Design, Research) and pricing (Free, Freemium, Paid)
- Click any tool for a detailed side panel

### 🔐 Authentication & Security
- JWT-based stateless authentication
- Role-based access control (USER / ADMIN)
- Forgot password flow with time-limited email reset tokens
- BCrypt password hashing

### 👨‍💼 Admin Panel
- Full CRUD for Careers, Skills, Resources and AI Tools
- Link skills to careers with a visual skill picker
- Dashboard with live stats — total users, careers, skills, resumes

---

## 🏗 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17+ | Primary language |
| Spring Boot 4 | REST API framework |
| Spring Security | Authentication & authorization |
| JWT (jjwt 0.11.5) | Stateless token auth |
| Spring Data JPA | Database ORM layer |
| Hibernate | Object-relational mapping |
| PostgreSQL | Primary database |
| Apache PDFBox | PDF text extraction |
| Spring Mail | Email service (Gmail SMTP) |
| Gemini 2.5 Flash | AI analysis & recommendations |
| Maven | Build and dependency management |
| Lombok | Boilerplate reduction |

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI framework |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| React Hot Toast | Notification system |
| Lucide React | Icon library |

---

## 📁 Project Structure

```
AI Career Guidance Agent/
├── AI Career Guidance Agent-backend/
│   └── src/main/java/com/AI Career Guidance Agent/
│       ├── config/          # Security, CORS, AppConfig
│       ├── controller/      # REST controllers
│       ├── service/         # Business logic
│       ├── repository/      # JPA repositories
│       ├── entity/          # 10 JPA entities
│       ├── dto/             # Request/Response DTOs
│       ├── exception/       # Global exception handler
│       └── security/        # JWT filter, UserDetails
│
└── AI Career Guidance Agent-frontend/
    └── src/
        ├── api/             # Axios API calls (8 modules)
        ├── components/      # Reusable components
        ├── context/         # AuthContext
        ├── pages/           # 12 page components
        └── utils/           # Helpers, constants
```

---

## 🗄 Database Schema

```
users               → user_profiles
users               → resumes → resume_analyses
users               → user_career_interests
users               → user_saved_resources
users               → user_skill_progress
careers             → career_skills (many-to-many) → skills
skills              → resources
ai_tools
password_reset_tokens
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/AI Career Guidance Agent.git
cd AI Career Guidance Agent/AI Career Guidance Agent-backend
```

**2. Create PostgreSQL database**
```sql
CREATE DATABASE AI Career Guidance Agent_db;
```

**3. Configure application properties**
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```
Fill in your values:
- PostgreSQL credentials
- JWT secret (min 32 characters)
- Gemini API key from [aistudio.google.com](https://aistudio.google.com)
- Gmail App Password from [myaccount.google.com](https://myaccount.google.com)

**4. Run the backend**
```bash
mvn spring-boot:run
```
Backend starts at `http://localhost:8080`

---

### Frontend Setup

**1. Navigate to frontend**
```bash
cd ../AI Career Guidance Agent-frontend
```

**2. Install dependencies**
```bash
npm install --legacy-peer-deps
```

**3. Run the frontend**
```bash
npm run dev
```
Frontend starts at `http://localhost:5173`

---

## 🔑 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/validate-token
```

### User & Recommendations
```
POST /api/user/profile
GET  /api/user/profile
GET  /api/user/recommendations
GET  /api/user/skill-gap/{careerId}
GET  /api/user/smart-recommendations
```

### Careers & Skills
```
GET  /api/careers
GET  /api/careers/{id}
GET  /api/careers/search?keyword=
GET  /api/skills
GET  /api/skills/category/{category}
GET  /api/resources/skill/{skillId}
```

### Resume
```
POST /api/resume/upload
GET  /api/resume/my-resumes
GET  /api/resume/{resumeId}/analysis
```

### Progress
```
POST   /api/progress/mark
DELETE /api/progress/unmark
GET    /api/progress/career/{careerId}
GET    /api/progress/all
```

### Admin (requires ADMIN role)
```
GET    /api/admin/stats
POST   /api/admin/careers
PUT    /api/admin/careers/{id}
DELETE /api/admin/careers/{id}
POST   /api/admin/careers/{careerId}/skills/{skillId}
POST   /api/admin/skills
PUT    /api/admin/skills/{id}
POST   /api/admin/resources
POST   /api/admin/ai-tools
PUT    /api/admin/ai-tools/{id}
```

---

## 🤖 AI Integration

AI Career Guidance Agent uses **Gemini 2.5 Flash** via REST API for three features:

| Feature | What AI does |
|---|---|
| Career Recommendations | Generates 2-sentence personalized explanation for each match |
| Resume Analysis | Returns structured JSON with score, strengths, improvements, ATS keywords |
| Learning Order | Sorts skills by prerequisite dependency for each specific career |

The learning order uses a **hybrid approach**:
1. Gemini generates initial order
2. Post-processing `enforcePrerequisites()` fixes any violations
3. Manual tier-based fallback if AI fails

---

## 🛡 Security

- Passwords hashed with **BCrypt**
- JWT tokens expire after 24 hours
- Password reset tokens expire after **30 minutes**
- Admin endpoints protected with `hasRole('ADMIN')`
- CORS configured for frontend origin only
- `application.properties` excluded from version control

---

## 📊 Database Seed Data

The project includes SQL scripts to populate:
- **40+ specific careers** with demand levels, salary ranges and tag mappings
- **100+ skills** across 15+ categories
- **20+ AI tools** with descriptions, use cases and pricing
- Career-skill relationships mapping each career to its required skills

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ to help students navigate their career journey</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div><img width="930" height="880" alt="image" src="https://github.com/user-attachments/assets/f7951697-e5d9-475d-81d9-6142ce0b290e" />
<img width="904" height="617" alt="image" src="https://github.com/user-attachments/assets/6c6e4fde-30a7-446c-b7b9-c958ec1815e6" />
<img width="789" height="714" alt="image" src="https://github.com/user-attachments/assets/d5d3eeb2-678a-4111-862b-5adfb41ec3e9" />
<img width="931" height="994" alt="image" src="https://github.com/user-attachments/assets/1824a640-cf9a-489a-95d4-2e7115945c54" /><img width="686" height="824" alt="image" src="https://github.com/user-attachments/assets/a6613ba0-f199-43de-a688-91cee70164ed" />
<img width="858" height="628" alt="image" src="https://github.com/user-attachments/assets/3a2189a7-737e-4263-abf1-9284a0e5a913" />
<img width="866" height="774" alt="image" src="https://github.com/user-attachments/assets/976aabc8-d77a-48b0-9805-d1346b00e4a1" />
<img width="872" height="609" alt="image" src="https://github.com/user-attachments/assets/04045872-bd22-4b18-a0bc-a39e5ce99cc2" />
<img width="863" height="848" alt="image" src="https://github.com/user-attachments/assets/bdc9d46b-a47b-448d-9f0a-e5450778221e" />
<img width="863" height="848" alt="image" src="https://github.com/user-attachments/assets/ce68b875-1ac9-455d-bc1f-0bc1fedb8b34" />
<img width="738" height="1063" alt="image" src="https://github.com/user-attachments/assets/42c2dba5-6546-46bb-be47-668c1af05a26" />
<img width="1919" height="938" alt="image" src="https://github.com/user-attachments/assets/0649aec7-bf87-41b6-88ef-753647beb5ec" />
<img width="1893" height="1074" alt="image" src="https://github.com/user-attachments/assets/7d344d27-066f-4451-92ab-836390615fca" />
<img width="1890" height="1033" alt="image" src="https://github.com/user-attachments/assets/bf7525b5-bdf1-417c-8c5b-7969b4a2574b" />
<img width="1895" height="1073" alt="image" src="https://github.com/user-attachments/assets/be3c7657-e9cd-44cf-a915-1bdda94b64ed" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/497806b2-9dfc-4350-8ced-57eb5d463660" />
<img width="1008" height="1079" alt="image" src="https://github.com/user-attachments/assets/5422a71a-0a46-4eea-8995-f0af76fd828d" />
<img width="953" height="516" alt="image" src="https://github.com/user-attachments/assets/12aed2ea-5927-4a45-9bff-a79bc768a20d" />
<img width="942" height="593" alt="image" src="https://github.com/user-attachments/assets/d177c1cc-12f0-463a-b725-4b681b273266" />
<img width="928" height="611" alt="image" src="https://github.com/user-attachments/assets/6b57faf0-f7d9-403c-83e1-234da95d0ca0" />
<img width="994" height="900" alt="image" src="https://github.com/user-attachments/assets/5b516b87-f2d9-49d1-80ad-9afcc62b83e0" />
<img width="980" height="854" alt="image" src="https://github.com/user-attachments/assets/03a85db3-4a9c-4c81-8780-3d6959a2e0b1" />

