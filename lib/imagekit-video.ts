import ImageKit from 'imagekit';

// Separate ImageKit instance for video uploads
// Uses different credentials from the image upload service
const imagekitVideo = new ImageKit({
    publicKey: process.env.IMAGEKIT_VIDEO_PUBLIC_KEY || 'public_c8RfdQCwVHIQlSuC5g2b/iHmJgU=',
    privateKey: process.env.IMAGEKIT_VIDEO_PRIVATE_KEY || 'private_0NtnmEtBrFfwPaIeIoxRE/+F5p8=',
    urlEndpoint: process.env.IMAGEKIT_VIDEO_URL_ENDPOINT || 'https://ik.imagekit.io/9vypqsd8w'
});

export interface VideoUploadResult {
    url: string;
    thumbnailUrl: string;
    fileId: string;
    name: string;
    size: number;
}

export async function uploadVideo(
    file: Buffer,
    fileName: string
): Promise<VideoUploadResult> {
    const response = await imagekitVideo.upload({
        file: file,
        fileName: fileName,
        folder: '/reels',
        useUniqueFileName: true,
    });

    return {
        url: response.url,
        thumbnailUrl: response.thumbnailUrl || `${response.url}/ik-thumbnail.jpg`,
        fileId: response.fileId,
        name: response.name,
        size: response.size,
    };
}

export async function deleteVideo(fileId: string): Promise<void> {
    await imagekitVideo.deleteFile(fileId);
}

export function getVideoAuthParams() {
    return imagekitVideo.getAuthenticationParameters();
}

export default imagekitVideo;
