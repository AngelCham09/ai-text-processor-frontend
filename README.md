# AI Writing Assistant - Frontend

A modern, high-performance web application built with Nuxt 4 and Vue 3. This client interfaces with the AI Writer API to provide a seamless user experience for content creation.

## Key Features

* **AI Writing Workspace**: Dual-pane interface for inputting text and receiving real-time AI results.
* **Interactive Tools**: Quick-action buttons for Improving, Summarizing, Professionalizing, and Formatting text.
* **User Management**:
    * Full Auth Flow (Login, Register, Forgot Password).
    * Profile Management with identity updates and Security settings.
    * Real-time Email Verification status and resend triggers.
* **History & Management**: Dedicated history dashboard allowing users to review, copy, or delete previous AI generations.
* **Nuxt Server Proxy**: Secure API communication via Nuxt Nitro proxying to prevent CORS issues and hide backend structures.
* **UI/UX**: 
    * Fully Responsive Design using **Tailwind CSS**.
    * Modular Component Architecture (Reusable Modals, Custom Password Inputs, Loading States).

## Tech Stack

* **Framework**: Nuxt 4 (Vue 3)
* **Styling**: Tailwind CSS
* **Icons/UI**: Headless UI & PrimeVue
* **State Management**: Pinia / Ref API
* **HTTP Client**: Nuxt `useFetch` & `$fetch`

## Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone [YOUR_REPO_LINK]
   cd [YOUR_REPO_FOLDER]
   
2. **Install dependencies:**
   ```bash
   npm install

3. **Run Development Server:**
   ```bash
   npm run dev
