export abstract class ResponseParser {
  public abstract parseResponse(response: unknown): unknown
}
