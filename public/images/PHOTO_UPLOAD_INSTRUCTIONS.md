# Player Photo Upload Instructions

## Required Photos

You need to add 2 player photos to this directory:

1. **`neil.jpg`** - Photo of Neil Hyland
2. **`oisin.jpg`** - Photo of Oisín O'Carroll

## Photo Specifications

- **Format**: JPG or JPEG
- **Recommended size**: 800x800 pixels (square aspect ratio)
- **Max file size**: Under 1MB for optimal loading
- **Quality**: High-resolution headshot or action shot

## How to Upload

### Option 1: Via Git/GitHub Desktop
1. Place your photos in this folder (`public/images/`)
2. Rename them to exactly `neil.jpg` and `oisin.jpg`
3. Commit and push to GitHub
4. Vercel will automatically redeploy

### Option 2: Via Terminal
```bash
# From your project root
cp /path/to/neil-photo.jpg public/images/neil.jpg
cp /path/to/oisin-photo.jpg public/images/oisin.jpg

git add public/images/neil.jpg public/images/oisin.jpg
git commit -m "Add player photos"
git push
```

### Option 3: Directly in VSCode/Cursor
1. Open the `public/images` folder in your file explorer
2. Drag and drop the photos into this folder
3. Rename them to `neil.jpg` and `oisin.jpg`
4. Commit and push via the Source Control panel

## Temporary Placeholder

Until you upload the real photos, the app will show a placeholder gradient background where the photos should be.

## Tips for Best Results

- Use a professional-looking photo (headshot or golf action shot)
- Ensure good lighting and clear visibility of the player
- Square crop works best (1:1 aspect ratio)
- Avoid heavily compressed or pixelated images
- Consider using a consistent style/background for both photos

---

**Current Status**: Photos NOT uploaded yet. Please add `neil.jpg` and `oisin.jpg` to this directory.

