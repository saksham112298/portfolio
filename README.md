# Saksham Sharma – Portfolio

Motion designer · Video editor · VFX artist
WhatsApp: +91 90841 65033 · Instagram: @saksham__sharma021

## How to add a new video
1. Make sure the video is under 25 MB (GitHub's limit for uploading in the browser).
2. Upload it to the repo (all files sit together, no folders).
3. (Optional) Upload a thumbnail image too, e.g. `my-new-project-poster.jpg`.
4. Open `works.js` and add a new block, for example:

```js
{
  title: "My New Project",
  description: "One short line about it.",
  category: "Motion Graphics",
  src: "my-new-project.mp4",
  poster: "my-new-project-poster.jpg",
  ratio: "16:9"
},
```

Categories: SaaS Animation, Motion Graphics, 2D Animation, 3D Animation, Documentary Style.
Ratio: "16:9" horizontal, "9:16" vertical, "1:1" square.

To change the showreel, replace `showreel.mp4` (same name) or edit `window.SHOWREEL` in `works.js`.
