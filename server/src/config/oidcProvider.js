const User = require('../models/User');
const MongoAdapter = require('./oidcAdapter');
const { getOrGenerateJWKS } = require('./oidcKeystore');

let providerInstance = null;

async function initOidcProvider(customIssuer = null) {
  if (providerInstance && !customIssuer) return providerInstance;

  const { default: Provider } = await import('oidc-provider');

  const ISSUER = customIssuer || process.env.ROKIT_ISSUER_URL || 
    (process.env.NODE_ENV === 'production' ? 'https://rokitonline.com' : 'http://localhost:5000');

  const defaultRedirects = [
    'https://yanga.rokitonline.com/api/auth/callback/rokit',
    'http://localhost:3000/api/auth/callback/rokit'
  ];

  const envRedirects = process.env.YANGA_REDIRECT_URIS 
    ? process.env.YANGA_REDIRECT_URIS.split(',').map(s => s.trim()) 
    : defaultRedirects;

  const jwks = getOrGenerateJWKS();

  const configuration = {
    adapter: MongoAdapter,
    jwks,
    routes: {
      authorization: '/oauth/authorize',
      token: '/oauth/token',
      userinfo: '/oauth/userinfo',
      jwks: '/.well-known/jwks.json',
      end_session: '/oauth/session/end'
    },
    pkce: {
      required: () => true, // Enforce PKCE only
      methods: ['S256']
    },
    clients: [
      {
        client_id: process.env.YANGA_CLIENT_ID || 'yanga_studio',
        client_secret: process.env.YANGA_CLIENT_SECRET || 'yanga_secret_production_key_2026',
        redirect_uris: envRedirects,
        response_types: ['code'],
        grant_types: ['authorization_code'],
        token_endpoint_auth_method: 'client_secret_post',
        scope: 'openid email profile'
      }
    ],
    scopes: ['openid', 'email', 'profile'],
    claims: {
      openid: ['sub'],
      email: ['email', 'email_verified'],
      profile: ['name', 'picture', 'locale', 'status']
    },
    conformIdTokenClaims: false,
    ttl: {
      AuthorizationCode: 60, // 60s short-lived authorization code
      AccessToken: 10 * 60, // 10 minutes
      IdToken: 10 * 60, // 10 minutes
      Interaction: 15 * 60, // 15 minutes
      Session: 14 * 24 * 60 * 60 // 14 days
    },
    features: {
      devInteractions: { enabled: false },
      rpInitiatedLogout: { enabled: true }
    },
    interactions: {
      url(ctx, interaction) {
        return `/interaction/${interaction.uid}`;
      }
    },
    async findAccount(ctx, id) {
      const user = await User.findById(id);
      if (!user) return undefined;
      return {
        accountId: id,
        async claims(use, scope) {
          return {
            sub: user._id.toString(),
            email: user.email,
            email_verified: true,
            name: user.name,
            picture: user.avatarUrl || null,
            locale: 'en',
            status: user.status || 'active'
          };
        }
      };
    }
  };

  providerInstance = new Provider(ISSUER, configuration);
  return providerInstance;
}

module.exports = { initOidcProvider };
