import { useState, useEffect } from 'react';

const useLocalStorage = (key) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, [key]);

  const loadData = async () => {
    try {
      const storedData = localStorage.getItem(key);
      if (storedData !== null) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error(`Error loading data from localStorage for key "${key}":`, error);
    }
  };

  const saveData = async (newData) => {
    try {
      const dataToSave = JSON.stringify(newData);
      localStorage.setItem(key, dataToSave);
      console.log(`Data for key "${key}" saved successfully!`);
      setData(newData);
    } catch (error) {
      console.error(`Error saving data to localStorage for key "${key}":`, error);
    }
  };

  const deleteData = async () => {
    try {
      localStorage.removeItem(key);
      console.log(`Data for key "${key}" deleted successfully!`);
      setData(null);
    } catch (error) {
      console.error(`Error deleting data from localStorage for key "${key}":`, error);
    }
  };

  return { userData: data, saveData, deleteData };
};

export default useLocalStorage;

