/**
 * IndexedDB utility for storing and retrieving data
 */

// Database configuration
const DB_CONFIG = {
  name: 'MiceIdInventory',
  version: 1,
  stores: {
    hotels: { keyPath: 'id', autoIncrement: true },
    venues: { keyPath: 'id', autoIncrement: true },
    uploads: { keyPath: 'id', autoIncrement: true },
    rooms: { keyPath: 'id', autoIncrement: true }
  }
};

// Initialize the database
let db;
const dbPromise = new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
  
  request.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
    reject(event.target.error);
  };
  
  request.onsuccess = (event) => {
    db = event.target.result;
    resolve(db);
  };
  
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    
    // Create object stores if they don't exist
    Object.entries(DB_CONFIG.stores).forEach(([storeName, storeConfig]) => {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, storeConfig);
      }
    });
  };
});

/**
 * Get the database instance (initialized)
 * @returns {Promise<IDBDatabase>} Database instance
 */
async function getDatabase() {
  return await dbPromise;
}

/**
 * Save data to the specified store
 * @param {string} storeName - Name of the store
 * @param {Object} data - Data to save
 * @returns {Promise<string>} - ID of the saved item
 */
async function saveToStore(storeName, data) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Add timestamp if not present
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    // Add or generate ID
    if (!data.id) {
      data.id = generateUniqueId();
    }
    
    const request = store.add(data);
    
    request.onsuccess = (event) => {
      resolve(data.id);
    };
    
    request.onerror = (event) => {
      console.error('Error adding data to store:', event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      console.log(`Data saved to ${storeName} successfully`);
    };
  });
}

/**
 * Get all items from the specified store
 * @param {string} storeName - Name of the store
 * @returns {Promise<Array>} - Array of items
 */
async function getAllFromStore(storeName) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error('Error getting data from store:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Get a specific item by ID from the store
 * @param {string} storeName - Name of the store
 * @param {string} id - Item ID
 * @returns {Promise<Object|null>} - The item or null if not found
 */
async function getItemById(storeName, id) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      resolve(event.target.result || null);
    };
    
    request.onerror = (event) => {
      console.error('Error getting item by ID:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Update an existing item in the store
 * @param {string} storeName - Name of the store
 * @param {string} id - Item ID to update
 * @param {Object} newData - New data to merge with existing data
 * @returns {Promise<boolean>} - Success status
 */
async function updateItemInStore(storeName, id, newData) {
  const db = await getDatabase();
  
  return new Promise(async (resolve, reject) => {
    try {
      // First get the existing item
      const existingItem = await getItemById(storeName, id);
      
      if (!existingItem) {
        resolve(false);
        return;
      }
      
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Update timestamp
      newData.lastUpdated = new Date().toISOString();
      
      // Merge with existing data
      const updatedItem = { ...existingItem, ...newData };
      
      const request = store.put(updatedItem);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error updating item:', event.target.error);
        reject(event.target.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Delete an item from the store
 * @param {string} storeName - Name of the store
 * @param {string} id - Item ID to delete
 * @returns {Promise<boolean>} - Success status
 */
async function deleteItemFromStore(storeName, id) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = (event) => {
      console.error('Error deleting item:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Save a file to the uploads store
 * @param {File} file - The file to store
 * @returns {Promise<Object>} - Promise resolving to file info
 */
async function saveFileToStore(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async function(event) {
        const base64String = event.target.result;
        const fileData = {
          id: generateUniqueId(),
          filename: file.name,
          contentType: file.type,
          size: file.size,
          data: base64String,
          timestamp: new Date().toISOString()
        };
        
        try {
          await saveToStore('uploads', fileData);
          
          // Return file info without the data to save memory
          const fileInfo = {
            id: fileData.id,
            filename: fileData.filename,
            contentType: fileData.contentType,
            size: fileData.size
          };
          
          resolve(fileInfo);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = function() {
        reject(new Error("Failed to read file"));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate a unique ID for data items
 * @returns {string} - Unique ID
 */
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Clear all data from a specific store or all stores
 * @param {string} storeName - Optional specific store to clear
 * @returns {Promise<boolean>} - Success status
 */
async function clearStore(storeName) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    try {
      if (storeName) {
        // Clear specific store
        if (db.objectStoreNames.contains(storeName)) {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          
          request.onsuccess = () => {
            resolve(true);
          };
          
          request.onerror = (event) => {
            console.error('Error clearing store:', event.target.error);
            reject(event.target.error);
          };
        } else {
          resolve(false);
        }
      } else {
        // Clear all stores
        const storeNames = Array.from(db.objectStoreNames);
        let completedStores = 0;
        
        storeNames.forEach((storeName) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          
          request.onsuccess = () => {
            completedStores++;
            if (completedStores === storeNames.length) {
              resolve(true);
            }
          };
          
          request.onerror = (event) => {
            console.error('Error clearing stores:', event.target.error);
            reject(event.target.error);
          };
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}