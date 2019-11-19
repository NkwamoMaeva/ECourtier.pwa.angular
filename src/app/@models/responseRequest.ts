export class ResponseRequest<T> {
  success: boolean;
  data: T[];
  message: string;
}
