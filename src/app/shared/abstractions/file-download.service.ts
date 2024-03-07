export abstract class FileDownloadService {
  public abstract downloadText(text: string, filename: string): void
}
