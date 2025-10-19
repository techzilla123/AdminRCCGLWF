# Email Integration Guide

## Overview

The Church Management System now includes email functionality for sending announcements directly to members' email addresses. This guide explains how to integrate with a real email service provider.

## Current Implementation

Currently, the system **simulates** email sending by logging to the console. To enable actual email delivery, you need to integrate with an email service provider.

## Recommended Email Service: Resend

We recommend [Resend](https://resend.com) for its modern API, excellent deliverability, and ease of use.

### Setup Steps

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create an account
   - Verify your domain (for production emails)

2. **Get your API Key**
   - Go to your Resend dashboard
   - Navigate to API Keys section
   - Create a new API key
   - Copy the API key (it starts with `re_`)

3. **Add API Key to Supabase**
   - Go to your Supabase project dashboard
   - Navigate to Project Settings > Edge Functions
   - Add a secret named `RESEND_API_KEY` with your API key value

4. **Update the Backend Code**

   Open `/supabase/functions/make-server-c28f50fa/index.tsx` and modify the email sending endpoint:

   ```typescript
   // At the top of the file, add the import
   import { Resend } from 'npm:resend';

   // Initialize Resend
   const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

   // In the /communications/send-email endpoint, replace the simulation code with:
   const emailPromises = recipients.map(async (email: string) => {
     try {
       await resend.emails.send({
         from: 'Church Admin <noreply@yourdomain.com>', // Use your verified domain
         to: email,
         subject: `[${type}] ${title}`,
         html: `
           <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
             <h1 style="color: #333;">${title}</h1>
             <p style="color: #666; line-height: 1.6;">${content}</p>
             <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
             <p style="color: #999; font-size: 12px;">
               This announcement was sent from RCCG Living Word Forney Church Admin
             </p>
           </div>
         `
       });
       return { email, status: 'sent' };
     } catch (error) {
       console.error(`Failed to send to ${email}:`, error);
       return { email, status: 'failed', error };
     }
   });
   ```

5. **Test the Integration**
   - Create a new announcement
   - Select members to receive the email
   - Click "Send Announcement"
   - Check if emails are delivered

## Alternative Email Services

### SendGrid

```typescript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'));

await sgMail.send({
  to: email,
  from: 'noreply@yourchurch.com',
  subject: `[${type}] ${title}`,
  html: content
});
```

### Mailgun

```typescript
// Install: npm install mailgun.js
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: Deno.env.get('MAILGUN_API_KEY')
});

await mg.messages.create('yourdomain.com', {
  from: 'Church Admin <noreply@yourdomain.com>',
  to: [email],
  subject: `[${type}] ${title}`,
  html: content
});
```

## Email Template Customization

You can customize the email template in the backend code. Consider adding:

- Church logo
- Better styling
- Footer with contact information
- Unsubscribe link
- Social media links

Example enhanced template:

```html
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
  <div style="background-color: #030213; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">RCCG Living Word Forney</h1>
  </div>
  
  <div style="background-color: white; padding: 30px; margin: 20px;">
    <div style="background-color: #e9ebef; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
      <strong style="color: #030213;">${type}</strong>
    </div>
    
    <h2 style="color: #030213; margin-bottom: 20px;">${title}</h2>
    
    <div style="color: #666; line-height: 1.8; font-size: 16px;">
      ${content}
    </div>
  </div>
  
  <div style="background-color: #f3f3f5; padding: 20px; text-align: center;">
    <p style="color: #717182; font-size: 14px; margin: 0;">
      This announcement was sent from RCCG Living Word Forney Church Admin
    </p>
    <p style="color: #717182; font-size: 12px; margin-top: 10px;">
      © 2025 RCCG Living Word Forney. All rights reserved.
    </p>
  </div>
</div>
```

## Testing

Before sending to all members:

1. Test with your own email first
2. Check spam folder
3. Verify links and formatting
4. Test on different email clients (Gmail, Outlook, Apple Mail)

## Best Practices

1. **Always use a verified domain** - Don't send from generic email providers
2. **Include unsubscribe option** - Required by law in many countries
3. **Keep emails brief** - People scan emails quickly
4. **Test deliverability** - Monitor bounce rates and spam complaints
5. **Respect frequency** - Don't overwhelm members with too many emails
6. **Personalize when possible** - Use member names in greetings

## Troubleshooting

### Emails not delivered
- Check spam folder
- Verify API key is correct
- Ensure domain is verified
- Check email service logs

### Bounced emails
- Update member email addresses
- Remove invalid emails from list

### Marked as spam
- Add unsubscribe link
- Use a verified domain
- Avoid spam trigger words
- Keep sending frequency reasonable

## Support

For issues with:
- **Resend**: https://resend.com/docs
- **SendGrid**: https://docs.sendgrid.com
- **Mailgun**: https://documentation.mailgun.com
