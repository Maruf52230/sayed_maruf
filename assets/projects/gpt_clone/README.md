# ChatGPT UI Clone - Client-Side Only

A responsive and interactive ChatGPT interface clone built with HTML, CSS, Bootstrap, Tailwind CSS, and JavaScript. This is a purely client-side implementation that connects directly to the OpenRouter API.

## Features

- Modern and responsive UI closely resembling the ChatGPT interface
- Live API integration with multiple AI models through OpenRouter:
  - DeepSeek R1 Distill LLama 70B
  - Google Gemini 1.5 Flash
  - DeepSeek Chat
  - Mistral Tiny
  - Meta Llama 3 8B Instruct
  - Chronos Hermes 13B
  - DeepSeek R1
- Interactive model selection dropdown
- Custom model support (add your own models)
- Markdown and code formatting in responses
- Syntax highlighting for code blocks
- Dark mode design
- Auto-resizing text input
- Mobile responsive with sidebar toggle
- Smooth animations and transitions

## Technologies Used

- **HTML5** - For structure
- **CSS3** - For custom styling
- **Bootstrap 5** - For layout components
- **Tailwind CSS** - For utility-first styling
- **JavaScript** - For interactive functionality and API integration
- **Font Awesome** - For icons

## Project Structure

- `index.html` - Main HTML file with the UI structure
- `styles.css` - Custom CSS styles with code block formatting
- `script.js` - JavaScript functionality and API integration

## Setup

1. Download the files or clone the repository
2. Open `index.html` directly in a web browser
3. The app comes pre-configured with an OpenRouter API key for demonstration
4. Start interacting with the AI by typing in the prompt box

## API Integration

The application connects directly to the OpenRouter API which provides access to various AI models:

- API key management through browser's localStorage
- Model selection functionality
- Custom model addition capability
- Error handling with user-friendly messages
- Markdown formatting for AI responses
- Code syntax highlighting

## Security Notes

- The included API key is for demonstration purposes only
- Your API key is stored in your browser's localStorage and sent directly to OpenRouter
- No server is involved, keeping the implementation simple

## Customization

You can easily customize the UI by:

- Modifying the color scheme in the HTML classes or CSS file
- Adding more functionality in the JavaScript file
- Extending the sidebar with additional options
- Adding custom models through the settings panel

## Mobile Responsiveness

The UI is fully responsive and works on various screen sizes:
- Desktop: Full sidebar and chat interface
- Tablet: Slightly condensed layout
- Mobile: Collapsible sidebar with hamburger menu

## License

Feel free to use and modify this project for personal or commercial purposes.

## Acknowledgments

- Inspired by the OpenAI ChatGPT interface
- Icons from Font Awesome
- Built with modern web technologies 