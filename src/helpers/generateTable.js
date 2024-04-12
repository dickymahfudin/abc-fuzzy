const { Op } = require('sequelize');

const generateTable = async ({ req, model, filter = {}, options = {} }) => {
  const { columns, order, start, length, search, draw } = req;

  const paramQuery = {
    offset: start ? +start : 0,
    limit: length ? +length : 10,
    where: { ...filter },
    order: [],
    ...options,
  };

  if (order) {
    const ordering = order?.[0];
    paramQuery.order.push([columns?.[ordering.column]?.data, ordering.dir]);
  }

  if (search?.value) {
    const searchId = parseInt(search.value.replace(/\D/g, ''), 10);

    const columnSearch = columns
      .filter(el => el.searchable === 'true')
      .map(el => ({
        [el.data]: { [Op.like]: el.data === 'id' ? `%${searchId}%` : `%${search.value}%` },
      }));
    paramQuery.where[Op.or] = columnSearch;
  }
  const data = await model.findAll(paramQuery);
  const totalData = await model.count({ where: paramQuery.where });

  return {
    draw,
    data,
    recordsTotal: totalData,
    recordsFiltered: totalData,
    totalPage: Math.ceil(totalData / paramQuery.limit),
  };
};

module.exports = generateTable;
