# Media Assets Guide

## 📁 Folder Structure

```
docs/
├── screenshots/          # PNG/JPG images
│   ├── login.png
│   ├── registration.png
│   ├── home.png
│   ├── dark-mode.png
│   ├── password-reset.png
│   ├── biometric.png
│   └── video-thumbnail.png
└── videos/              # MP4/MOV files
    └── demo.mp4
```

## 📸 Screenshot Naming Convention

Use descriptive names in lowercase with hyphens:
- `login.png` - Login screen
- `registration.png` - Registration form
- `home.png` - Home/Profile screen
- `dark-mode.png` - Dark theme example
- `password-reset.png` - Password reset screen
- `biometric.png` - Biometric authentication prompt
- `account-locked.png` - Account lockout screen
- `video-thumbnail.png` - Thumbnail for video link

## 🎥 Video Guidelines

- **Format**: MP4 (H.264 codec for best compatibility)
- **Max Size**: Keep under 10MB for GitHub
- **Resolution**: 1080x1920 (portrait) or 1920x1080 (landscape)
- **Duration**: 30-60 seconds showing key features
- **Alternative**: Upload to YouTube/Vimeo and link in README

## 📤 How to Add Your Media

1. **Place files in folders**:
   ```bash
   # Screenshots
   cp ~/path/to/your/screenshots/* docs/screenshots/
   
   # Video
   cp ~/path/to/your/video.mp4 docs/videos/demo.mp4
   ```

2. **Optimize images** (optional but recommended):
   ```bash
   # Install ImageMagick (if needed)
   brew install imagemagick
   
   # Resize and compress
   mogrify -resize 1080x1920 -quality 85 docs/screenshots/*.png
   ```

3. **Commit to Git**:
   ```bash
   git add docs/
   git commit -m "docs: add screenshots and demo video"
   git push
   ```

## 💡 Tips

- Use consistent device frames (iOS or Android)
- Capture both light and dark themes
- Show key features: login, registration, biometrics, lockout
- Compress images to reduce repo size
- For large videos, consider YouTube/Loom instead of Git

