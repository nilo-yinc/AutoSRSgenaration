// ============================================================
// DocuVerse Email Gateway — Google Apps Script
// ============================================================
// SETUP INSTRUCTIONS:
//
// 1. Go to https://script.google.com
// 2. Click "+ New project"
// 3. Delete the default code and paste this ENTIRE file
// 4. Click "Deploy" → "New deployment"
// 5. Type = "Web app"
//    - Execute as: "Me"
//    - Who has access: "Anyone"
// 6. Click "Deploy" → Authorize when prompted
// 7. Copy the Web app URL (looks like https://script.google.com/macros/s/xxx/exec)
// 8. Add these to Render environment variables:
//    - GMAIL_APPS_SCRIPT_URL = <the URL you copied>
//    - GMAIL_APPS_SCRIPT_TOKEN = docuverse-email-secret-2026
//
// That's it! Emails will be sent from your Gmail account.
// ============================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Verify secret token
    if (data.token !== 'docuverse-email-secret-2026') {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var options = {
      htmlBody: data.html || undefined,
      name: data.fromName || 'DocuVerse',
      replyTo: data.replyTo || undefined
    };

    // Handle attachments (base64-encoded)
    if (data.attachments && data.attachments.length > 0) {
      options.attachments = data.attachments.map(function (att) {
        var bytes = Utilities.base64Decode(att.content);
        return Utilities.newBlob(bytes,
          att.contentType || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          att.filename || 'document.docx');
      });
    }

    GmailApp.sendEmail(data.to, data.subject, data.text || '', options);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this in Apps Script editor to verify it works
function testSend() {
  var e = {
    postData: {
      contents: JSON.stringify({
        token: 'docuverse-email-secret-2026',
        to: 'knowsphere.pr@gmail.com',
        subject: 'DocuVerse Test Email',
        text: 'If you see this, the email gateway is working!',
        html: '<h2>DocuVerse Email Gateway</h2><p>If you see this, the email gateway is working!</p>',
        fromName: 'DocuVerse'
      })
    }
  };
  var result = doPost(e);
  Logger.log(result.getContent());
}
