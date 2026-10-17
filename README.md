# InterviewPrep Pro (Interview Practice Tracker)

A responsive interview preparation dashboard built with plain HTML, CSS and vanilla JavaScript. It has no framework, no npm and no build step. Data is saved in your browser's LocalStorage.

## Features

- Dashboard with total questions, completed DSA problems, completed Git/Technical questions and machine-coding status
- Add, edit and delete questions, with form validation and a delete confirmation dialog
- Categories (DSA, Git, Technical), difficulties (Easy, Medium, Hard) and statuses (Pending, In Progress, Completed)
- Search by title or notes, plus combined category, difficulty and status filters
- Overall completion bar, category-wise progress, weekly activity chart and weekly goal
- Machine-coding status and notes
- Light and dark mode
- Toast notifications, empty states and a no-results state
- Responsive layout: sidebar drawer, a table on desktop and cards on mobile
- Settings page with weekly target, optional demo data and a reset option

## Folder structure

```text
interview-practice-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally

1. Put the four files in one folder.
2. Double-click `index.html` to open it in your browser. No server is needed.

## Upload to GitHub

1. Create a new empty repository on github.com (for example `interview-practice-tracker`).
2. Open a terminal (or Git Bash) in the project folder and run:

```bash
git init
git add .
git commit -m "Add InterviewPrep Pro"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/interview-practice-tracker.git
git push -u origin main
```

## Deploy with GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the **main** branch and the **/ (root)** folder, then click **Save**.
4. After a minute, the site is live at `https://YOUR-USERNAME.github.io/interview-practice-tracker/`.

## Deploy with Netlify

1. Sign in at netlify.com and choose **Add new site → Import an existing project**.
2. Connect your GitHub repository.
3. Leave the build command empty and set the publish directory to `.` (the root), then deploy.

You can also drag and drop the project folder onto the Netlify dashboard.

## Deploy with Vercel

1. Sign in at vercel.com and choose **Add New → Project**.
2. Import your GitHub repository.
3. Set the framework preset to **Other**, leave the build command empty, and deploy.

## Notes

- Data is stored per browser and per site address. Clearing site data removes your questions.
- Use **Settings → Load demo data** for sample questions, and **Reset all data** to start fresh.