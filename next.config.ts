import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        const webpack = require('webpack');

        // thread-stream의 테스트 파일들을 빈 모듈로 대체
        config.plugins = config.plugins || [];

        // test 디렉토리 내의 모든 파일 제외 (더 강력한 정규식)
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
                /thread-stream[\/\\]test[\/\\].*/,
                path.resolve(__dirname, 'empty-module.js')
            )
        );

        // bench.js 파일 제외
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
                /thread-stream[\/\\]bench\.js$/,
                path.resolve(__dirname, 'empty-module.js')
            )
        );

        // IgnorePlugin으로도 추가 보호
        config.plugins.push(
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/test\//,
                contextRegExp: /thread-stream/,
            }),
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/bench\.js$/,
                contextRegExp: /thread-stream/,
            })
        );

        // resolve.alias로도 추가 보호
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
        };

        // 테스트 파일들을 빈 모듈로 alias
        const emptyModulePath = path.resolve(
            __dirname,
            'empty-module.js'
        );

        // thread-stream의 test 디렉토리 전체를 빈 모듈로
        config.resolve.alias['thread-stream/test'] =
            emptyModulePath;
        config.resolve.alias['thread-stream/bench'] =
            emptyModulePath;

        return config;
    },
    // thread-stream을 서버 사이드에서만 사용
    serverExternalPackages: ['thread-stream'],
    // 빈 turbopack 설정으로 webpack 사용 명시
    turbopack: {},
};

export default nextConfig;
