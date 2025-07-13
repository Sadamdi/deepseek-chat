# Discord Bot - DeepSeek AI Assistant

A powerful Discord bot powered by DeepSeek AI that helps users with various tasks including document processing, image analysis, and intelligent conversations.

## 🚀 Features

- **🤖 AI Assistant**: Powered by DeepSeek AI for intelligent conversations and task assistance
- **📄 File Processing**: Support for multiple file formats (PDF, Word, Excel, PowerPoint, etc.)
- **🖼️ Image Analysis**: Advanced image analysis using Google Gemini AI
- **📊 Google Workspace Integration**: Read content from Google Docs, Slides, and Sheets
- **📑 Smart Pagination**: Beautiful embeds with pagination for long responses
- **💾 History Management**: Persistent chat history per channel
- **⚡ Slash Commands**: Easy-to-use slash commands for bot configuration
- **🔄 Real-time Configuration**: Dynamic configuration updates without restart

## 📁 Project Structure

```
deepseek/
├── bot.js                          # Main bot entry point
├── config/
│   └── configManager.js            # Configuration management
├── utils/
│   ├── historyManager.js           # Chat history management
│   ├── fileProcessor.js            # Multi-format file processing
│   ├── embedBuilder.js             # Embed creation and pagination
│   └── commandDeployer.js          # Slash command deployment
├── services/
│   ├── aiService.js                # AI services (DeepSeek & Gemini)
│   └── googleDocsService.js        # Google Workspace integration
├── handlers/
│   ├── messageHandler.js           # Message event handler
│   └── commandHandler.js           # Slash command handler
├── commands/
│   └── slashCommands.js            # Slash command definitions
├── config.json                     # Configuration file
├── history.json                    # Chat history storage
├── package.json                    # Dependencies
└── .env                           # Environment variables
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Discord Bot Token
- DeepSeek API Key(s)
- Google Gemini API Key

### Step 1: Clone and Install
```bash
git clone https://github.com/Sadamdi/deepseek-chat
cd deepseek
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the root directory:

```env
# Discord Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id

# DeepSeek AI Configuration (Multiple keys for load balancing)
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_KEY2=your_deepseek_api_key2
DEEPSEEK_API_KEY3=your_deepseek_api_key3
DEEPSEEK_API_KEY4=your_deepseek_api_key4
DEEPSEEK_API_KEY5=your_deepseek_api_key5

# Google AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Run the Bot
```bash
node bot.js
```

## 📋 Supported File Types

| Category | File Extensions |
|----------|----------------|
| **Documents** | PDF, DOC, DOCX |
| **Spreadsheets** | XLS, XLSX |
| **Presentations** | PPT, PPTX |
| **Text Files** | TXT, MD, LOG, HTML, CSS, JS, JSON, XML, CSV, PY, JAVA, SQL |
| **Images** | JPEG, PNG, GIF (automatic description) |
| **Google Workspace** | Docs, Slides, Sheets |

### Message Commands
- Upload any supported file for automatic processing
- Send images for AI-powered analysis
- Share Google Workspace links for content extraction

## 🔧 Module Architecture

### Config Manager (`config/configManager.js`)
Manages configuration files and real-time configuration updates without requiring bot restart.

### History Manager (`utils/historyManager.js`)
Stores and manages chat history for each channel, enabling contextual conversations.

### AI Service (`services/aiService.js`)
Handles communication with DeepSeek AI for text processing and Gemini AI for image analysis.

### File Processor (`utils/fileProcessor.js`)
Processes various file formats uploaded by users, extracting text content for AI analysis.

### Google Docs Service (`services/googleDocsService.js`)
Integrates with Google Workspace to read and extract content from Docs, Slides, and Sheets.

### Embed Builder (`utils/embedBuilder.js`)
Creates beautiful embeds with pagination for handling long responses efficiently.

### Message Handler (`handlers/messageHandler.js`)
Handles all incoming messages and determines appropriate responses based on content type.

### Command Handler (`handlers/commandHandler.js`)
Manages Discord slash commands and their execution.

## 🔄 Configuration

The bot uses a `config.json` file for persistent settings:

```json
{
  "responsiveChannels": ["channel_id_1", "channel_id_2"],
  "maxHistoryLength": 50,
  "maxResponseLength": 2000
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.