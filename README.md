# CoverMe

An AI-powered cover letter generator that creates personalized cover letters based on your resume and writing style, following Stanford's cover letter guidelines.

## Prerequisites

### 1. Install Ollama
Download and install Ollama from [https://ollama.ai](https://ollama.ai) for your operating system.

### 2. Install AI Models
Before using CoverMe, you need to install at least one language model. View models, their context windows, and download size here:

```bash
https://github.com/ollama/ollama
```

### 3. Start Ollama Service
Ensure Ollama is running before starting the application:

```bash
ollama serve
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coverme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Prepare your resume**
   - Convert your resume to a `.txt` file
   - Save it in an easily accessible location

## Running the Application

Start the development server (this runs both frontend and backend):

```bash
npm run dev
```

The application will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:3001](http://localhost:3001)

## How to Use

1. **Select AI Model**: Choose from available Ollama models in the dropdown (top-right)
2. **Upload Resume**: Upload your resume as a `.txt` file
3. **Add Job Link**: Paste the job posting URL you're applying for
4. **Writing Sample** (Optional): Add a sample of your writing to match your personal style
5. **Generate**: Click "Create" to generate your personalized cover letter

## Features

- **Stanford Guidelines**: Follows professional cover letter structure
- **Style Matching**: Mimics your writing style when provided with a sample
- **Model Selection**: Choose from any locally installed Ollama model
- **Clean Output**: Automatically removes AI thinking tags from responses
- **Professional Format**: Generates properly formatted business letters

## Troubleshooting

### Backend Connection Issues
- Ensure Ollama is running: `ollama serve`
- Verify models are installed: `ollama list`
- Check that ports 3000 and 3001 are available

### Model Not Found Errors
- Install the desired model: `ollama pull <model-name>`
- Restart the application after installing new models

### Performance Issues
- Use smaller models for faster generation
- Ensure sufficient system resources for larger models
- Close unnecessary applications if using resource-intensive models
