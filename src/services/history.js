import API from "./api";

export const getHistory = async () => {
  const response = await API.get("/history");
  return response.data;
};

// Returns the single most recent record for each feature type
// e.g. { crop: {...}, fertilizer: {...}, irrigation: {...}, disease: {...} }
export const getRecentByFeature = async () => {
  const allHistory = await getHistory();

  const recent = {};
  for (const record of allHistory) {
    const type = record.feature_type;
    if (!type) continue;
    // allHistory is already newest-first from the backend,
    // so the first match per type is the most recent one
    if (!recent[type]) {
      recent[type] = record;
    }
  }

  return recent;
};