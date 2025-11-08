# 🎫 Event Token System - Google Sheets + Apps Script

A complete token generation and scanning system for events, hostels, or any entry management using Google Sheets and Google Apps Script.

![System Demo](screenshots/sheet-layout.png)

## ✨ Features

- 🎯 **Token Generation** - Auto-generate unique QR codes for participants
- 📧 **Email Automation** - Send QR codes via email with Drive links
- 📱 **Mobile Scanner** - Fast QR code scanner web app for volunteers
- ✅ **One-Time Use** - Tokens are marked as used after scanning
- 🔒 **Duplicate Prevention** - Won't regenerate existing tokens
- 📊 **Email Tracking** - Prevents spam by tracking sent emails
- 🚀 **Easy Setup** - Works entirely within Google ecosystem

## 🎥 Demo

- **Token Generation**: Generate unique hash tokens for all participants
- **QR Code Storage**: Automatically saved to Google Drive
- **Email Sending**: Bulk email with personalized QR codes
- **Scanner App**: Mobile-friendly web app for entry verification

## 📋 Prerequisites

- Google Account
- Google Drive (for QR code storage)
- Google Sheets
- Basic understanding of Google Apps Script

## 🚀 Quick Setup

### Step 1: Create Google Sheet

Create a new Google Sheet with the following columns:

| Column | Header | Description |
|--------|--------|-------------|
| A | Name | Participant name |
| B | Email | Email address |
| C | Roll No | ID/Roll number |
| D | Room No | Room/Section number |
| E | Contact No | Phone number (optional) |
| F | Generate Token Button | (Optional) |
| G | Available Token | Generated token hash |
| H | Status | Available/Used status |
| I | Used Token | Token after use |
| J | Send Mail Button | (Optional) |
| K | QR Code Link | Google Drive link |
| L | Mail Sent | Email status tracker |

### Step 2: Create Google Drive Folder

1. Create a folder in Google Drive for QR codes
2. Copy the folder ID from URL:

https://drive.google.com/drive/folders/YOUR_FOLDER_ID


### Step 3: Setup Apps Script

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete existing code in `Code.gs`
4. Copy and paste code from [`Code.gs`](Code.gs)
5. Update `DRIVE_FOLDER_ID` with your folder ID:


const DRIVE_FOLDER_ID = 'YOUR_FOLDER_ID_HERE';




### Step 4: Add Scanner HTML

1. In Apps Script Editor, click **File > New > HTML file**
2. Name it: `ScannerApp`
3. Copy and paste code from [`ScannerApp.html`](ScannerApp.html)
4. Click **Save**

### Step 5: Deploy Web App

1. Click **Deploy > New deployment**
2. Select type: **Web app**
3. Settings:
- Execute as: **Me**
- Who has access: **Anyone**
4. Click **Deploy**
5. Copy the web app URL
6. Share URL with volunteers

### Step 6: Authorize Permissions

- Allow access to Google Sheets, Drive, and Gmail when prompted
- Grant necessary permissions

## 📖 Usage

### For Admins

1. **Add participant data** to the sheet
2. Click **🎫 Token System → Generate All Tokens**
3. Click **🎫 Token System → Send All Emails**
4. Click **🎫 Token System → Deploy Scanner App** to get URL

### For Volunteers

1. Open scanner web app URL on mobile
2. Allow camera access
3. Scan participant's QR code
4. Verify ID card physically
5. Click **Accept** or **Reject**

### For Participants

1. Receive email with QR code link
2. Open link and save/screenshot QR code
3. Bring QR code + ID card to event
4. Show to volunteer for scanning

## 🔧 Configuration

### Email Template

Edit email content in `Code.gs`:



const subject = 'Your Event Entry Token';
const body = Your custom message here...;



### QR Code Size

Change QR code dimensions in `Code.gs`:


const qrImageUrl = ${QR_API}?size=500x500&data=${data};


## 📱 Scanner Features

- ✅ Auto-start camera on load
- ✅ Full-screen scanning (85% of viewport)
- ✅ 30 FPS for fast detection
- ✅ Scan from any position
- ✅ Vibration feedback
- ✅ Real-time verification
- ✅ Accept/Reject buttons
- ✅ Error handling

## 🛡️ Security Features

- **One-time use tokens** - Cannot be reused
- **Hash-based tokens** - SHA-256 encryption
- **Physical verification** - Requires ID card check
- **Duplicate prevention** - Skips existing tokens
- **Email tracking** - Prevents spam

## 🐛 Troubleshooting

### Camera Not Working
- Enable camera permission in browser
- Use HTTPS (Apps Script automatically provides this)
- Try different browser (Chrome recommended)

### Tokens Not Generating
- Check Drive folder permissions
- Verify folder ID is correct
- Check Apps Script execution logs

### Emails Not Sending
- Check Gmail sending limits (500-1500/day)
- Verify email addresses are valid
- Add delays between sends (already implemented)

## 📊 System Flow

Admin adds participant data → Sheet

Generate tokens → Creates QR codes → Saves to Drive

Send emails → Participants receive Drive links

Participant saves QR code

Volunteer scans QR → Verifies identity

Accept → Token marked as used

Reject → Token remains valid



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created for hostel/event management at IIT Madras

## 🙏 Acknowledgments

- Google Apps Script
- HTML5 QRCode Scanner Library
- QR Server API

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check troubleshooting section
- Review Google Apps Script documentation

## ⭐ Star This Repo

If this helped you, please star this repository!

---

**Made with ❤️ for seamless event management**



