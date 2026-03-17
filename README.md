This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Element Testing System

This project includes a comprehensive testing tracker for all 37 mechanic elements:

**Quick Status Check:**
```powershell
.\test-status.ps1           # View testing progress
.\test-status.ps1 -Detailed # Detailed test results
```

**Documentation:**
- **ELEMENT_TESTING_TRACKER.md** - Manual testing checklist
- **element-testing-tracker.json** - Structured test data
- **TESTING_GUIDE.md** - Test procedures for each element
- **TESTING_SYSTEM.md** - Complete testing documentation

**Element Categories:**
- Content (6): Title, Text, List, Quote, CodeBlock, Headline
- Layout (9): Container, Columns, Spacer, ScrollContainer, Accordion, Tabs, GridLayout, Modal, SplitScreen
- Media (8): Image, VideoPlayer, ImageGallery, ImageComparison, IconLibrary, LogoGrid, AvatarCard, Carousel
- Decoration (2): Shape, Divider
- Interactive (6): Button, FlipCard, Badge, Tooltip, CTACard, Alert
- Data (6): Table, StatsCounter, ProgressBar, Testimonial, FeatureGrid, PricingCard

**Total: 37/37 elements implemented, 10 external editors**

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
