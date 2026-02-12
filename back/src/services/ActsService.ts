import allActs from "../acts.js";

export const getAllActs = (req, res) => {
  res.json(allActs);
};

export const getActsByIds = (acts_ids: string[]) => {
  const idsToFind = new Set(acts_ids);
  return allActs.filter((act) => idsToFind.has(act.act_id));
};
