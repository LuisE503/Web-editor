/**
 * Storage API - Gestión de almacenamiento de snippets
 * Usa IndexedDB con fallback a localStorage
 * 
 * API:
 * - saveSnippet(snippet): Guardar un snippet
 * - getSnippet(id): Obtener un snippet por ID
 * - getAllSnippets(): Obtener todos los snippets
 * - deleteSnippet(id): Eliminar un snippet
 * - updateSnippet(id, data): Actualizar un snippet
 * - clearAllSnippets(): Eliminar todos los snippets
 */

const STORAGE_VERSION = 1;
const DB_NAME = 'HTMLKitHub';
const STORE_NAME = 'snippets';
const LOCALSTORAGE_KEY = 'htmlkit_snippets';

class Storage {
  constructor() {
    this.db = null;
    this.useIndexedDB = this.checkIndexedDBSupport();
    this.initPromise = this.init();
  }

  /**
   * Verificar soporte de IndexedDB
   */
  checkIndexedDBSupport() {
    try {
      return typeof indexedDB !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  /**
   * Inicializar la base de datos
   */
  async init() {
    if (!this.useIndexedDB) {
      console.warn('IndexedDB no disponible, usando localStorage como fallback');
      return true;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, STORAGE_VERSION);

      request.onerror = () => {
        console.error('Error al abrir IndexedDB:', request.error);
        this.useIndexedDB = false;
        resolve(false);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Crear object store si no existe
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id',
            autoIncrement: false 
          });

          // Crear índices
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  /**
   * Esperar a que la DB esté lista
   */
  async ready() {
    await this.initPromise;
  }

  /**
   * Generar ID único
   */
  generateId() {
    return `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Guardar snippet usando IndexedDB
   */
  async saveSnippetIndexedDB(snippet) {
    await this.ready();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Añadir metadatos
      const now = new Date().toISOString();
      const data = {
        id: snippet.id || this.generateId(),
        name: snippet.name || 'Sin título',
        html: snippet.html || '',
        css: snippet.css || '',
        js: snippet.js || '',
        createdAt: snippet.createdAt || now,
        updatedAt: now
      };

      const request = store.put(data);

      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Guardar snippet usando localStorage
   */
  saveSnippetLocalStorage(snippet) {
    try {
      const snippets = this.getAllSnippetsLocalStorage();
      
      const now = new Date().toISOString();
      const data = {
        id: snippet.id || this.generateId(),
        name: snippet.name || 'Sin título',
        html: snippet.html || '',
        css: snippet.css || '',
        js: snippet.js || '',
        createdAt: snippet.createdAt || now,
        updatedAt: now
      };

      // Buscar si existe
      const index = snippets.findIndex(s => s.id === data.id);
      
      if (index >= 0) {
        snippets[index] = data;
      } else {
        snippets.push(data);
      }

      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(snippets));
      return data;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      throw error;
    }
  }

  /**
   * Guardar snippet (método público)
   */
  async saveSnippet(snippet) {
    if (this.useIndexedDB) {
      return await this.saveSnippetIndexedDB(snippet);
    } else {
      return this.saveSnippetLocalStorage(snippet);
    }
  }

  /**
   * Obtener todos los snippets desde IndexedDB
   */
  async getAllSnippetsIndexedDB() {
    await this.ready();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtener todos los snippets desde localStorage
   */
  getAllSnippetsLocalStorage() {
    try {
      const data = localStorage.getItem(LOCALSTORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return [];
    }
  }

  /**
   * Obtener todos los snippets (método público)
   */
  async getAllSnippets() {
    if (this.useIndexedDB) {
      return await this.getAllSnippetsIndexedDB();
    } else {
      return this.getAllSnippetsLocalStorage();
    }
  }

  /**
   * Obtener un snippet por ID desde IndexedDB
   */
  async getSnippetIndexedDB(id) {
    await this.ready();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtener un snippet por ID desde localStorage
   */
  getSnippetLocalStorage(id) {
    const snippets = this.getAllSnippetsLocalStorage();
    return snippets.find(s => s.id === id);
  }

  /**
   * Obtener un snippet por ID (método público)
   */
  async getSnippet(id) {
    if (this.useIndexedDB) {
      return await this.getSnippetIndexedDB(id);
    } else {
      return this.getSnippetLocalStorage(id);
    }
  }

  /**
   * Eliminar un snippet desde IndexedDB
   */
  async deleteSnippetIndexedDB(id) {
    await this.ready();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Eliminar un snippet desde localStorage
   */
  deleteSnippetLocalStorage(id) {
    try {
      const snippets = this.getAllSnippetsLocalStorage();
      const filtered = snippets.filter(s => s.id !== id);
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
      throw error;
    }
  }

  /**
   * Eliminar un snippet (método público)
   */
  async deleteSnippet(id) {
    if (this.useIndexedDB) {
      return await this.deleteSnippetIndexedDB(id);
    } else {
      return this.deleteSnippetLocalStorage(id);
    }
  }

  /**
   * Actualizar un snippet (método público)
   */
  async updateSnippet(id, updates) {
    const snippet = await this.getSnippet(id);
    
    if (!snippet) {
      throw new Error(`Snippet con ID ${id} no encontrado`);
    }

    const updatedSnippet = {
      ...snippet,
      ...updates,
      id, // Asegurar que el ID no cambie
      updatedAt: new Date().toISOString()
    };

    return await this.saveSnippet(updatedSnippet);
  }

  /**
   * Eliminar todos los snippets desde IndexedDB
   */
  async clearAllSnippetsIndexedDB() {
    await this.ready();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Eliminar todos los snippets desde localStorage
   */
  clearAllSnippetsLocalStorage() {
    try {
      localStorage.removeItem(LOCALSTORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      throw error;
    }
  }

  /**
   * Eliminar todos los snippets (método público)
   */
  async clearAllSnippets() {
    if (this.useIndexedDB) {
      return await this.clearAllSnippetsIndexedDB();
    } else {
      return this.clearAllSnippetsLocalStorage();
    }
  }

  /**
   * Exportar todos los snippets como JSON
   */
  async exportSnippets() {
    const snippets = await this.getAllSnippets();
    return JSON.stringify(snippets, null, 2);
  }

  /**
   * Importar snippets desde JSON
   */
  async importSnippets(jsonString) {
    try {
      const snippets = JSON.parse(jsonString);
      
      if (!Array.isArray(snippets)) {
        throw new Error('El formato no es válido');
      }

      const results = [];
      for (const snippet of snippets) {
        results.push(await this.saveSnippet(snippet));
      }

      return results;
    } catch (error) {
      console.error('Error al importar snippets:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de almacenamiento
   */
  async getStats() {
    const snippets = await this.getAllSnippets();
    
    return {
      total: snippets.length,
      storageType: this.useIndexedDB ? 'IndexedDB' : 'localStorage',
      totalSize: JSON.stringify(snippets).length
    };
  }
}

// Crear instancia única (singleton)
const storage = new Storage();

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.storage = storage;
}

export default storage;
