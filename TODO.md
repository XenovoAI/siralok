# Mobile UX Improvements for SIRCBSE Study Materials Page

## TODO List

### 1. Filters (Mobile)
- [x] Convert class filters to horizontal scrolling pill design
- [x] Convert subject filters to horizontal scrolling pill design
- [x] Ensure 50px height minimum for tap targets
- [x] Add active state highlighting with gradient
- [x] Make filters sticky at top on mobile

### 2. Search
- [x] Make search full width with 16px padding
- [x] Set 48px minimum height
- [x] Add clear icon functionality

### 3. Material Cards
- [ ] Make cards full width on mobile (1 column)
- [ ] Replace img with next/image for optimization (lazy loading, WebP, max 200px height)
- [ ] Add skeleton loader while loading
- [ ] Make title bold and clear
- [ ] Make FREE badge green and prominent
- [ ] Ensure download count is visible
- [ ] Make download button FULL WIDTH, blue, and prominent

### 4. Layout
- [x] Set mobile: 1 column
- [x] Set tablet: 2 columns
- [x] Set desktop: 3 columns
- [x] Apply 16px padding, 12px gap

### 5. Sticky Download
- [x] Add bottom sticky bar when viewing material details
- [x] Make download button large and blue
- [x] Show material name in sticky bar

### 6. Features
- [ ] Add stats bar (1000+ Materials, 50K+ Students)
- [ ] Add featured materials section
- [ ] Add most downloaded this week section
- [x] Add share button on each card

### 7. Performance
- [x] Implement next/image with lazy loading
- [x] Add skeleton loaders for cards
- [ ] Ensure WebP image optimization

### 8. Responsive Testing
- [ ] Test at 375px, 414px, 768px breakpoints
- [ ] Ensure portrait & landscape support
- [ ] Verify no horizontal scroll (except filters)
- [ ] Confirm viewport meta tag is present (already in layout.js)
