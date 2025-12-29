import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  controllers: [UploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class UploadModule {}
