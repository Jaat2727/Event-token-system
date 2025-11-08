# 🎫 Event Token System

Generate and scan QR code tokens for events using Google Sheets and Apps Script.

## 📋 Features

- ✅ Generate unique QR code tokens
- ✅ Send tokens via email with Google Drive links
- ✅ Mobile scanner web app
- ✅ One-time use tokens
- ✅ Prevents duplicate generation and emails

## 🚀 Setup (5 Minutes)

### 1. Create Google Sheet

Create a new Google Sheet with these columns in Row 1:
A: Name
B: Email
C: Roll No
D: Room No
E: Contact No
F: (Optional)
G: Available Token
H: Status
I: Used Token
J: (Optional)
K: QR Code Link
L: Mail Sent





### 2. Create Drive Folder

1. Create a folder in Google Drive
2. Copy folder ID from URL:
https://drive.google.com/drive/folders/YOUR_FOLDER_ID




### 3. Add Code to Apps Script

1. In your sheet: **Extensions > Apps Script**
2. Delete default code
3. Copy **Code.gs** from this repo
4. Paste into editor
5. **IMPORTANT:** Update line 5:
const DRIVE_FOLDER_ID = 'YOUR_FOLDER_ID_HERE';
6. Save (Ctrl+S)






### 4. Add Scanner HTML

1. In Apps Script: **File > New > HTML file**
2. Name it: `ScannerApp`
3. Copy **ScannerApp.html** from this repo
4. Paste and save

### 5. Authorize & Deploy

1. Click **Run** button
2. Select `onOpen` function
3. Click **Run** → **Review permissions** → **Allow**
4. Click **Deploy > New deployment**
5. Type: **Web app**
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Click **Deploy**
9. Copy web app URL

## 📖 Usage

### Generate Tokens

1. Add participant data to sheet (Name, Email, Roll No, Room No)
2. Refresh sheet (F5)
3. Menu: **🎫 Token System → Generate All Tokens**
4. Wait for completion

### Send Emails

1. Menu: **🎫 Token System → Send All Emails**
2. Participants receive Drive links with QR codes

### Scan Tokens

1. Open web app URL on mobile
2. Allow camera access
3. Point at QR code
4. Verify ID card
5. Accept or Reject

## 🔧 Customization

### Change Email Content

Edit in `Code.gs` around line 200:
const subject = 'Your Custom Subject';
const body = Your custom message...;



### Change QR Size

Edit in `Code.gs` around line 85:
const qrImageUrl = ${QR_API}?size=500x500&data=...;




## 📱 Sheet Columns Explained

| Column | Purpose |
|--------|---------|
| G | Available Token (auto-filled) |
| H | Status (Available/Used) |
| I | Used Token (filled after scan) |
| K | QR Code Drive Link (auto-filled) |
| L | Mail Sent (✓ Sent or empty) |

## ❓ Troubleshooting

**Camera not working?**
- Allow camera permission in browser
- Use Chrome on mobile

**Tokens not generating?**
- Check Drive folder ID is correct
- Verify permissions granted

**Emails not sending?**
- Gmail limit: 500 emails/day
- Check email addresses are valid

## 📄 License

MIT License - Free to use and modify

## 💡 Tips

- Test with 1-2 rows first
- Generate tokens before sending emails
- Share scanner URL with volunteers only
- Keep backup of sheet

---

**Questions?** Open an issue on GitHub








