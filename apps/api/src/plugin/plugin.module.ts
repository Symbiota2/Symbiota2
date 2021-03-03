import { Module } from '@nestjs/common';
import pluginConfig from './plugin.config';

// TODO: More user-friendly configuration

@Module({
    imports: [
        ...pluginConfig
    ],
    exports: [
        ...pluginConfig
    ]
})
export class PluginModule {}
