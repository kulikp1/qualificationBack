const parseType = (type) => {
  if (typeof type !== 'string') return;
  const types = ['work', 'home', 'personal'];
  if (types.includes(type)) return type;
};

const parseBoolean = (boolean) => {
  if (!['true', 'false'].includes(boolean)) return;

  return boolean === 'true' ? true : false;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  return {
    type: parseType(type),
    isFavourite: parseBoolean(isFavourite),
  };
};