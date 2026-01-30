import axios from 'axios';

export const safeGet = async <T>(url: string, fallback: T): Promise<T> => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch {
    return fallback;
  }
};