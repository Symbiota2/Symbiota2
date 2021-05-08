import { RequestLoggerInterceptor } from './request-logger.interceptor';

describe('LoggerInterceptor', () => {
  it('should be defined', () => {
    expect(new RequestLoggerInterceptor()).toBeDefined();
  });
});
