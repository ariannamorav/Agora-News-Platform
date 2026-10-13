
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private readonly databaseName = 'AgoraDatabase';
  private readonly storeName = 'images';
  private readonly databaseVersion = 1;

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        this.databaseName,
        this.databaseVersion
      );

      request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveImage(id: number, file: File): Promise<void> {
    const database = await this.openDatabase();

    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(
          this.storeName,
          'readwrite'
        );

        transaction.objectStore(this.storeName).put(file, id);

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally {
      database.close();
    }
  }

  async getImage(id: number): Promise<Blob | undefined> {
    const database = await this.openDatabase();

    try {
      return await new Promise<Blob | undefined>((resolve, reject) => {
        const transaction = database.transaction(
          this.storeName,
          'readonly'
        );

        const request = transaction.objectStore(this.storeName).get(id);

        request.onsuccess = () => {
          resolve(request.result as Blob | undefined);
        };

        request.onerror = () => reject(request.error);
      });
    } finally {
      database.close();
    }
  }

  async deleteImage(id: number): Promise<void> {
    const database = await this.openDatabase();

    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(
          this.storeName,
          'readwrite'
        );

        transaction.objectStore(this.storeName).delete(id);

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally {
      database.close();
    }
  }
}
