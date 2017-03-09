import { execFile } from "child_process";

export function generateImage(config) {

    let input = config.in;
    let output = config.out;
    let cmd = config.command;

    let args = ["--zoom", config.zoom,
        "--height", config.height,
        "--width", config.width,
        "--disable-smart-width",
        input,
        output];

    execFile(cmd, args, (error: any, stdout: any, stderr: any) => {
        if (error) throw error;
    });
}


