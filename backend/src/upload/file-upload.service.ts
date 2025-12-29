import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FileUploadService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { data, error } = await this.supabase.storage
        .from('product-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = this.supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return {
        url: publicUrlData.publicUrl,
        filename: fileName,
      };
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}
