export abstract class FileDownloadService {
  public abstract downloadText(text: string, filename: string): void
  public abstract downloadJson(data: unknown, filename: string): void
}
