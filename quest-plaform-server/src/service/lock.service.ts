export class LockManager {
  private locks: Map<string, Promise<void>> = new Map();

  async acquireLock(
    key: string,
    task: () => Promise<void>,
    timeout: number = 5000
  ): Promise<void> {
    // 检查是否已经存在锁
    if (this.locks.has(key)) {
      throw new Error('Lock already acquired');
    }

    // 创建新的锁
    const newLock = (async () => {
      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Lock timeout')), timeout)
      );

      try {
        await Promise.race([task(), timeoutPromise]);
      } finally {
        // 释放锁
        this.locks.delete(key);
      }
    })();

    // 更新锁
    this.locks.set(key, newLock);

    return newLock;
  }
}
