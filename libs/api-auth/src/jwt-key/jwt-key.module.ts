import { Module } from '@nestjs/common';
import { StorageModule } from '@symbiota2/api-storage';
import { JwtKeyService } from './jwt-key.service';

@Module({
    imports: [StorageModule],
    providers: [JwtKeyService],
    exports: [JwtKeyService]
})
export class JwtKeyModule {}
