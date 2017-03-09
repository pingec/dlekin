import { execFile } from "child_process";


export function generateImage(imgConfig, grayscaleConfig, imageGenerated: (err: Error, data: string) => void) {

    let input = imgConfig.in;
    let output = imgConfig.out;
    let cmd = imgConfig.command;

    let args = ["--zoom", imgConfig.zoom,
        "--height", imgConfig.height,
        "--width", imgConfig.width,
        "--quality", "100",
        "--disable-smart-width",
        input,
        output];

    execFile(cmd, args, (error, stdout, stderr) => {
        if (error) imageGenerated(error, null);

        let input = grayscaleConfig.in;
        let output = grayscaleConfig.out;
        let cmd = grayscaleConfig.command;
        let args = [input,
            "-colors", "16",
            "-colorspace", "Gray",
            output];

        execFile(cmd, args, (error: any, stdout: any, stderr: any) => {
            imageGenerated(error, output);
        });
    });
}


