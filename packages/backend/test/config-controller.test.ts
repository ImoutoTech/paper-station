import { describe, expect, it, vi } from 'vitest';
import { ConfigController } from '../src/module/config/config.controller';

describe('ConfigController', () => {
  it('falls back to the Referer origin for same-origin GET requests', async () => {
    const getConfig = vi.fn().mockResolvedValue({ theme: 'default' });
    const controller = new ConfigController({ getConfig } as never);
    const reply = { send: vi.fn() };

    await controller.getConfig(
      'index',
      undefined,
      'https://paper.imouto.tech/',
      reply as never,
    );

    expect(getConfig).toHaveBeenCalledWith(
      'index',
      'https://paper.imouto.tech',
    );
    expect(reply.send).toHaveBeenCalledWith({ theme: 'default' });
  });
});
