
export const PORTABASE_DEFAULT_SETTINGS = {
    SECURITY: {
        CSP: {
            DEFAULT_SRC: ["'self'"],
            SCRIPT_SRC: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://www.googletagmanager.com"],
            STYLE_SRC: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            IMG_SRC: ["'self'", "blob:", "data:", "https:"],
            FONT_SRC: ["'self'"],
            OBJECT_SRC: ["'none'"],
            BASE_URI: ["'self'"],
            FORM_ACTION: ["'self'"],
            FRAME_ANCESTORS: ["'none'"],
            BLOCK_ALL_MIXED_CONTENT: false,
            UPGRADE_INSECURE_REQUESTS: true,
        },
        PERMISSIONS_POLICY: {
            CAMERA: ["()"],
            MICROPHONE: ["()"],
            GEOLOCATION: ["()"],
            FULLSCREEN: ["(self)"],
            // ...other features
        },
    },
};