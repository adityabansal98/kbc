# Vercel Web Analytics Setup

This project has Vercel Web Analytics integrated to track user interactions and pageviews.

## What is Vercel Web Analytics?

Vercel Web Analytics is a lightweight analytics solution that helps you understand how users interact with your application. It provides insights into page views, user sessions, and custom events.

## Current Setup

### Package Installation

The `@vercel/analytics` package is already installed in this project:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.6.1"
  }
}
```

To install or update the package manually, run:

```bash
npm install @vercel/analytics
```

### Component Integration

The `Analytics` component is integrated into the React application in `src/main.jsx`:

```jsx
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
```

This placement ensures that the Analytics tracking is active throughout the entire application lifecycle.

## Features Enabled

With this setup, the following data is automatically tracked:

- **Pageviews**: Each route change is recorded
- **Route Tracking**: User navigation patterns
- **Performance Metrics**: Core Web Vitals data
- **Session Tracking**: User session information
- **Referrer Information**: Where users came from

## Viewing Analytics Data

Once your application is deployed to Vercel:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab
4. View your data and insights

**Note**: Analytics data may take a few minutes to populate after your first deployment.

## Enabling in Vercel Dashboard

To enable Web Analytics in Vercel (if not already enabled):

1. Go to your project settings in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the **Analytics** tab
3. Click **Enable**

After enabling, the next deployment will include analytics tracking routes at `/_vercel/insights/*`.

## Custom Events

To track custom events (e.g., button clicks, form submissions), import the `track` function:

```jsx
import { track } from '@vercel/analytics/react'

// In your event handler:
track('button_click', {
  label: 'Subscribe',
  value: 'newsletter'
})
```

For more information, refer to the [Analytics Package Documentation](https://vercel.com/docs/analytics/package).

## Deployment Requirements

- Your project must be deployed to **Vercel** for analytics to work
- Analytics automatically collect data after deployment
- The tracking endpoints are scoped at `/_vercel/insights/*`

## Testing Analytics Locally

When running the development server (`npm run dev`), analytics tracking is still initialized but data is not sent to Vercel. To verify the setup:

1. Open your browser's Network tab (DevTools)
2. Look for requests to `/_vercel/insights/` endpoints
3. These will only appear in production after deployment

## Privacy & Compliance

Vercel Web Analytics is designed with privacy in mind:

- No cookies are set
- No personal data is collected by default
- GDPR, CCPA, and other privacy regulations compliant
- For more details, see [Analytics Privacy Policy](https://vercel.com/docs/analytics/privacy-policy)

## Troubleshooting

### Analytics Not Showing Data
- Ensure the project is deployed to Vercel
- Check that analytics is enabled in your Vercel project settings
- Wait a few minutes for data to populate
- Verify requests to `/_vercel/insights/` in Network tab

### Build Errors
- Ensure `@vercel/analytics` is installed: `npm install @vercel/analytics`
- Check that the import is correct: `from '@vercel/analytics/react'`
- Restart the development server after installing

## Additional Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Analytics Package Reference](https://vercel.com/docs/analytics/package)
- [Custom Events Guide](https://vercel.com/docs/analytics/custom-events)
- [Privacy & Compliance](https://vercel.com/docs/analytics/privacy-policy)
