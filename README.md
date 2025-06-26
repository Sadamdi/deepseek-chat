# Discord Bot - DeepSeek AI Assistant

Bot Discord yang menggunakan AI DeepSeek untuk membantu pengguna dengan berbagai tugas.

## Struktur Proyek

```
deepseek/
├── bot.js                          # File utama bot
├── config/
│   └── configManager.js            # Manajemen konfigurasi
├── utils/
│   ├── historyManager.js           # Manajemen history chat
│   ├── fileProcessor.js            # Pemrosesan berbagai jenis file
│   ├── embedBuilder.js             # Pembuatan embed dan pagination
│   └── commandDeployer.js          # Deploy slash commands
├── services/
│   ├── aiService.js                # Layanan AI (DeepSeek & Gemini)
│   └── googleDocsService.js        # Layanan Google Docs
├── handlers/
│   ├── messageHandler.js           # Handler untuk pesan
│   └── commandHandler.js           # Handler untuk slash commands
├── commands/
│   └── slashCommands.js            # Definisi slash commands
├── config.json                     # File konfigurasi
├── history.json                    # File history chat
├── package.json                    # Dependencies
└── .env                           # Environment variables
```

## Fitur

- **AI Assistant**: Menggunakan DeepSeek AI untuk menjawab pertanyaan
- **File Processing**: Mendukung berbagai format file (PDF, Word, Excel, PowerPoint, dll.)
- **Image Analysis**: Analisis gambar menggunakan Gemini AI
- **Google Docs Integration**: Membaca konten dari Google Docs, Slides, dan Sheets
- **Pagination**: Embed dengan pagination untuk respons panjang
- **History Management**: Menyimpan history chat per channel
- **Slash Commands**: Command untuk mengatur channel yang responsif

## Setup

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` dengan variabel berikut:
```env
DISCORD_BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_KEY2=your_deepseek_api_key2
DEEPSEEK_API_KEY3=your_deepseek_api_key3
DEEPSEEK_API_KEY4=your_deepseek_api_key4
DEEPSEEK_API_KEY5=your_deepseek_api_key5
GEMINI_API_KEY=your_gemini_api_key
```

3. Jalankan bot:
```bash
node bot.js
```

## Commands

- `/respondall [channel_id]` - Menambahkan channel ke daftar respons bot

## File Types Supported

- **Documents**: PDF, DOC, DOCX
- **Spreadsheets**: XLS, XLSX
- **Presentations**: PPT, PPTX
- **Text Files**: TXT, MD, LOG, HTML, CSS, JS, JSON, XML, CSV, PY, JAVA, SQL
- **Images**: JPEG, PNG, GIF (deskripsi otomatis)
- **Google Workspace**: Docs, Slides, Sheets

## Struktur Modul

### Config Manager
Mengelola file konfigurasi dan perubahan konfigurasi secara real-time.

### History Manager
Menyimpan dan mengelola history chat untuk setiap channel.

### AI Service
Menangani komunikasi dengan DeepSeek AI dan Gemini AI untuk analisis gambar.

### File Processor
Memproses berbagai jenis file yang diupload pengguna.

### Google Docs Service
Mengintegrasikan dengan Google Workspace untuk membaca dokumen.

### Embed Builder
Membuat embed dengan pagination untuk respons yang panjang.

### Message Handler
Menangani semua pesan yang masuk dan menentukan respons yang tepat.

### Command Handler
Menangani slash commands dari Discord.

## Keuntungan Struktur Baru

1. **Modular**: Setiap fungsi dipisahkan ke dalam modul yang spesifik
2. **Maintainable**: Mudah untuk debugging dan maintenance
3. **Scalable**: Mudah untuk menambah fitur baru
4. **Readable**: Kode lebih mudah dibaca dan dipahami
5. **Reusable**: Modul dapat digunakan kembali di tempat lain 