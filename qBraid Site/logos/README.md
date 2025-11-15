# Company Logos for Scrolling Marquee

This folder contains white/transparent logos for the companies featured in the scrolling marquee on the homepage.

## Logo Files Needed

Place the following logo files in this directory:

1. **ibm-logo.png** - IBM
2. **ionq-logo.png** - IonQ
3. **rigetti-logo.png** - Rigetti Computing
4. **oxford-logo.png** - Oxford Quantum Circuits (OQC)
5. **mit-logo.png** - MIT (Massachusetts Institute of Technology)
6. **xanadu-logo.png** - Xanadu Quantum Technologies
7. **q-ctrl-logo.png** - Q-CTRL
8. **iqm-logo.png** - IQM Quantum Computers
9. **equal1-logo.png** - equal1 Quantum Computing

## Where to Get the Logos

### Option 1: Company Brand/Media Kits (Recommended)

Visit each company's official website and look for their media kit, press kit, or brand resources:

- **IBM**: https://www.ibm.com/brand/experience-guides/
- **IonQ**: https://ionq.com/news - Contact their press team or check their newsroom
- **Rigetti**: https://www.rigetti.com/ - Look for "Press" or "Media" section
- **Oxford Quantum Circuits**: https://oxfordquantumcircuits.com/ - Contact for brand assets
- **MIT**: https://mitsloan.mit.edu/brand/logo-guidelines
- **Xanadu**: https://www.xanadu.ai/ - Look for brand/press resources
- **Q-CTRL**: https://q-ctrl.com/ - Check their media/press section
- **IQM**: https://www.meetiqm.com/newsroom/

### Option 2: Request Directly

If logos aren't publicly available, email the company's marketing/PR department requesting their logo for partnership/integration showcase purposes.

### Option 3: Use Logo Databases

Some high-quality logo sources:
- **Brandfetch**: https://brandfetch.com/
- **Clearbit**: https://clearbit.com/logo
- **VectorLogoZone**: https://www.vectorlogo.zone/

## Logo Specifications

- **Format**: PNG with transparent background (preferred) or SVG
- **Color**: Any color is fine - the CSS automatically converts logos to white using filters
- **Size**: Minimum width of 300px recommended for quality
- **Aspect Ratio**: Maintain the original logo aspect ratio

## CSS Filter Magic

The CSS automatically converts any colored logo to white using:
```css
filter: brightness(0) invert(1);
```

This means you can use the original colored logos, and they'll appear white in the marquee!

## Tips

1. **High Resolution**: Use high-resolution logos (at least 300px wide) for crisp display
2. **Transparent Background**: Logos with transparent backgrounds work best
3. **Horizontal Logos**: Wide/horizontal logo versions work better than square/stacked versions
4. **SVG Format**: If available, SVG logos scale perfectly at any size

## Need Help?

If you have trouble finding specific logos, consider:
- Searching "[Company Name] logo svg png download"
- Checking their LinkedIn company page
- Looking at their press releases for logo usage
- Contacting their partnerships team directly

