# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in the Kiyota AI SDK, please report it
by emailing security@kiyota.dev. Do not open a public issue.

We will acknowledge receipt within 48 hours and provide a detailed response
within 7 days, including a timeline for a fix.

## Security Best Practices

- Never commit API keys or secrets to the repository.
- Use environment variables for provider credentials.
- The SDK and CLI never log API keys or full request bodies containing secrets.
- Validate inputs before passing them to providers.
