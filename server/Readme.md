# FastAPI Server

This repository contains a FastAPI server application. Follow the instructions below to set up, run, and manage the development environment.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Python 3.8 or higher
- `pip` (Python package installer)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:illinoistech-itm/spring2025-team05.git
cd server
```

### 2. Create a Virtual Environment
To isolate dependencies, create a virtual environment:
```bash
python -m venv .venv
```

Activate the virtual environment:
- **Linux/macOS**:
  ```bash
  source .venv/bin/activate
  ```
- **Windows**:
  ```bash
  .venv\Scripts\activate
  ```

### 3. Install Dependencies
Install the required dependencies for the project:
```bash
pip install -r requirements-dev.txt
```

---

## Running the Server

### Development Mode
To run the FastAPI server in development mode:
```bash
fastapi dev app.py
```

This will start the server and enable features like automatic reloading on code changes.

---

## Managing Dependencies

### Adding Production Dependencies
When you add a new dependency for the application, make sure to update the `requirements.txt` file:
1. Install the dependency:
   ```bash
   pip install <package_name>
   ```
2. Update `requirements.txt` to include the package(s) or `requirements-dev.txt`
   if it's for development only

## API Documentation

FastAPI automatically generates interactive API documentation. Once the server is running, you can access it at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

## Contributing

If you plan to contribute to this project:
1. Fork the repository.
2. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them.
4. Push your changes to your fork and create a pull request.

---

## Contact

For questions you can ping me(tayomde) on our discord server.
