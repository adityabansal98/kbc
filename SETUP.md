# Setup Instructions for Gemini API

## Getting Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey) or [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy your API key

## Setting Up Environment Variables

1. Create a `.env` file in the root directory of the project (same level as `package.json`)
2. Add the following line to the `.env` file:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied.

## Example `.env` file:

```
VITE_GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

## Important Notes

- The `.env` file is already added to `.gitignore` and will not be committed to git
- Never share your API key publicly
- Restart your development server after creating/updating the `.env` file
- The app will use fallback questions if the API key is missing or invalid

## Running the App

After setting up your API key:

```bash
npm run dev
```

The app will automatically use Gemini API to generate dynamic questions. If the API fails, it will fall back to hardcoded questions.

