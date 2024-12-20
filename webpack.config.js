module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ]
    },
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@less': path.resolve(__dirname, 'src/less'),
            '@protobuf': path.resolve(__dirname, 'src/protobuf'),
            '$buildinfo': buildInfoPath
        }
    }
}