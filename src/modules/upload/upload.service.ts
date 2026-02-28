import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UploadService {
    private readonly s3client: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.s3client = new S3Client({
            region: this.configService.getOrThrow('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    async uploadFile(fileName: string, file: Buffer) {
        await this.s3client.send(
            new PutObjectCommand({
                Bucket: 'nest-applications',
                Key: fileName,
                Body: file,
            })
        );
    }
}