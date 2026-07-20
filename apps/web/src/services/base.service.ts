/**
 * Base service class for API interactions.
 * Feature-specific services can extend this class.
 */
export abstract class BaseService {
  protected abstract readonly basePath: string;

  protected getUrl(path = ''): string {
    return `${this.basePath}${path}`;
  }
}
