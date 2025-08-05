// Magic numbers and variables
const GITHUB_OWNER  = 'dhruv0000';             // e.g. "DhruvFan123"
const GITHUB_REPO   = 'dhruv-archives';        // e.g. "my-pdfs"
const GITHUB_BRANCH = 'main';                  // target branch
const FOLDER_PATH   = 'resume/';               // e.g. ``, `doc`

// Steps to use:
// 1. Create a GitHub PAT with repo scope: https://github.com/settings/personal-access-tokens
//      Steps: Create a new fine-grained PAT -> Permissions: (Contents: write) and optionally (Workflows: write).
// 2. Store the PAT in Script Properties:
//    - Open Extensions > Apps Script
//    - Go to Project Settings > Script Properties
//    - Add a new property: GITHUB_TOKEN = 'your_pat_here'
// Note: As a fallback, you can hardcode it in script.
// Add Drive API as a Service
// 3. Run initialize() once to store the document ID
// 4. Set up a time-driven trigger for checkAndUploadOnRename()

/**
 * Initializes the script by storing the document's ID in Script Properties.
 */
function initialize() {
  var doc = DocumentApp.getActiveDocument();
  var docId = doc.getId();
  var properties = PropertiesService.getScriptProperties();
  properties.setProperty('docId', docId);
}

/**
 * Checks if the document's name has changed and uploads it as PDF if it has.
 */
function checkAndUploadOnRename() {
  var properties = PropertiesService.getScriptProperties();
  var docId = properties.getProperty('docId');
  if (!docId) {
    Logger.log('docId not set. Please run initialize() first.');
    return;
  }
  
  try {
    var file = DriveApp.getFileById(docId);
    var currentName = file.getName();
    var lastName = properties.getProperty('lastDocName');
    
    if (!lastName || lastName !== currentName) {
      uploadDocAsPdfToGitHub(docId);
      properties.setProperty('lastDocName', currentName);
    }
  } catch (e) {
    Logger.log('Error: ' + e.message);
  }
}

/**
 * Returns a Blob of the PDF exactly as Docs → Download → PDF would.
 */
function getPdfBlob(docId) {
  // 1. Fetch the file metadata (this gives us the exportLinks map).
  const file = Drive.Files.get(docId);

  // 2. Grab the PDF export link (already includes alt=media).
  const exportUrl = file.exportLinks['application/pdf'];

  // 3. Fetch the PDF blob with your OAuth token.
  const response = UrlFetchApp.fetch(exportUrl, {
    headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() }
  });

  // 4. Name it and return.
  return response.getBlob().setName(file.title + '.pdf');
}


/**
 * Exports the document as PDF and uploads or updates it in the specified GitHub repo.
 * @param {string} docId - The ID of the Google Doc.
 */
function uploadDocAsPdfToGitHub(docId) {
  const properties = PropertiesService.getScriptProperties();
  const GITHUB_TOKEN = properties.getProperty('GITHUB_TOKEN') || 'github_pat_random_hash'; // Fallback to hardcoded token

  var file = DriveApp.getFileById(docId);
  var pdfBlob = file.getAs('application/pdf');
  // const pdfBlob = getPdfBlob(docId);

  var base64Content = Utilities.base64Encode(pdfBlob.getBytes());
  var fileName = file.getName() + '.pdf';
  var path = `${FOLDER_PATH}${fileName}`;
  var url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  
  // Get existing file SHA for updates
  var sha;
  var getOptions = {
    method: 'get',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    },
    muteHttpExceptions: true
  };
  var getResp = UrlFetchApp.fetch(`${url}?ref=${GITHUB_BRANCH}`, getOptions);
  if (getResp.getResponseCode() === 200) {
    sha = JSON.parse(getResp.getContentText()).sha;
  }
  
  // Build payload & upload
  var payload = {
    message: `Upload ${fileName} via Apps Script`,
    content: base64Content,
    branch: GITHUB_BRANCH,
    sha: sha
  };
  var putOptions = {
    method: 'put',
    contentType: 'application/json',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  var response = UrlFetchApp.fetch(url, putOptions);
  Logger.log(response.getContentText());
}

/**
 * Manually uploads the current Google Doc as a PDF to GitHub.
 */
function uploadNow() {
  var properties = PropertiesService.getScriptProperties();
  var docId = properties.getProperty('docId');
  if (!docId) {
    Logger.log('docId not set. Please run initialize() first.');
    return;
  }
  
  try {
    uploadDocAsPdfToGitHub(docId);
    var file = DriveApp.getFileById(docId);
    var currentName = file.getName();
    properties.setProperty('lastDocName', currentName);
    Logger.log('Manual upload completed successfully.');
  } catch (e) {
    Logger.log('Error during manual upload: ' + e.message);
  }
}