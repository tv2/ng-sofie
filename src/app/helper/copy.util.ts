export class CopyUtil {
  public static deepCopy<T>(obj: unknown): T {
    return JSON.parse(JSON.stringify(obj))
  }
}
