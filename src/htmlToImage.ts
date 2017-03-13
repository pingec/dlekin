import { execFile } from "child_process";


export function generateImage(imgConfig, grayscaleConfig, imageGenerated: (err: Error, data: string) => void) {

    let input = imgConfig.input;
    let output = imgConfig.output;
    let cmd: string = imgConfig.command
    let args: string = <string>imgConfig.args;
    args = args.replace("{input}", input).replace("{output}", output);

    execFile(cmd, args.split(" "), (error, stdout, stderr) => {
        if (error) imageGenerated(error, null);

        let input = grayscaleConfig.input;
        let output = grayscaleConfig.output;
        let cmd: string = grayscaleConfig.command;
        let args: string = grayscaleConfig.args;
        args = args.replace("{input}", input).replace("{output}", output);

        execFile(cmd, args.split(" "), (error: any, stdout: any, stderr: any) => {
            imageGenerated(error, output);
        });
    });
}


