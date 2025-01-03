
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    typescript: {
        //TODO fix all type errors and remove 'ignoreBuildErrors'
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // bundlePagesRouterDependencies: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

};

export default nextConfig;



