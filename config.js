/**
 * AMA Automations — Site configuration
 *
 * Set WEBHOOK_URL to your n8n webhook endpoint.
 * The consultation form POSTs the visitor's answers to this URL as JSON.
 *
 * Never put a Telegram bot token or any other secret in this file —
 * this file ships to every visitor's browser. Keep secrets inside
 * your n8n workflow, on the server side, where the webhook forwards to.
 */
const WEBHOOK_URL = "YOUR_N8N_WEBHOOK";
