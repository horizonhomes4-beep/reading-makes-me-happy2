FIREBASE STUDENT-CONTROLLED SHARING APPLICATION
================================================

FEATURES
- Existing Firebase Google authentication and instructor approval workflow.
- Optional student-authorised Gmail read-only retrieval and explicit sharing.
- SMS and call-history sharing by manually importing a student-created CSV or JSON export.
- Students review records and individually select entries before sharing.
- Instructor dashboard has separate Gmail, SMS and Call History sections with shared search/date filters.
- Firestore rules restrict student writes to their own records; only approved instructors can list all records.

IMPORTANT PLATFORM LIMITATION
This is a browser application. A website cannot directly read Android/iPhone SMS inboxes or call logs. It does not install a device agent, request privileged OS access, or collect records in the background. Students must create/export a file themselves using a method permitted by their device and then choose that file on the student page. The application accepts CSV or JSON and displays records for review before sharing. Export formats differ by device/app; column names must map to the fields listed below.

SUPPORTED SMS CSV/JSON FIELDS
Date/time: date, datetime, timestamp, time
Contact: contact, name, contactName
Phone: phone, phoneNumber, number
Message: message, body, text, smsBody

SUPPORTED CALL CSV/JSON FIELDS
Date/time: date, datetime, timestamp, time, callDate
Contact: contact, name, contactName
Phone: phone, phoneNumber, number
Call type: type, direction, callType
Duration: duration, durationSeconds, length

CSV must have a header row. JSON must be an array of objects. Maximum file size is 1 MB and 500 records per import. Individual records are capped to reasonable field lengths by the browser and Firestore rules. This parser is intentionally basic; review imported values carefully before sharing.

DEPLOYMENT
1. Configure public/firebase-config.js with your Firebase web app configuration.
2. Enable Firebase Authentication > Google and create Firestore.
3. Enable Gmail API only if you intend to use the optional Gmail feature; review Google OAuth consent requirements.
4. Install Firebase CLI and authenticate: npm install -g firebase-tools; firebase login.
5. In this folder run firebase use --add and select your project.
6. Deploy: firebase deploy --only firestore:rules,hosting,functions
7. Bootstrap the first instructor with grant-admin.cjs from a trusted computer as described below. Later instructors can submit requests for approval.

FIRST INSTRUCTOR
Sign in once at admin.html, copy the Firebase Auth UID, then run grant-admin.cjs from a private trusted folder with a service-account credential stored OUTSIDE this project. Never place service-account credentials in public/ or upload them to hosting. Sign out and back in after granting the claim.

PRIVACY AND SAFETY
- Share only records the student is authorised to disclose and has reviewed.
- Do not collect another person's private messages or call details without permission.
- A shared record is visible to approved instructors in this Firebase project.
- Students can delete their own SMS/call records from Firestore through the student account or ask the instructor to remove them; instructor can delete records in Firebase Console. The current UI does not provide record deletion buttons.
- Apply institutional consent, retention, deletion and safeguarding policies before real-world use. Do not treat this starter as a regulated student-records platform.
- Firestore rules are security controls, not a substitute for testing with the Firebase Emulator Suite and reviewing your deployment configuration.

The existing functions/index.js and grant-admin.cjs remain in place. Cloud Functions deployment may require the Blaze billing plan; review costs and configure budget alerts.
