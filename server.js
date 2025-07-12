import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { Ollama } from 'ollama';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const app = express();
const port = 3001;

// Initialize Ollama client
const ollama = new Ollama({ host: 'http://localhost:11434' });

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed'));
    }
  }
});

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads', { recursive: true });
  }
};

// Endpoint to process resume and generate summary
app.post('/api/summarize-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    // Read the uploaded resume file
    const resumeContent = await fs.readFile(req.file.path, 'utf8');
    
    // Clean up uploaded file
    await fs.unlink(req.file.path);

    // Prepare prompt for Ollama
    const prompt = `Please provide a concise professional summary of the following resume. Focus on key skills, experience, and qualifications:

${resumeContent}

Summary:`;

    // Call Ollama with phi4-mini model
    const response = await ollama.chat({
      model: 'phi4-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = response.message.content;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `resume-summary-${timestamp}.txt`;
    const summaryPath = path.join('uploads', filename);
    
    // Save summary to file
    await fs.writeFile(summaryPath, summary);

    // Send response with summary content and download info
    res.json({
      summary: summary,
      downloadUrl: `/api/download/${filename}`,
      filename: filename
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ 
      error: 'Failed to process resume',
      details: error.message 
    });
  }
});

// Endpoint to download generated summary files
app.get('/api/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join('uploads', filename);
    
    // Check if file exists
    await fs.access(filePath);
    
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(404).json({ error: 'File not found' });
      }
    });
    
  } catch (error) {
    console.error('File access error:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

// Check if Ollama is running and start if needed
const ensureOllama = async () => {
  try {
    // Try to ping Ollama
    await ollama.list();
    console.log('Ollama is already running');
  } catch {
    console.log('Starting Ollama...');
    try {
      // Start Ollama service
      await execAsync('ollama serve');
      // Wait a moment for service to start
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Ollama started successfully');
    } catch {
      console.log('Could not auto-start Ollama. Please run "ollama serve" manually');
    }
  }
  
  // Check if phi4-mini model is available
  try {
    const models = await ollama.list();
    const hasModel = models.models.some(model => model.name.includes('phi4-mini'));
    if (!hasModel) {
      console.log('Downloading phi4-mini model...');
      await ollama.pull({ model: 'phi4-mini' });
      console.log('phi4-mini model ready');
    }
  } catch {
    console.log('Warning: Could not verify phi4-mini model. You may need to run "ollama pull phi4-mini"');
  }
};

// Start server
const startServer = async () => {
  try {
    await ensureUploadsDir();
    console.log('Uploads directory ready');
    
    await ensureOllama();
    console.log('Ollama check complete');
    
    app.listen(port, () => {
      console.log(`✅ Backend server running on http://localhost:${port}`);
      console.log('🤖 Ollama integration ready');
      console.log('🔗 CORS enabled for http://localhost:3000');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();