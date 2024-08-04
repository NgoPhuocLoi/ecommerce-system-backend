const buildCategoryFilter = (query) => {
  const { topLevel, parentId } = query;

  if (topLevel) {
    return {
      parentId: null,
    };
  }

  if (parentId) {
    return {
      parentId: parseInt(parentId),
    };
  }
};

module.exports = {
  buildCategoryFilter,
};
