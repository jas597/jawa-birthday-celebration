# Premium Interactive Birthday Website

An elegant React + Vite birthday website designed for Jawa. It includes a welcome flow, birthday message, animated cake, five one-time team dedication boxes, in-page MP3 and MP4 players, soft background music controls, confetti, and a final celebration screen.

## 1. Install

```bash
npm install
```

## 2. Run Locally

```bash
npm run dev
```

Open the local URL shown in the terminal.

## 3. Add the Five MP3 Dedications

Put the final MP3 files in:

```text
public/songs/
```

Use these exact file names unless you also update the config:

```text
maria.mp3
sasi.mp3
jas.mp3
kim.mp3
kanna.mp3
```

The site plays these directly inside the dedication boxes. It does not use YouTube links.

## 4. Add Sasi's Birthday Video

Put Sasi's MP4 in:

```text
public/videos/sasi-birthday.mp4
```

Sasi's box includes both a song tab and a video tab. The video stays responsive on mobile.

## 4a. Add the Final Surprise Video

Put the final surprise MP4 in:

```text
public/videos/final-surprise.mp4
```

Its title and path can be edited in `src/data/birthdayConfig.js`.

## 5. Edit Names and Dedication Messages

Edit:

```text
src/data/birthdayConfig.js
```

Change the boss name:

```js
recipientName: "Jawa"
```

You can also update `senderName`, the main message, final team message, and each person's dedication title, message, audio path, or video path in the same file.

## 5a. Replace Jawa's Photo

Replace the portrait image here:

```text
public/images/jawa.png
```

The configurable path is in `src/data/birthdayConfig.js`:

```js
profileImage: "/images/jawa.png"
```

Use a clear portrait photo. The website crops it into a premium circular frame automatically.

## 6. Replace Background Music

Add your music file to:

```text
public/audio/
```

Then update this line in `src/data/birthdayConfig.js`:

```js
backgroundMusicPath: "/audio/background-music.wav"
```

Audio does not autoplay on page load. It can begin only after the visitor clicks **Start the Celebration**. The top-right music button lets the visitor mute or unmute.

## 7. Deploy to Vercel

1. Push this project to GitHub.
2. Open Vercel and choose **Add New Project**.
3. Import the GitHub repository.
4. Keep the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click **Deploy**.

## 8. Generate a QR Code for the Final Website Link

After Vercel gives you a live URL:

1. Copy the deployed URL.
2. Use any trusted QR code generator.
3. Paste the URL and download the QR image.
4. Print it or share it digitally.

## Main Editing File

Most content lives in:

```text
src/data/birthdayConfig.js
```

That is where you edit the boss name, portrait image path, team names, dedication messages, MP3 paths, Sasi's video path, and audio paths.
