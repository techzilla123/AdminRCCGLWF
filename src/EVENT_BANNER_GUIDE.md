# Event Banner Feature Guide

## Overview

The Events management system now includes a banner image field that allows you to upload and display eye-catching visuals for each church event.

## Features

### 1. Banner Upload
- Drag and drop or click to upload images
- Supports common image formats (JPEG, PNG, GIF, WebP)
- Maximum file size: 5MB
- Images are securely stored in Supabase Storage

### 2. Banner Display
The banner is displayed in multiple places:

#### Upcoming Events Section
- Shows a compact 128px height banner
- Displays the 3 next upcoming events
- Located on the main Events page

#### All Events List
- Shows a larger 192px height banner
- Displays all events with full details
- Includes event type badges and action buttons

### 3. Responsive Design
- Banners are fully responsive
- Optimized for different screen sizes
- Uses object-fit: cover to maintain aspect ratio

## How to Add Event Banner

### When Creating a New Event:

1. Click "Add Event" button
2. At the top of the form, you'll see "Event Banner Image"
3. Upload your banner image using one of these methods:
   - **Drag & Drop**: Drag an image file onto the upload area
   - **Click to Browse**: Click the upload area to select a file
   - **Paste**: Copy an image and paste it into the upload area

4. After uploading, you'll see a preview of your banner
5. Fill in the other event details (title, date, time, etc.)
6. Click "Add Event" to save

### When Editing an Event:

1. Click the Edit button (pencil icon) on any event
2. The current banner will be displayed (if one exists)
3. To change the banner:
   - Click the "×" button to remove the current image
   - Upload a new image following the steps above
4. Click "Update Event" to save changes

## Best Practices for Event Banners

### Image Dimensions
- **Recommended**: 1200 x 630 pixels (landscape)
- **Aspect Ratio**: 1.91:1 (Facebook/social media standard)
- **Minimum Width**: 800 pixels

### Image Quality
- Use high-quality images (at least 72 DPI)
- Avoid pixelated or blurry images
- Keep file size under 2MB for optimal loading

### Design Tips
1. **Keep it Simple**: Don't overcrowd with text
2. **Use Readable Fonts**: If adding text, ensure it's legible
3. **Brand Consistency**: Use church colors and branding
4. **High Contrast**: Ensure text stands out from background
5. **Mobile-Friendly**: Test how it looks on small screens

### Content Suggestions
- Event date and time
- Event title/theme
- Relevant imagery (worship, youth, outreach, etc.)
- Church logo
- Key speakers or special guests
- Location if it's a special venue

## Example Banner Ideas by Event Type

### Service Events
- Worship team leading praise
- Congregation gathering
- Bible and cross imagery
- Inspirational quotes

### Youth Ministry
- Young people in action
- Fun and energetic design
- Bright, vibrant colors
- Modern typography

### Outreach Events
- Community service images
- Helping hands
- Diverse groups of people
- Welcoming atmosphere

### Study Events
- Books and study materials
- Quiet, focused imagery
- Warm, inviting colors
- Educational themes

### Social Events
- Fellowship and community
- Food and celebration
- Joyful gatherings
- Church family together

## Technical Details

### Storage
- Banners are stored in Supabase Storage
- Bucket name: `make-c28f50fa-photos`
- Secure access with authentication

### File Validation
The system validates:
- File size (max 5MB)
- File type (images only)
- Prevents unauthorized uploads

### Performance
- Images are optimized on display
- Uses CSS object-fit for proper scaling
- Lazy loading for better performance

## Free Image Resources

### Stock Photo Websites
- **Unsplash**: https://unsplash.com (free, high-quality)
- **Pexels**: https://pexels.com (free, no attribution)
- **Pixabay**: https://pixabay.com (free, wide selection)

### Design Tools
- **Canva**: https://canva.com (free templates)
- **Adobe Express**: https://express.adobe.com (quick designs)
- **Figma**: https://figma.com (professional design)

### Banner Templates
Search for "church event banner template" on:
- Canva
- Creative Market
- Etsy (paid templates)
- Template.net

## Troubleshooting

### Image Not Uploading
- Check file size (must be under 5MB)
- Ensure it's a valid image format
- Try a different browser
- Check internet connection

### Banner Not Displaying
- Refresh the page
- Check if the image URL is valid
- Ensure the event was saved properly
- Try re-uploading the image

### Image Looks Stretched
- Use recommended dimensions (1200 x 630)
- Maintain 1.91:1 aspect ratio
- Avoid very tall or very wide images

### Poor Quality on Display
- Use higher resolution source image
- Ensure image is at least 800px wide
- Save in high quality format
- Avoid excessive compression

## Tips for Success

1. **Plan Ahead**: Create banners before the event
2. **Be Consistent**: Use similar styles for related events
3. **Test on Mobile**: View on phone before publishing
4. **Get Feedback**: Ask team members for input
5. **Keep Updated**: Change banners if event details change
6. **Archive Old Events**: Remove outdated event banners

## Need Help?

If you need assistance:
1. Contact your IT team or web administrator
2. Refer to the main Church Admin system documentation
3. Check Supabase documentation for storage issues
4. Consult with your design team for banner creation

Remember: A great banner can increase event attendance by making your announcements more eye-catching and professional!
