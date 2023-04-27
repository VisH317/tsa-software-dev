import { google } from 'googleapis';

export default async function getContent(docId: string, accessToken: string) {
  // Authenticate with Google API
  const auth = new google.auth.OAuth2();
    var CLIENT_ID = '328586085940-coh2j1gv3t0889hkamdev10297flhjtj.apps.googleusercontent.com'; // removed for posting to GitHub
    var CLIENT_SECRET = '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'; // removed for posting to GitHub
  auth.setCredentials({ access_token: accessToken });
  
  // Initialize the Google Drive API client
  const drive = google.drive({
    version: 'v3',
    auth: auth,
  });

  // Export the Google Doc as plain text
  const {data}  = await drive.files.export({
    fileId: docId,
    mimeType: 'text/plain',
  });

  console.log(data)
  return data;
}