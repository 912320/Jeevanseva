# JeevanSeva (जीवनसेवा) — Healthcare Discovery Platform

> **"Healthcare Near You, When You Need It."**

JeevanSeva is a full-stack healthcare assistance platform designed for both rural and urban areas to discover nearby hospitals, verified doctors, medical services, pharmacies, and educational disease/medicine information.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Vite, React Router 6, React Icons, React Hot Toast, React Hook Form
- **Backend**: Node.js, Express.js, Sequelize ORM, JWT Authentication, bcryptjs
- **Database**: MariaDB / MySQL (Port 3306)

---

## 🚀 How to Run in VS Code Terminal

### 1. Open Terminal in VS Code (`Ctrl + ` `)

Make sure you are in the project folder:
```powershell
cd "d:\myProject\New folder"
```

### 2. Start Both Backend & Frontend with One Command

```powershell
npm run dev
```

This starts:
- 🔵 **Backend API** at `http://localhost:5000` (connected to MariaDB/MySQL)
- 🟢 **Frontend UI** at `http://localhost:5173`

Then open your browser to: **http://localhost:5173**

---

### Alternative: Run in Two Separate Terminals

If you prefer two separate terminals in VS Code:

**Terminal 1 (Backend):**
```powershell
cd "d:\myProject\New folder\server"
node server.js
```

**Terminal 2 (Frontend):**
```powershell
cd "d:\myProject\New folder\client"
npm run dev
```

---

## 🩺 Features Implemented

1. **User Authentication & Profiles**:
   - Register as Patient, Doctor, or Hospital
   - Data stored securely with bcrypt password hashing in MariaDB
   - JWT authentication & profile management

2. **Hospital Finder (`/hospitals`)**:
   - Search by name, city, or area
   - "Use My Location" GPS proximity sorting (Haversine formula)
   - Filter by: Government, Private, PHC (Primary Health Centre), CHC (Community Health Centre)
   - 24/7 Emergency casualty unit filter
   - Quick "Call Hospital", "Directions", and "View Doctors" buttons

3. **Doctor Finder (`/doctors`)**:
   - Search by name, specialty, or condition
   - Filter by: General Medicine, Cardiology, Pediatrics, Gynecology, Orthopedics, Dermatology, etc.
   - Consultation fee and experience filters
   - Verified doctor badges and hospital affiliations
   - Instant "Book Appointment" button

4. **Appointment Booking (`/book-appointment/:doctorId`)**:
   - 7-day date selector
   - Slot picker (Morning, Afternoon, Evening)
   - Reason for consultation & medical notes
   - Double-booking conflict prevention
   - View and manage booked appointments in Dashboard

5. **Health & Symptom Guide (`/diseases`)**:
   - Search conditions and symptoms (Fever, Dengue, Diabetes, Hypertension, Asthma)
   - Educational safety disclaimer (non-diagnostic)
   - Guidance on when to consult a specialist vs. visit emergency

6. **Medicine Information (`/medicines`)**:
   - Search brand and generic formulations
   - Over-the-counter (OTC) vs. Prescription required (Rx) badges
   - Essential precautions, drug classes, and side effects
   - Safety disclaimers against self-medication

7. **Nearby Pharmacy Finder (`/pharmacies`)**:
   - Search local medical stores and Jan Aushadhi Kendras
   - Filters for 24/7 open stores and Home Delivery

8. **Emergency Hub (`/emergency`)**:
   - 1-tap call buttons for 112 (National Emergency), 108 (Free Ambulance), 102 (Pregnancy Transport), 1075 (Health Helpline)
   - Directory of 24/7 trauma-equipped hospitals

9. **Patient Dashboard (`/dashboard`)**:
   - View active user details
   - Manage upcoming appointment bookings with cancel option
   - Quick navigation shortcuts

---

## 🗄️ Database Seeds Included

The database already includes pre-populated data:
- 8 Hospitals (AIIMS, Safdarjung, Apollo, Lilavati, KEM, rural PHCs & CHCs)
- 7 Verified Doctors across multiple specialties
- Common diseases with symptoms and precautions
- Essential generic medicines
- 24/7 pharmacies and medical stores
- National emergency hotlines

## Google Places live hospital data

The hospital finder always reads saved records from MySQL. To refresh nearby real-world hospitals, enable **Places API (New)** and billing in a Google Cloud project, then set `GOOGLE_MAPS_API_KEY` in the root `.env`. Run `npm run db:migrate` once after pulling this change. On the Hospitals page, select **Use My Location** and then **Refresh from Google**; results are saved to MySQL and displayed from the normal hospitals endpoint.

The key is used only by the server. Do not expose it as a `VITE_` variable. Google Places results are refreshed rather than treated as permanent verification; a listing from Google is not marked as JeevanSeva-verified.
