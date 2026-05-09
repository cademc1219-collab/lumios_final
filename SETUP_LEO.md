# How to activate Leo AI

Leo's AI features are ready to go — you just need to add your Anthropic API key.

## Steps (takes 5 minutes)

1. Go to **console.anthropic.com** and sign up
2. Add $5 of credit (goes a very long way)
3. Click **API Keys** → **Create API key** → copy it

4. Open **create.html** in a text editor
5. Find this line near the top of the `<script>` section:
   ```
   const ANTHROPIC_KEY = 'YOUR_API_KEY_HERE';
   ```
6. Replace `YOUR_API_KEY_HERE` with your actual key, like:
   ```
   const ANTHROPIC_KEY = 'sk-ant-api03-xxxxx...';
   ```
7. Save the file

8. Do the same thing in **study.html** — same line, same key

9. Upload both files to GitHub — Leo is live!

## What Leo can do once activated
- Generate full flashcard sets from any topic description
- Rate your set quality and give honest feedback
- Rewrite and fix your set to 5 stars
- Chat with you during study sessions (10 messages per session)

## Cost estimate
- Set generation: ~$0.004 per set
- Quality rating: ~$0.002 per rating
- Study chat: ~$0.001 per message
- $5 will last months of normal use
