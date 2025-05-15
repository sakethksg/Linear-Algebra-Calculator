# Deploying to PythonAnywhere

Follow these steps to deploy your Mathematics Web Application to PythonAnywhere:

## 1. Sign Up for PythonAnywhere

- Create an account at [pythonanywhere.com](https://www.pythonanywhere.com/)
- For a free account, choose the "Beginner" tier

## 2. Set Up Your Web App

1. Once logged in, go to the "Web" tab
2. Click "Add a new web app"
3. Select "Manual configuration"
4. Select Python version that matches your local version (Python 3.8+ recommended)

## 3. Upload Your Code

### Option 1: Upload files directly

1. Go to the "Files" tab
2. Navigate to `/home/yourusername/`
3. Create a folder for your app (e.g., `maths-app`)
4. Upload all your project files to this folder

### Option 2: Use Git (recommended)

1. Go to the "Consoles" tab
2. Start a new Bash console
3. Navigate to your home directory:
   ```
   cd ~
   ```
4. Clone your repository:
   ```
   git clone https://github.com/yourusername/your-repo.git maths-app
   ```

## 4. Set Up a Virtual Environment

1. In the Bash console, create and activate a virtual environment:
   ```
   mkvirtualenv --python=python3.10 maths-env
   ```
2. Navigate to your project folder:
   ```
   cd ~/maths-app
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## 5. Configure the WSGI File

1. Go to the "Web" tab
2. Scroll down to the "Code" section
3. Click on the link to the WSGI configuration file
4. Replace the content with the following:

```python
import sys
path = '/home/yourusername/maths-app'
if path not in sys.path:
    sys.path.insert(0, path)

from flask_app import application
```

## 6. Configure Web App Settings

1. In the "Web" tab:
2. Set the "Source code" directory to `/home/yourusername/maths-app`
3. Set the "Working directory" to `/home/yourusername/maths-app`
4. Set the "Virtualenv" to `/home/yourusername/.virtualenvs/maths-env`

## 7. Static Files (if needed)

1. In the "Web" tab, scroll to "Static files"
2. Add a mapping for `/static/` to `/home/yourusername/maths-app/static`
3. If you have other static file directories, map them as well

## 8. Reload Your Web App

1. Click the green "Reload" button at the top of the "Web" tab
2. Your app should now be live at `yourusername.pythonanywhere.com`

## Troubleshooting

- Check the error logs in the "Web" tab if your app doesn't work
- Make sure all dependencies are installed in your virtual environment
- Ensure file paths in the WSGI file match your setup
- Check for any hard-coded paths in your application code 