# Beginner Guide — How to Run This Website on Your Computer

This project is **already built**. You do not need to write the code from scratch.
You only need to **download it**, **install one program (Node.js)**, and **run two commands**.

---

## What you need (install once)

### 1. Node.js (required)

Node.js lets your computer run the website.

1. Go to: https://nodejs.org
2. Download the **LTS** version (the big green button)
3. Install it — click Next through the installer (defaults are fine)
4. Restart your computer after installing

**Check it worked:** open Terminal (Mac) or Command Prompt (Windows) and type:

```bash
node --version
npm --version
```

You should see version numbers (e.g. `v22.x.x` and `10.x.x`). If you see an error, Node.js is not installed correctly.

### 2. A code editor (recommended)

Use **Cursor** or **Visual Studio Code** to open and edit the project folder.

- Cursor: https://cursor.com
- VS Code: https://code.visualstudio.com

---

## Step 1 — Get the project folder on your computer

Pick **one** of these methods:

### Option A: Download as ZIP (easiest for beginners)

1. Open: https://github.com/addaiisaac/rock-paperses
2. Click the green **Code** button
3. Click **Download ZIP**
4. Unzip the file (right-click → Extract)
5. Rename the folder to something simple, e.g. `navy-cadet-website`
6. Move it somewhere easy to find, e.g. `Documents/navy-cadet-website`

### Option B: Clone with Git (if you use GitHub)

```bash
git clone https://github.com/addaiisaac/rock-paperses.git navy-cadet-website
cd navy-cadet-website
git checkout cursor/navy-cadet-website-4910
```

---

## Step 2 — Open the folder in your editor

1. Open Cursor or VS Code
2. **File → Open Folder**
3. Select your `navy-cadet-website` folder
4. You should see folders like `src`, `public`, and files like `package.json`

---

## Step 3 — Install dependencies (first time only)

Open the **terminal inside your editor**:

- **Cursor / VS Code:** menu → Terminal → New Terminal
- Make sure the terminal is inside your project folder

Run:

```bash
npm install
```

Wait 1–2 minutes. This downloads the tools the project needs into a `node_modules` folder (you don't edit that folder).

---

## Step 4 — Start the website

Run:

```bash
npm run dev
```

You should see something like:

```
▲ Next.js ...
- Local: http://localhost:3000
```

Open your web browser and go to: **http://localhost:3000**

You should see the Navy Cadet Association homepage.

**To stop the server:** press `Ctrl + C` in the terminal.

---

## What does "compile" mean here?

You do **not** need to compile anything manually to work on the site.

| Command | What it does | When to use |
|---------|--------------|-------------|
| `npm run dev` | Runs the site for **editing** — changes appear when you save | Every day while building |
| `npm run build` | **Compiles** a production-ready version | Before deploying online |
| `npm start` | Runs the compiled version | After `npm run build` |

For learning and editing, **`npm run dev` is all you need**.

---

## Which files should you edit?

Start with these — they are the safest and easiest:

| What you want to change | File to edit |
|-------------------------|--------------|
| Parade announcements | `src/data/announcements.json` |
| Leadership names & bios | `src/data/leadership.json` |
| Gallery photos & categories | `src/data/gallery.json` |
| Library resources (PDFs, links) | `src/data/resources.json` |
| Knot instructions | `src/data/knots.json` |
| Colours (navy blue, gold) | `src/app/globals.css` |
| Replace placeholder images | `public/images/gallery/` and `public/images/knots/` |

**Example — change an announcement:**

Open `src/data/announcements.json` and edit the `"message"` text. Save the file. Refresh your browser — the change appears automatically.

---

## Common problems

### Windows: `npm.ps1 cannot be loaded because running scripts is disabled`

This happens in **PowerShell** on Windows. Node.js is installed correctly — PowerShell is just blocking the `npm` command.

**Fix 1 — Use Command Prompt instead (easiest):**

1. Press the Windows key, type `cmd`, and open **Command Prompt** (not PowerShell)
2. Go to your project folder:
   ```bash
   cd Documents\navy-cadet-website
   ```
   (Change the path to wherever you saved the folder.)
3. Run:
   ```bash
   npm install
   npm run dev
   ```

**Fix 2 — Allow scripts for your user only (PowerShell):**

1. Open **PowerShell** (not as admin needed)
2. Run this once:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Type `Y` and press Enter when asked
4. Close and reopen the terminal, then try `npm install` again

**Fix 3 — Use npm.cmd in PowerShell (no policy change):**

```powershell
npm.cmd install
npm.cmd run dev
```

### "npm is not recognized"
→ Node.js is not installed. Install from https://nodejs.org and restart your computer.

### "Port 3000 is already in use"
→ Another app is using that port. Close other dev servers, or run:
```bash
npm run dev -- -p 3001
```
Then open http://localhost:3001

### Page shows an error after editing a JSON file
→ Check for missing commas or quote marks. JSON must be valid — use a JSON validator online if unsure.

### Changes don't appear
→ Make sure `npm run dev` is still running in the terminal. Hard-refresh the browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac).

---

## Project folder map (simple view)

```
navy-cadet-website/
├── src/
│   ├── app/           ← Pages (home, gallery, library, knots, join)
│   ├── components/    ← Reusable UI pieces
│   └── data/          ← YOUR CONTENT (edit these!)
├── public/
│   └── images/        ← Photos and diagrams
├── package.json       ← Project settings (don't delete)
└── README.md          ← Technical overview
```

---

## Next steps once you're comfortable

1. Replace placeholder SVG images with real unit photos in `public/images/`
2. Update all JSON data files with your unit's real information
3. Deploy online for free using [Vercel](https://vercel.com) (connect your GitHub repo)

Need help with a specific step? Note which step number you're stuck on and what error message you see.
