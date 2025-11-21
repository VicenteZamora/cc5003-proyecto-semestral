import axios from "axios";

export interface CreateGuideData {
  title: string;
  content: string;
  tags: string;
  game: string; // id
}

export const createGuide = async (guideData: CreateGuideData) => {
  try {
    const response = await axios.post("/api/guides", guideData);
    return response.data;
  } catch (error) {
    console.error("Error creating guide:", error);
    throw error;
  }
};

export const getAllGuides = async () => {
  try {
    const response = await axios.get("/api/guides");
    return response.data;
  } catch (error) {
    console.error("Error fetching guides:", error);
    throw error;
  }
};

export const getGuideById = async (id: string) => {
  try {
    const response = await axios.get(`/api/guides/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching guide:", error);
    throw error;
  }
};

export const updateGuide = async (id: string, guideData: Partial<CreateGuideData>) => {
  try {
    const response = await axios.put(`/api/guides/${id}`, guideData);
    return response.data;
  } catch (error) {
    console.error("Error updating guide:", error);
    throw error;
  }
};

export const deleteGuide = async (id: string) => {
  try {
    await axios.delete(`/api/guides/${id}`);
  } catch (error) {
    console.error("Error deleting guide:", error);
    throw error;
  }
};