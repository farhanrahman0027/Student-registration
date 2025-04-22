# 🎓 Student Registration System

A simple and responsive Student Registration System built using **React**. This application allows users to manage Course Types, Courses, Course Offerings, and Student Registrations efficiently with full CRUD functionality.

## ✨ Features

### 🔹 Course Types
- Create new course types (e.g., Individual, Group, Special)
- View existing course types
- Update course type names
- Delete course types

### 🔹 Courses
- Create new courses (e.g., Hindi, English, Urdu)
- List all courses
- Update course names
- Delete courses

### 🔹 Course Offerings
- Create course offerings by associating a course with a course type (e.g., "Group - Hindi")
- List all course offerings
- Update course offering associations
- Delete course offerings

### 🔹 Student Registrations
- Register students for available course offerings
- View registered students for specific course offerings
- Filter offerings based on selected course type

## 🖼️ UI Highlights

- Clean and intuitive user interface
- Fully responsive design for all devices
- Form validation and user feedback
- Dynamic filtering of course offerings

## 🛠️ Tech Stack

- **Frontend**: React, React Router DOM
- **UI Framework**: Tailwind CSS / ShadCN (optional)
- **State Management**: useState, useContext
- **Validation**: React Hook Form + Zod/Yup
- **Version Control**: Git + GitHub
- **Deployment**: Vercel / Netlify

## 📦 Project Setup

```bash
# Clone the repository
git clone https://github.com/farhanrahman0027/Student-registration.git
cd student-registration-system

# Install dependencies
npm install

# Start the development server
npm run dev
