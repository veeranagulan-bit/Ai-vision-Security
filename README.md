# 👁️ GuardianVision AI

> **"See the Threat. Detect the Risk. Protect Everyone."**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-blue?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js)

**GuardianVision AI** is a highly modern, futuristic Security Surveillance & Weapon Detection Web Application. Built with a sleek cybersecurity-themed user interface, it leverages cutting-edge computer vision (YOLOv8) to analyze videos and images in real-time to detect potential threats before they escalate.

---

## ✨ Features

- 🤖 **Real AI Computer Vision**: Powered by the industry-standard `ultralytics` YOLOv8 neural network. Detects threats with high accuracy and draws bounding boxes dynamically.
- 🌌 **Immersive 3D User Interface**: Features stunning, full-screen interactive 3D scenes built with React Three Fiber (R3F). Includes holographic rotating CCTV cameras, floating particle systems, and a 3D animated Data Node during processing.
- 📹 **Video & Image Deep Scanning**: Upload either standard images (`.jpg`, `.png`) or video footage (`.mp4`, `.webm`). The system uses OpenCV to extract frames and runs inference to pinpoint threats.
- 🎛️ **Cybernetic Dashboard**: A dark-mode, neon-accented SOC (Security Operations Center) dashboard featuring a live 3D geospatial radar, AI confidence sliders, and system health monitors.
- 🔴 **Dynamic Threat Reporting**: Instantly generates a highly detailed, glowing red Threat Report card breaking down frames analyzed, timestamped detections, and confidence scores.

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 15](https://nextjs.org/) (App Router)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) / Drei (3D Rendering)
- [Tailwind CSS v4](https://tailwindcss.com/) (Styling)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) (Python API)
- [Ultralytics YOLOv8](https://docs.ultralytics.com/) (AI / Object Detection)
- [OpenCV](https://opencv.org/) (Video & Frame Processing)
- [Uvicorn](https://www.uvicorn.org/) (ASGI Server)

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/guardianvision-ai.git
cd guardianvision-ai
```

### 2. Start the Backend (FastAPI / YOLOv8)
Open a terminal and navigate to the `backend` directory.

```bash
cd backend

# (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn main:app --port 8000 --reload
```
*Note: The very first time you run a scan, the backend will automatically download the YOLO weights (~6MB). Subsequent scans will be instant.*

### 3. Start the Frontend (Next.js)
Open a second terminal and navigate to the `frontend` directory.

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 4. View the App
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 🔒 Customizing the Detection Model
By default, this repository uses the pre-trained `yolov8n.pt` model which detects standard COCO classes (people, vehicles, knives, etc.). For true weapon detection, the architecture allows you to easily hot-swap the weights. 

Simply drop your custom trained weapons model (e.g., `best.pt`) into the backend and update the path in `backend/services/ai_engine.py`.

## 📜 License
This project is licensed under the MIT License.
