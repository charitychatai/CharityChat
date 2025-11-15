# Testimonial Photos

This folder contains profile photos for testimonials on the website.

## Current Files Needed:

1. **sandy-irani.jpg** - Professor Sandy Irani, UC Irvine

## How to Add Photos:

1. Save the photo with the exact filename shown above
2. Recommended format: JPG or PNG
3. Recommended size: At least 96x96 pixels (will be displayed at 48x48px)
4. The image will be displayed in a circular crop
5. Make sure the face is centered in the original image for best results

## Image Specifications:

- **Display size**: 48x48 pixels
- **Shape**: Circular (border-radius: 50%)
- **Format**: JPG, PNG, or WebP
- **Recommended resolution**: 96x96px or larger (2x for retina displays)

## Adding More Testimonial Photos:

To add photos for other testimonials:

1. Save the image with a descriptive filename (e.g., `james-whitfield.jpg`)
2. Update the HTML in `index.html` to use an image tag:

```html
<div class="testimonial-avatar">
  <img src="testimonials/filename.jpg" alt="Person Name">
</div>
```

Instead of text initials:

```html
<div class="testimonial-avatar">XY</div>
```

The CSS is already configured to display images properly in circular avatars!

