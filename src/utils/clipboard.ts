/**
 * 云剪贴板 API 客户端库
 * 用于与 Cloudflare Workers 剪贴板服务交互
 */

// ========== 类型定义 ==========

export interface CreateOptions {
  /** 自定义 ID（可选，未提供则自动生成） */
  id?: string;
  /** 过期时间（秒），默认 7 天 */
  expirationTtl?: number;
}

export interface UpdateOptions {
  /** 过期时间（秒），默认 7 天 */
  expirationTtl?: number;
}

export interface CreateResponse {
  success: true;
  key: string;
  url: string;
}

export interface UpdateResponse {
  success: true;
  key: string;
  url: string;
}

export interface DeleteResponse {
  success: true;
  key: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  status: number;
}

export type ApiResponse = CreateResponse | UpdateResponse | DeleteResponse | ErrorResponse;

// ========== 客户端类 ==========

export class ClipboardClient {
  private baseUrl: string;

  /**
   * @param baseUrl 服务根地址，例如 https://clipboard.example.com
   */
  constructor(baseUrl: string) {
    // 移除末尾可能的斜杠
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * 创建新内容
   * @param content 文本内容
   * @param options 可选参数（ID、过期时间）
   * @returns 返回包含 key 和 url 的 JSON 对象
   * @throws {Error} 当请求失败或服务器返回错误时抛出
   */
  async create(content: string, options?: CreateOptions): Promise<CreateResponse> {
    const payload: Record<string, any> = { content };
    if (options?.id) payload.id = options.id;
    if (options?.expirationTtl) payload.expirationTtl = options.expirationTtl;

    const response = await fetch(`${this.baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Create failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Create failed: ${JSON.stringify(data)}`);
    }
    return data as CreateResponse;
  }

  /**
   * 读取内容
   * @param id 内容 ID
   * @returns 文本内容
   * @throws {Error} 当内容不存在或请求失败时抛出
   */
  async get(id: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(id)}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Get failed (${response.status}): ${errorText}`);
    }
    return await response.text();
  }

  /**
   * 更新已有内容
   * @param id 内容 ID
   * @param content 新文本内容
   * @param options 可选参数（过期时间）
   * @returns 返回包含 key 和 url 的 JSON 对象
   * @throws {Error} 当内容不存在或请求失败时抛出
   */
  async update(id: string, content: string, options?: UpdateOptions): Promise<UpdateResponse> {
    const payload: Record<string, any> = { content };
    if (options?.expirationTtl) payload.expirationTtl = options.expirationTtl;

    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Update failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Update failed: ${JSON.stringify(data)}`);
    }
    return data as UpdateResponse;
  }

  /**
   * 删除内容
   * @param id 内容 ID
   * @returns 返回包含 key 的 JSON 对象
   * @throws {Error} 当内容不存在或请求失败时抛出
   */
  async delete(id: string): Promise<DeleteResponse> {
    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Delete failed: ${JSON.stringify(data)}`);
    }
    return data as DeleteResponse;
  }
}

// ========== 便捷函数（可选） ==========

/**
 * 快速创建内容（默认过期 7 天）
 */
export async function quickCreate(baseUrl: string, content: string): Promise<CreateResponse> {
  const client = new ClipboardClient(baseUrl);
  return client.create(content);
}

/**
 * 快速读取内容
 */
export async function quickGet(baseUrl: string, id: string): Promise<string> {
  const client = new ClipboardClient(baseUrl);
  return client.get(id);
}

/**
 * 快速更新内容
 */
export async function quickUpdate(
  baseUrl: string,
  id: string,
  content: string,
  expirationTtl?: number
): Promise<UpdateResponse> {
  const client = new ClipboardClient(baseUrl);
  return client.update(id, content, { expirationTtl });
}

/**
 * 快速删除内容
 */
export async function quickDelete(baseUrl: string, id: string): Promise<DeleteResponse> {
  const client = new ClipboardClient(baseUrl);
  return client.delete(id);
}