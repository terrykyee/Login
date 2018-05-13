// @flow
/**
 * Utilities for using LocalStorage
 */

const LocalStorageAccessErrorMessages = {
  LOAD_ERROR: 'Error in accessing local storage',
  SAVE_ERROR: 'Error in saving to local storage',
  REMOVE_ERROR: 'Error in removing local storage item',
};

/**
 * Keys for accessing configuration from local storage
 */
export class StorageKeys {
  static USER_INFO = 'login.userInfo';
}

export class LocalStorageUtilities {
  /**
   * Deserializes an item from LocalStorage
   * @param key - The key of the item to retrieve
   * @return The deserialized item.
   * @throws {Object} Error if localStorage is disabled or if the data is not well formed JSON
   */
  static deserializeItem(key: string): any {
    try {
      const serializedState: ?string = window.localStorage.getItem(key);
      if (serializedState === null || serializedState === undefined) {
        return null;
      }

      return JSON.parse(serializedState);
    } catch (err) {
      console.log (LocalStorageAccessErrorMessages.LOAD_ERROR);
    }
  }

  /**
   * Serializes an item to LocalStorage
   * @param key - The key of the item to serialize to
   * @param item - The item to serialize
   * @throws {Object} Error if localStorage is disabled
   */
  static serializeItem(key: string, item: any) {
    try {
      window.localStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
      console.log (LocalStorageAccessErrorMessages.SAVE_ERROR);
    }
  }

  /**
   * Removes an item in LocalStorage
   * @param key - The key of the item to remove
   */
  static removeItem(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.log (LocalStorageAccessErrorMessages.REMOVE_ERROR);
    }
  }
}
