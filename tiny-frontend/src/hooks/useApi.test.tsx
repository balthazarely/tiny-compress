import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCompress } from './useApi';

const mockFetch = vi.fn();

describe('useCompress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    vi.stubGlobal('fetch', mockFetch);
    import.meta.env.VITE_API_URL = 'http://localhost:3000';
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useCompress('user123'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.compress).toBe('function');
  });

  it('compresses file successfully', async () => {
    const mockResponse = {
      originalSize: 1000,
      compressedSize: 500,
      file: 'base64data',
      fileType: 'image/webp',
      filename: 'test-compressed.webp',
    };

    mockFetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useCompress('user123'));
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    let compressResult;
    await waitFor(async () => {
      compressResult = await result.current.compress(file, 'webp', 75);
    });

    expect(compressResult).toEqual(mockResponse);
  });

  it('sets isLoading to true during compression', async () => {
    let resolveResponse: any;
    const responsePromise = new Promise(resolve => {
      resolveResponse = resolve;
    });

    mockFetch.mockReturnValueOnce({
      json: () => responsePromise,
    });

    const { result } = renderHook(() => useCompress('user123'));
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    result.current.compress(file);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    resolveResponse({ file: 'data', originalSize: 100, compressedSize: 50 });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles compression errors', async () => {
    const error = new Error('Network error');
    mockFetch.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCompress('user123'));
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    await waitFor(async () => {
      await result.current.compress(file);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.isLoading).toBe(false);
  });

  it('sends correct FormData to API', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ file: 'data' }),
    });

    const { result } = renderHook(() => useCompress('user123'));
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    await waitFor(async () => {
      await result.current.compress(file, 'jpeg', 80);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/compress',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );

    const callArgs = mockFetch.mock.calls[0];
    const formData = callArgs[1].body;
    expect(formData.get('filename')).toBe('test.png');
    expect(formData.get('format')).toBe('jpeg');
    expect(formData.get('quality')).toBe('80');
    expect(formData.get('userId')).toBe('user123');
  });

  it('uses default format and quality', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ file: 'data' }),
    });

    const { result } = renderHook(() => useCompress('user123'));
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    await waitFor(async () => {
      await result.current.compress(file);
    });

    const callArgs = mockFetch.mock.calls[0];
    const formData = callArgs[1].body;
    expect(formData.get('format')).toBe('webp');
    expect(formData.get('quality')).toBe('75');
  });
});
