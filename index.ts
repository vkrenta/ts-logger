import { promises } from 'fs';

export type Level = 'log' | 'info' | 'warn' | 'error';
export type Input = {
  level: Level;
  timestamp: Date;
  label: string | null;
};
export type OutFile = {
  level: Level;
  path: string;
};

function logFunc(level: Level) {
  return function (this: Logger, input: any) {
    let { label, message } = input;
    if (!label) {
      label = null;
      message = input;
    }
    if (!!this.format)
      this.output(
        level,
        this.format({ level, label, timestamp: new Date() }),
        message
      );
    else throw Error('Formatter must be initializied!');
    return this;
  };
}

export class Logger {
  private allowConsole: boolean = false;
  protected format?: (input: Input) => string;
  private outFiles: Array<OutFile | string> = [];

  public Console(allow: boolean = true) {
    this.allowConsole = allow;
    return this;
  }

  public setFormat(formatter: (input: Input) => string) {
    this.format = formatter;
    return this;
  }

  log = logFunc('log');
  info = logFunc('info');
  warn = logFunc('warn');
  error = logFunc('error');

  public File(file: OutFile | string) {
    this.outFiles.push(file);
    return this;
  }

  protected output(level: Level, text: string, message: any) {
    if (this.allowConsole) console.log(text, message);

    this.outFiles.forEach((outFile) => {
      let filePath: string | null = null;

      if (typeof outFile === 'object' && outFile.level === level)
        filePath = outFile.path;
      if (typeof outFile === 'string') filePath = outFile;
      if (!!filePath)
        promises.appendFile(
          filePath,
          `${text}  ${JSON.stringify(message, null, '  ')}\n`
        );
    });
  }
}
