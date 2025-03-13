# AI ForgeX Suite - User Guide

## Introduction

Welcome to AI ForgeX Suite, your solution for transparent and customizable AI content generation. This guide will help you navigate the platform and make the most of its features.

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection

### Accessing the Application
1. The application can be accessed at `http://localhost:5001` when running locally
2. The backend API runs separately at `http://localhost:5000`

## Main Interface

The AI ForgeX Suite interface is divided into three main sections:

### 1. Welcome Screen
- Introduction to the platform
- Quick navigation to AI tools via the "Start Creating" button

### 2. AI Models
The heart of the application, containing two main AI tools:

#### Image Generator
This tool allows you to create images based on text descriptions.

**How to use:**
1. Enter a descriptive prompt in the text area
2. Click the "Generate Image" button
3. Wait for the image generation process to complete
4. View the generated image and its explanation

**Tips for effective prompts:**
- Be specific and descriptive (e.g., "A majestic snow-capped mountain at sunset, with a crystal-clear lake reflecting the orange and purple sky, surrounded by pine trees in the foreground")
- Include style information (e.g., "photorealistic", "watercolor", "oil painting")
- Specify lighting conditions (e.g., "dramatic lighting", "soft morning light")
- Include technical details for higher quality (e.g., "8k resolution", "detailed textures")
- Use adjectives to enhance the mood (e.g., "serene", "dramatic", "mysterious")

**Example prompts:**
- "A futuristic cityscape at night with neon lights reflecting in puddles, cyberpunk style, highly detailed"
- "A serene Japanese garden with cherry blossoms, a small bridge over a koi pond, and a traditional pagoda in the background, watercolor style"
- "An astronaut riding a horse on Mars, photorealistic, NASA-inspired"

#### Text Generator
This tool generates text content based on your prompts, with explanations of the reasoning process.

**How to use:**
1. Enter a prompt or question in the text area
2. Click the "Generate Text" button
3. Wait for the text generation process to complete
4. View the generated text and its explanation

**Tips for effective prompts:**
- Be clear about what you're requesting (e.g., "Write a detailed scientific explanation of how auroras form")
- Specify the tone and style (e.g., "in a conversational tone", "in the style of a technical manual")
- Include the target audience (e.g., "for high school students", "for experts in the field")
- Specify the desired length (e.g., "in about 300 words", "in 3 paragraphs")

**Example prompts:**
- "Describe and explain in detail how to construct a regular dodecahedron, including its geometric properties, suitable for a high school geometry student"
- "Write a detailed scientific explanation of how auroras (northern lights) form in the Earth's atmosphere, including the role of solar wind, magnetic fields, and atmospheric particles"
- "Explain the concept of blockchain technology in simple terms, as if explaining to someone with no technical background"

### 3. Export Section
- Tools to save and export your generated content
- Currently supports export as PDF, PNG, and text formats
- Click on the desired export format button to save your work

## Navigating the Interface

- Use the tabs in the sidebar to switch between different sections (Welcome, AI Models, Export)
- All generated content will remain in the session until you close the browser

## Understanding the Results

### Image Generation Results
The system will display:
- The generated image based on your prompt
- Your original prompt for reference
- A brief explanation of the image generation process

### Text Generation Results
The system will display:
- The generated text based on your prompt
- Your original prompt for reference
- An explanation of how the text was generated, including reasoning patterns and source attribution where applicable

## Troubleshooting

### Common Issues

**The image generation is taking too long**
- Try a simpler prompt
- Check your internet connection
- Refresh the page and try again

**The text generation provides unexpected results**
- Be more specific in your prompt
- Add more context or constraints
- Try rephrasing the prompt

**The application is not responding**
- Ensure both the frontend and backend servers are running
- Clear your browser cache
- Try accessing the application in a different browser

### Getting Help
If you encounter issues not addressed in this guide, please:
- Check the developer manual for technical details
- Contact support with details about the issue
- Include error messages and steps to reproduce the problem when reporting issues

## Privacy and Data Usage

- All prompts and generated content remain on your local session
- The application does use external API calls to Nebius AI services
- No user data is stored permanently unless explicitly exported

## Advanced Features

### Customizing the Generation Process
Future versions will include:
- Adjustable parameters for image generation (style strength, guidance scale, etc.)
- Fine-grained control over text generation (temperature, tone, style)
- Ability to save and reuse favorite prompts

### Batch Processing
Future versions will support:
- Generating multiple images or texts with variations
- Comparing results from different parameter settings
- A/B testing of different prompts
