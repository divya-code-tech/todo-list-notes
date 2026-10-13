# To-Do List & Notes

A responsive React productivity app for organizing tasks in a Kanban board and keeping quick notes in one place. This project was built as a Week 04 React minor project.

## Features

### Tasks
- Create, edit, and delete tasks.
- Move tasks between **To Do**, **In Progress**, and **Done**.
- Mark tasks complete with a checkbox.
- Add a description, category, and optional due date.
- Search tasks and filter by pending/completed status.
- View task totals and progress indicators.

### Notes
- Create, edit, and delete notes.
- Search notes by title, content, and category.
- Filter notes by category.
- Choose a note colour and view its last-updated timestamp.
- See selected notes in the task-board Quick Notes section.

### Interface and workspace controls
- Responsive sidebar and three-column Kanban board.
- Compact task cards, tags, progress bars, and contextual actions.
- Notification panel generated from local due dates, task progress, and saved-note counts.
- Profile menu with editable display name and workspace label.
- Settings page with a light/dark theme switch and compact-card preference.
- Export a JSON backup containing tasks, notes, and profile details.
- Keyboard Escape support for closing create/edit forms.
- Responsive Notes grid.

## Technologies
- React 18
- Vite
- JavaScript ES6+
- CSS3
- Lucide React icons
- Browser Local Storage

## Setup

Requirements: Node.js 18+ and npm.

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. In the terminal, run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
todo-list-notes-minor-project/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    └── components/
        ├── Sidebar.jsx
        ├── TaskForm.jsx
        ├── TaskBoardCard.jsx
        ├── NoteForm.jsx
        └── NoteCard.jsx
```

## React concepts demonstrated

- Functional components and JSX
- Props and reusable components
- `useState` for UI and application state
- `useEffect` for Local Storage persistence
- `useMemo` to derive filtered tasks and notes
- Event handling and controlled forms
- Conditional rendering
- List rendering with `.map()`
- Filtering with `.filter()`
- Object updates with the spread operator
- ES6 arrow functions, destructuring, `const`, and template literals

## Data storage

Tasks, notes, preferences, and profile details are saved to Local Storage in the current browser. Notifications are generated from the current local tasks and notes; they are not push notifications from a server. Data is not synced to an account or another device. Use Settings → Data & storage to download a JSON backup before clearing browser site data. On first launch, sample tasks and notes are included so the board can be explored immediately.

## Screenshots

Add your own screenshots after running the app and save them in a `screenshots/` folder if required by your submission.

## Author

Built as a Week 04 React minor project.
