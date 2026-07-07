# Security

## API Key Handling

- Store provider API keys in environment variables.
- Never commit `.env` files containing real keys.
- The SDK never logs API keys or secrets.
- Errors do not expose credentials.

## Environment Variables

Examples and the CLI read keys from environment variables only:

```bash
OPENAI_API_KEY=sk-...
NUROVIA_API_KEY=...
```

Each example includes a `.env.example` file listing required variables.

## Request Sanitization

Validate user inputs before passing them to providers. Do not forward untrusted
data directly to AI providers without inspection.

## Logging Restrictions

The default logger is `console`. Future versions will introduce structured
logging with automatic secret redaction. Until then, avoid logging full request
or response bodies in production.
