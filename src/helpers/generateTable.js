const { Op } = require('sequelize');

const generateTable = async ({ req, model, attributes = {} }) => {
  const { columns, order, start, length, search, draw } = req;

  const paramQuery = {
    offset: start ? +start : 0,
    limit: length ? +length : 10,
    where: {},
    order: [],
    attributes,
  };

  if (order) {
    const ordering = order?.[0];
    paramQuery.order.push([columns?.[ordering.column]?.data, ordering.dir]);
  }

  if (search?.value) {
    const columnSearch = columns
      .filter(el => el.searchable === 'true')
      .map(el => ({ [el.data]: { [Op.like]: `%${search.value}%` } }));
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
