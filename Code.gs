// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE'; // Replace with your Google Drive folder ID
const QR_API = 'https://api.qrserver.com/v1/create-qr-code/';

// ============================================
// CUSTOM MENU
// ============================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎫 Token System')
    .addItem('Generate All Tokens', 'generateAllTokens')
    .addItem('Send All Emails', 'sendAllEmails')
    .addSeparator()
    .addItem('Deploy Scanner App', 'deployWebApp')
    .addToUi();
}

function deployWebApp() {
  const url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert(`Scanner App URL:\n\n${url}\n\nShare this with volunteers!`);
}

// ============================================
// TOKEN GENERATION
// ============================================

function generateToken(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const name = sheet.getRange(row, 1).getValue();
  const email = sheet.getRange(row, 2).getValue();
  const rollNo = sheet.getRange(row, 3).getValue();
  const roomNo = sheet.getRange(row, 4).getValue();
  
  if (!name || !rollNo) {
    SpreadsheetApp.getUi().alert('Name and Roll No are required!');
    return;
  }
  
  const timestamp = new Date().getTime();
  const uniqueString = `${rollNo}-${name}-${timestamp}`;
  const token = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, uniqueString)
    .map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2))
    .join('').substring(0, 16);
  
  const qrData = JSON.stringify({
    name: name,
    rollNo: rollNo,
    roomNo: roomNo,
    token: token
  });
  
  const qrImageUrl = `${QR_API}?size=300x300&data=${encodeURIComponent(qrData)}`;
  const qrImageBlob = UrlFetchApp.fetch(qrImageUrl).getBlob();
  qrImageBlob.setName(`QR_${rollNo}_${name}.png`);
  
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const file = folder.createFile(qrImageBlob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const fileUrl = file.getUrl();
  
  sheet.getRange(row, 7).setValue(token);
  sheet.getRange(row, 8).setValue('Available');
  sheet.getRange(row, 11).setValue(fileUrl);
  
  SpreadsheetApp.getUi().alert(`Token generated for ${name}!\nDrive Link: ${fileUrl}`);
}

function generateAllTokens() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  let newTokensCount = 0;
  let skippedCount = 0;
  
  for (let i = 2; i <= lastRow; i++) {
    const name = sheet.getRange(i, 1).getValue();
    const rollNo = sheet.getRange(i, 3).getValue();
    const existingAvailableToken = sheet.getRange(i, 7).getValue();
    const existingUsedToken = sheet.getRange(i, 9).getValue();
    const existingDriveLink = sheet.getRange(i, 11).getValue();
    
    if (!name || !rollNo) {
      continue;
    }
    
    if ((existingAvailableToken && existingDriveLink) || existingUsedToken) {
      skippedCount++;
      continue;
    }
    
    try {
      generateTokenSilent(i);
      newTokensCount++;
    } catch (e) {
      Logger.log(`Error generating token for row ${i}: ${e}`);
    }
  }
  
  SpreadsheetApp.getUi().alert(
    `✅ Token Generation Complete!\n\n` +
    `New tokens created: ${newTokensCount}\n` +
    `Existing tokens skipped: ${skippedCount}`
  );
}

function generateTokenSilent(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const name = sheet.getRange(row, 1).getValue();
  const rollNo = sheet.getRange(row, 3).getValue();
  const roomNo = sheet.getRange(row, 4).getValue();
  
  if (!name || !rollNo) return;
  
  const existingAvailableToken = sheet.getRange(row, 7).getValue();
  const existingUsedToken = sheet.getRange(row, 9).getValue();
  const existingDriveLink = sheet.getRange(row, 11).getValue();
  
  if ((existingAvailableToken && existingDriveLink) || existingUsedToken) {
    return;
  }
  
  const timestamp = new Date().getTime();
  const uniqueString = `${rollNo}-${name}-${timestamp}`;
  const token = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, uniqueString)
    .map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2))
    .join('').substring(0, 16);
  
  const qrData = JSON.stringify({
    name: name,
    rollNo: rollNo,
    roomNo: roomNo,
    token: token
  });
  
  const qrImageUrl = `${QR_API}?size=300x300&data=${encodeURIComponent(qrData)}`;
  const qrImageBlob = UrlFetchApp.fetch(qrImageUrl).getBlob();
  qrImageBlob.setName(`QR_${rollNo}_${name}.png`);
  
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const file = folder.createFile(qrImageBlob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const fileUrl = file.getUrl();
  
  sheet.getRange(row, 7).setValue(token);
  sheet.getRange(row, 8).setValue('Available');
  sheet.getRange(row, 11).setValue(fileUrl);
  
  Utilities.sleep(1000);
}

// ============================================
// EMAIL FUNCTIONS
// ============================================

function sendEmail(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const name = sheet.getRange(row, 1).getValue();
  const email = sheet.getRange(row, 2).getValue();
  const rollNo = sheet.getRange(row, 3).getValue();
  const roomNo = sheet.getRange(row, 4).getValue();
  const token = sheet.getRange(row, 7).getValue();
  const driveLink = sheet.getRange(row, 11).getValue();
  const mailSent = sheet.getRange(row, 12).getValue();
  
  if (!email || !token || !driveLink) {
    SpreadsheetApp.getUi().alert('Missing email, token, or QR code link!');
    return;
  }
  
  if (mailSent === 'Yes' || mailSent === '✓' || mailSent === 'Sent' || mailSent === '✓ Sent') {
    const response = SpreadsheetApp.getUi().alert(
      'Email Already Sent!',
      `Email was already sent to ${name} (${email}).\n\nSend again?`,
      SpreadsheetApp.getUi().ButtonSet.YES_NO
    );
    
    if (response !== SpreadsheetApp.getUi().Button.YES) {
      return;
    }
  }
  
  const subject = 'Your Entry Token - Bring ID Card';
  const body = `
Dear ${name},

Your entry token has been generated. Please use the QR code for entry verification.

Details:
- Name: ${name}
- ID/Roll No: ${rollNo}
- Room/Section: ${roomNo}

⚠️ IMPORTANT: Bring your ID card along with this token.

Access your QR code: ${driveLink}

Instructions:
1. Click the link above
2. Save or screenshot the QR code
3. Present it along with your ID card
4. This is a ONE-TIME use token

Note: Do not share this with anyone.

Regards,
Event Management Team
  `;
  
  GmailApp.sendEmail(email, subject, body);
  sheet.getRange(row, 12).setValue('✓ Sent');
  
  SpreadsheetApp.getUi().alert(`✅ Email sent to ${name}`);
}

function sendAllEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  let sentCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (let i = 2; i <= lastRow; i++) {
    const email = sheet.getRange(i, 2).getValue();
    const token = sheet.getRange(i, 7).getValue();
    const driveLink = sheet.getRange(i, 11).getValue();
    const mailSent = sheet.getRange(i, 12).getValue();
    
    if (!email || !token || !driveLink) {
      continue;
    }
    
    if (mailSent === 'Yes' || mailSent === '✓' || mailSent === 'Sent' || mailSent === '✓ Sent') {
      skippedCount++;
      continue;
    }
    
    try {
      sendEmailSilent(i);
      sentCount++;
      Utilities.sleep(500);
    } catch (e) {
      errorCount++;
      Logger.log(`Error sending email to row ${i}: ${e}`);
    }
  }
  
  SpreadsheetApp.getUi().alert(
    `✅ Email Sending Complete!\n\n` +
    `Emails sent: ${sentCount}\n` +
    `Already sent (skipped): ${skippedCount}\n` +
    `Errors: ${errorCount}`
  );
}

function sendEmailSilent(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const name = sheet.getRange(row, 1).getValue();
  const email = sheet.getRange(row, 2).getValue();
  const rollNo = sheet.getRange(row, 3).getValue();
  const roomNo = sheet.getRange(row, 4).getValue();
  const driveLink = sheet.getRange(row, 11).getValue();
  
  const subject = 'Your Entry Token - Bring ID Card';
  const body = `
Dear ${name},

Your entry token has been generated. Please use the QR code for entry verification.

Details:
- Name: ${name}
- ID/Roll No: ${rollNo}
- Room/Section: ${roomNo}

⚠️ IMPORTANT: Bring your ID card along with this token.

Access your QR code: ${driveLink}

Instructions:
1. Click the link above
2. Save or screenshot the QR code
3. Present it along with your ID card
4. This is a ONE-TIME use token

Note: Do not share this with anyone.

Regards,
Event Management Team
  `;
  
  GmailApp.sendEmail(email, subject, body);
  sheet.getRange(row, 12).setValue('✓ Sent');
}

// ============================================
// WEB APP FUNCTIONS (SCANNER)
// ============================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('ScannerApp')
    .setTitle('Token Scanner')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function verifyToken(qrDataString) {
  try {
    const qrData = JSON.parse(qrDataString);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    for (let i = 2; i <= lastRow; i++) {
      const rollNo = sheet.getRange(i, 3).getValue();
      const availableToken = sheet.getRange(i, 7).getValue();
      const usedToken = sheet.getRange(i, 9).getValue();
      
      if (rollNo == qrData.rollNo) {
        if (usedToken == qrData.token) {
          return {
            success: false,
            message: '❌ TOKEN ALREADY USED',
            details: null
          };
        }
        
        if (availableToken == qrData.token) {
          return {
            success: true,
            message: '✅ Valid Token',
            details: {
              name: sheet.getRange(i, 1).getValue(),
              rollNo: rollNo,
              roomNo: sheet.getRange(i, 4).getValue(),
              token: qrData.token,
              row: i
            }
          };
        } else {
          return {
            success: false,
            message: '❌ INVALID TOKEN',
            details: null
          };
        }
      }
    }
    
    return {
      success: false,
      message: '❌ NOT FOUND IN DATABASE',
      details: null
    };
    
  } catch (e) {
    return {
      success: false,
      message: '❌ INVALID QR CODE',
      details: null
    };
  }
}

function acceptToken(row, token) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  sheet.getRange(row, 9).setValue(token);
  sheet.getRange(row, 7).setValue('');
  sheet.getRange(row, 8).setValue('✓ Used');
  
  return {
    success: true,
    message: '✅ Entry Granted'
  };
}

function rejectToken() {
  return {
    success: true,
    message: '❌ Entry Rejected - Token still valid'
  };
}
