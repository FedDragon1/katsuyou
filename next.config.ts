import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
        ],
    },
    webpack: (config, context) => {
        config.module.rules.push({
            test: /\.glsl/,
            use: [
                context.defaultLoaders.babel,
                {
                    loader: "raw-loader"
                }
            ]
        })
        return config;
    },
    experimental: {
        turbo: {
            rules: {
                "*.glsl": {
                    loaders: ['raw-loader'],
                    as: "*.js"
                }
            }
        }
    }
};

export default withNextIntl(nextConfig);
