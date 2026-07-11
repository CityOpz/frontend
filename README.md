# 🏙️ CityOps Frontend

Frontend application for the CityOps urban reporting platform, built with React, TypeScript, and Vite. This application allows citizens to report urban infrastructure issues and administrators to manage them.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment)
- [Code Quality](#-code-quality)
- [Team](#-team)

## ✨ Features

### Citizen Features
- 📝 Create and submit urban issue reports
- 📍 Interactive map to locate issues
- 📊 Dashboard to track report status
- 📸 Upload photo evidence
- 👤 User authentication and profile management

### Administrator Features
- 📋 View and manage all citizen reports
- 🔄 Update report status (Pending → In Review → In Repair → Resolved)
- 👥 User management
- 📈 Analytics dashboard

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Package Manager** | pnpm |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui |
| **Routing** | React Router v7 |
| **State Management** | Zustand |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Maps** | Leaflet + React-Leaflet |
| **Testing** | Vitest + Testing Library |
| **Code Quality** | ESLint + Prettier |
| **CI/CD** | GitHub Actions |
| **Code Analysis** | SonarCloud |
| **Deployment** | Vercel |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0

Install pnpm globally if you don't have it:

```bash
npm install -g pnpm