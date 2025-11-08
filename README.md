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
