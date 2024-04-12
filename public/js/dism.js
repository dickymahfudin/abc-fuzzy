$(document).ready(function () {
  const idTable = '#dataTable';
  const me = $(idTable);
  if (me.length && currentUrl) {
    const url = `${currentUrl}/table`;
    const parsUrl = url.split('/')[0];
    const columns = [];

    $(`${idTable} th`).each(function (i) {
      const key = $(this).attr('key');
      const typeRender = $(this).attr('render');
      let render;
      if (typeRender === 'currency') {
        render = function (data) {
          return parseInt(data).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          });
        };
      }
      columns.push({ data: key, type: 'string', render });
    });

    const isDetail = me.attr('detail') === 'true';
    const isEdit = me.attr('edit') === 'true';
    const isDelete = me.attr('delete') === 'true';

    if (isDetail || isEdit || isDelete) {
      columns.push({
        data: 'id',
        title: '',
        searchable: false,
        sortable: false,
        render: function (id, type, full, meta) {
          const header = `<span><form action="/${parsUrl}/delete/${id}" method="POST">`;
          const footer = `</form></span>`;

          const btnEdit = `<a href="/${parsUrl}/form/${id}">
              <i class='h4 bx bxs-message-square-edit'></i>
            </a> `;

          const btnDeleted = `
            <a style="cursor: pointer;" onclick="if (confirm('Anda yakin ingin menghapus item ini?')){return this.parentNode.submit();}else{event.stopPropagation();};">
                <i class='h4 bx bxs-trash-alt' style='color:#f50000'></i>
            </a>`;

          const renderBtn = [];
          if (isEdit) renderBtn.push(btnEdit);
          if (isDelete) renderBtn.push(btnDeleted);

          return `${header}${renderBtn.join('|')}${footer}`;
        },
      });
    }

    new DataTable(idTable, {
      columns,
      ajax: { url },
      scrollX: true,
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
        },
      ],
      processing: true,
      serverSide: true,
    });
  }
});
